import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Send, CheckCircle, Sparkles, TrendingUp, Gift, Loader2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import PropertySharesABI from '../../abi/PropertyShares.json';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';
import { useDistributions } from '../../hooks/useDistributions';

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

interface OnChainProperty {
  id: string;
  name: string;
  shareToken: string;
  expectedMonthlyRevenue?: bigint;
}

const AdminRewards: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [rewardPeriod, setRewardPeriod] = useState('');
  const [isDistributing, setIsDistributing] = useState(false);
  const [properties, setProperties] = useState<OnChainProperty[]>([]);
  
  const { showToast, showModal } = useNotification();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { distributions, stats, loading: distributionsLoading, error: distributionsError, createDistribution } = useDistributions();

  // Récupérer la liste des propriétés on-chain avec leurs revenus attendus
  useEffect(() => {
    const fetchProperties = async () => {
      if (!publicClient || !IMMO_PROPERTY_ADDRESS) return;
      try {
        const count = await publicClient.readContract({
          address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
          abi: ImmoPropertyABI.abi,
          functionName: 'getPropertiesCount',
        }) as bigint;
        
        const props: OnChainProperty[] = [];
        for (let i = 1; i <= Number(count); i++) {
          const property = await publicClient.readContract({
            address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
            abi: ImmoPropertyABI.abi,
            functionName: 'getProperty',
            args: [BigInt(i)],
          }) as any;
          
          // Récupérer le revenu mensuel attendu
          let expectedMonthlyRevenue: bigint | undefined;
          try {
            expectedMonthlyRevenue = await publicClient.readContract({
              address: property.shareToken as `0x${string}`,
              abi: PropertySharesABI.abi,
              functionName: 'getExpectedMonthlyRevenue',
            }) as bigint;
          } catch (e) {
            console.warn('Impossible de récupérer le revenu mensuel pour la propriété', i);
          }
          
          props.push({
            id: `${i}`,
            name: property.name,
            shareToken: property.shareToken,
            expectedMonthlyRevenue,
          });
        }
        setProperties(props);
      } catch (e) {
        console.error('Erreur lors de la récupération des propriétés:', e);
        setProperties([]);
      }
    };
    fetchProperties();
  }, [publicClient]);

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) {
      showToast({
        type: 'error',
        title: 'Propriété non trouvée',
        message: 'Veuillez sélectionner une propriété valide.'
      });
      return;
    }

    if (!property.expectedMonthlyRevenue) {
      showToast({
        type: 'error',
        title: 'Revenu non disponible',
        message: 'Impossible de récupérer le revenu mensuel pour cette propriété.'
      });
      return;
    }

    const amountInEth = Number(property.expectedMonthlyRevenue) / 1e18;
    
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Confirmer la distribution',
      message: `Distribuer ${amountInEth.toFixed(4)} ETH (${(amountInEth * 3000).toFixed(2)} USD) aux investisseurs de ${property.name} pour ${rewardPeriod} ?`,
      confirmText: 'Distribuer',
      cancelText: 'Annuler'
    });

    if (!confirmed) return;
    
    setIsDistributing(true);
    
    try {
      if (!walletClient) throw new Error('Wallet not connected');
      
      // Appel on-chain pour distribuer les rewards
      const tx = await walletClient.writeContract({
        address: property.shareToken as `0x${string}`,
        abi: PropertySharesABI.abi,
        functionName: 'distributeMonthlyYield',
        account: address,
      });
      
      // Enregistrer dans le backend
      await createDistribution({
        property_id: property.id,
        property_name: property.name,
        amount: amountInEth.toString(),
        period: rewardPeriod,
        transaction_hash: tx,
      });
      
      showToast({
        type: 'success',
        title: 'Distribution réussie !',
        message: `${amountInEth.toFixed(4)} ETH distribués aux investisseurs de ${property.name}. Tx: ${tx}`
      });
      
      // Reset form
      setSelectedProperty('');
      setRewardPeriod('');
      
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Erreur de distribution',
        message: err?.message || 'La distribution a échoué.'
      });
    } finally {
      setIsDistributing(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-6 py-3 mb-4">
            <Gift className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-semibold">Reward Distribution</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Reward Distribution
          </h1>
          <p className="text-xl text-gray-600">
            Distribute rental income and returns to property investors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Distribution Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
                New Distribution
              </h2>
              
              <form onSubmit={handleDistribute} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Property
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                  >
                    <option value="">Choose a property...</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.expectedMonthlyRevenue ? `$${(Number(property.expectedMonthlyRevenue) / 1e18).toFixed(2)}/mo` : 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Period
                    </label>
                    <input
                      type="text"
                      value={rewardPeriod}
                      onChange={(e) => setRewardPeriod(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                      placeholder="Q4 2024"
                    />
                  </div>
                </div>

                {selectedProperty && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Distribution Preview
                    </h3>
                    <div className="text-sm text-indigo-800 space-y-2">
                      <p>Property: {properties.find(p => p.id === selectedProperty)?.name}</p>
                      <p>Total Amount: {properties.find(p => p.id === selectedProperty)?.expectedMonthlyRevenue ? `$${(Number(properties.find(p => p.id === selectedProperty)?.expectedMonthlyRevenue) / 1e18).toFixed(2)}/mo` : 'N/A'}</p>
                      <p>Estimated Recipients: {Math.floor(Math.random() * 500) + 100} investors</p>
                      <p>Average per Token: {properties.find(p => p.id === selectedProperty)?.expectedMonthlyRevenue ? `$${(Number(properties.find(p => p.id === selectedProperty)?.expectedMonthlyRevenue) / 1e18 / 50000).toFixed(2)}` : 'N/A'}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isDistributing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center"
                >
                  {isDistributing ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isDistributing ? 'Distributing...' : 'Distribute Rewards'}
                </button>
              </form>
            </div>
          </div>

          {/* Stats & Recent Distributions */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
                Distribution Stats
              </h3>
              {distributionsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">This Quarter</span>
                      <span className="font-bold text-emerald-600 text-xl">${stats?.this_quarter || '0'}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total Distributed</span>
                      <span className="font-bold text-indigo-600 text-xl">${stats?.total_distributed || '0'}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Active Properties</span>
                      <span className="font-bold text-cyan-600 text-xl">{stats?.active_properties || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Distributions */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-emerald-600" />
                Recent Distributions
              </h3>
              {distributionsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : distributions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Aucune distribution récente
                </div>
              ) : (
                <div className="space-y-6">
                  {distributions.map((distribution) => (
                    <div key={distribution.id} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{distribution.property_name}</h4>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">${distribution.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period:</span>
                          <span className="font-semibold">{distribution.period}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-semibold">{formatDate(distribution.distributed_at)}</span>
                        </div>
                        {distribution.transaction_hash && (
                          <div className="flex justify-between">
                            <span>Tx:</span>
                            <span className="font-semibold text-indigo-600">{formatAddress(distribution.transaction_hash)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewards;