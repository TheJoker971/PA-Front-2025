import React, { useEffect, useState } from 'react';
import { DollarSign, Calendar, Send, CheckCircle, Sparkles, TrendingUp, Gift } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { usePublicClient, useAccount, useWalletClient } from 'wagmi';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';
import PropertySharesABI from '../../abi/PropertyShares.json';

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;
const PROPERTY_FACTORY_ADDRESS = import.meta.env.VITE_PROPERTY_FACTORY_ADDRESS;

function calculateMonthlyRevenue(propertyPrice: number, annualYield: number) {
  return Math.round((propertyPrice * annualYield) / 10000 / 12);
}

interface OnChainProperty {
  id: string;
  name: string;
  propertyPrice: number;
  annualYield: number;
  shareToken: string;
}

interface DistributionEvent {
  propertyId: string;
  propertyShares: string;
  amount: string;
  timestamp: number;
}

const AdminRewardsOnChain: React.FC = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [properties, setProperties] = useState<OnChainProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [rewardPeriod, setRewardPeriod] = useState('');
  const [isDistributing, setIsDistributing] = useState(false);
  const [recentDistributions, setRecentDistributions] = useState<DistributionEvent[]>([]);
  const { showToast, showModal } = useNotification();

  // Récupérer la liste des propriétés on-chain
  useEffect(() => {
    const fetchProperties = async () => {
      if (!publicClient) {
        setProperties([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const propertiesCount = await publicClient.readContract({
          address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
          abi: ImmoPropertyABI.abi,
          functionName: 'getPropertiesCount',
        }) as bigint;
        const count = Number(propertiesCount);
        const props: OnChainProperty[] = [];
        for (let i = 1; i <= count; i++) {
          const property = await publicClient.readContract({
            address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
            abi: ImmoPropertyABI.abi,
            functionName: 'getProperty',
            args: [BigInt(i)],
          }) as any;
          if (property.owner?.toLowerCase() === PROPERTY_FACTORY_ADDRESS.toLowerCase()) {
            // Métadonnées
            let metadata: any = {};
            try {
              const metadataUri = property.uri;
              if (metadataUri && metadataUri.startsWith('http')) {
                const res = await fetch(metadataUri);
                if (res.ok) {
                  metadata = await res.json();
                }
              }
            } catch {}
            // Infos ERC20
            const shareToken = property.shareToken as `0x${string}`;
            let propertyPrice = Number(property.price) / 1e18;
            let annualYield = 0;
            try {
              annualYield = Number(await publicClient.readContract({
                address: shareToken,
                abi: PropertySharesABI.abi,
                functionName: 'getAnnualYield',
              }) as bigint) / 100;
            } catch {}
            props.push({
              id: `${i}`,
              name: metadata.name || property.name,
              propertyPrice,
              annualYield,
              shareToken,
            });
          }
        }
        setProperties(props);
      } catch {
        setProperties([]);
      }
      setLoading(false);
    };
    fetchProperties();
  }, [publicClient]);

  // Récupérer les events YieldDistributed sur tous les PropertyShares
  useEffect(() => {
    const fetchDistributions = async () => {
      if (!publicClient || properties.length === 0) return;
      let allEvents: DistributionEvent[] = [];
      for (const prop of properties) {
        try {
          const logs = await publicClient.getLogs({
            address: prop.shareToken as `0x${string}`,
            event: {
              name: 'YieldDistributed',
              type: 'event',
              inputs: [
                { indexed: false, name: 'propertyId', type: 'uint256' },
                { indexed: false, name: 'amount', type: 'uint256' },
                { indexed: false, name: 'timestamp', type: 'uint256' },
              ],
            },
            fromBlock: 'earliest',
            toBlock: 'latest',
          });
          for (const log of logs) {
            allEvents.push({
              propertyId: log.args?.propertyId?.toString() ?? 'NaN',
              propertyShares: prop.shareToken,
              amount: log.args?.amount ? (Number(log.args.amount) / 1e18).toLocaleString() : 'NaN',
              timestamp: log.args?.timestamp ? Number(log.args.timestamp) : 0,
            });
          }
        } catch {}
      }
      // Trier du plus récent au plus ancien
      allEvents.sort((a, b) => b.timestamp - a.timestamp);
      setRecentDistributions(allEvents);
    };
    fetchDistributions();
  }, [publicClient, properties]);

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const property = properties.find(p => p.id === selectedProperty);
    if (!property) return;
    const monthlyRevenue = calculateMonthlyRevenue(property.propertyPrice, property.annualYield);
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Confirm Reward Distribution',
      message: `Are you sure you want to distribute $${monthlyRevenue.toLocaleString()} to investors of ${property.name}${rewardPeriod ? ' for ' + rewardPeriod : ''}?`,
      confirmText: 'Distribute',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    setIsDistributing(true);
    try {
      if (!walletClient) throw new Error('Wallet not connected');
      const tx = await walletClient.writeContract({
        address: property.shareToken as `0x${string}`,
        abi: PropertySharesABI.abi,
        functionName: 'distributeMonthlyYield',
        account: address,
      });
      showToast({
        type: 'success',
        title: 'Distribution Sent!',
        message: `Transaction sent: ${tx}`
      });
      setSelectedProperty('');
      setRewardPeriod('');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Distribution Failed',
        message: err?.message || 'Transaction failed.'
      });
    }
    setIsDistributing(false);
  };

  const selected = properties.find(p => p.id === selectedProperty);
  const monthlyRevenue = selected ? calculateMonthlyRevenue(selected.propertyPrice, selected.annualYield) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-6 py-3 mb-4">
            <Gift className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-semibold">Reward Distribution (On-Chain)</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Reward Distribution
          </h1>
          <p className="text-xl text-gray-600">
            Distribute rental income and returns to property investors (on-chain logic)
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
              {loading ? (
                <div>Chargement des propriétés on-chain...</div>
              ) : (
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
                      disabled={isDistributing}
                    >
                      <option value="">Choose a property...</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - {property.propertyPrice.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Period (optional)
                      </label>
                      <input
                        type="text"
                        value={rewardPeriod}
                        onChange={(e) => setRewardPeriod(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                        placeholder="Q4 2024"
                        disabled={isDistributing}
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      {selected && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mt-2">
                          <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Distribution Preview
                          </h3>
                          <div className="text-sm text-indigo-800 space-y-2">
                            <p>Property: {selected.name}</p>
                            <p>Monthly Revenue (calculated): <span className="font-semibold">${monthlyRevenue.toLocaleString()}</span></p>
                            <p>Annual Yield: {selected.annualYield}%</p>
                            <p>Property Value: ${selected.propertyPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center ${isDistributing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={isDistributing || !selectedProperty}
                  >
                    {isDistributing ? (
                      <span className="flex items-center"><Send className="h-5 w-5 mr-2 animate-spin" />Distributing...</span>
                    ) : (
                      <><Send className="h-5 w-5 mr-2" />Distribute Rewards</>
                    )}
                  </button>
                </form>
              )}
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
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">This Quarter</span>
                    <span className="font-bold text-emerald-600 text-xl">$210,000</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Distributed</span>
                    <span className="font-bold text-indigo-600 text-xl">$2.5M</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Active Properties</span>
                    <span className="font-bold text-cyan-600 text-xl">8</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Distributions (on-chain) */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-emerald-600" />
                Recent Distributions (on-chain)
              </h3>
              <div className="space-y-6">
                {recentDistributions.length === 0 ? (
                  <div className="text-gray-500">Aucune distribution trouvée.</div>
                ) : (
                  recentDistributions.map((distribution, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900">Propriété: NaN</h4>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">${distribution.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period:</span>
                          <span className="font-semibold">NaN</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-semibold">{distribution.timestamp ? new Date(distribution.timestamp * 1000).toLocaleDateString() : 'NaN'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PropertyShares:</span>
                          <span className="font-mono text-xs">{distribution.propertyShares.slice(0, 6)}...{distribution.propertyShares.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewardsOnChain; 