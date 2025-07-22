import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;
const PROPERTY_FACTORY_ADDRESS = import.meta.env.VITE_PROPERTY_FACTORY_ADDRESS;

interface OwnerPropertyOnChain {
  id: string;
  name: string;
  status: string;
  totalValue: number;
  fundingProgress: number;
  totalRaised: number;
  investors: number;
  submittedDate: Date;
}

const OwnerDashboardOnChain: React.FC = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [ownerProperties, setOwnerProperties] = useState<OwnerPropertyOnChain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('IMMO_PROPERTY_ADDRESS:', IMMO_PROPERTY_ADDRESS);
    console.log('Adresse connectée:', address);
    const fetchOwnerProperties = async () => {
      if (!address || !publicClient) {
        setOwnerProperties([]);
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
        console.log('Nombre de propriétés on-chain:', count);
        const props: OwnerPropertyOnChain[] = [];
        for (let i = 1; i <= count; i++) {
          const property = await publicClient.readContract({
            address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
            abi: ImmoPropertyABI.abi,
            functionName: 'getProperty',
            args: [BigInt(i)],
          }) as any;
          console.log(`Propriété ${i} owner:`, property.owner, '| factory:', PROPERTY_FACTORY_ADDRESS);
          if (property.owner?.toLowerCase() === PROPERTY_FACTORY_ADDRESS.toLowerCase()) {
            console.log(`Propriété ${i} RETENUE (owner = factory)`);
            // Récupérer les métadonnées
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
            // Lire les infos on-chain du token ERC20 lié
            const shareToken = property.shareToken as `0x${string}`;
            let soldShares = 0;
            let maxSupply = 0;
            let unitPrice = 0;
            try {
              const sold = await publicClient.readContract({
                address: shareToken,
                abi: [
                  {"inputs":[],"name":"getSoldShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                  {"inputs":[],"name":"getAvailableShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
                  {"inputs":[],"name":"getUnitPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
                ],
                functionName: 'getSoldShares',
              }) as bigint;
              soldShares = Number(sold);
              const available = await publicClient.readContract({
                address: shareToken,
                abi: [
                  {"inputs":[],"name":"getAvailableShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
                ],
                functionName: 'getAvailableShares',
              }) as bigint;
              maxSupply = soldShares + Number(available);
              const up = await publicClient.readContract({
                address: shareToken,
                abi: [
                  {"inputs":[],"name":"getUnitPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
                ],
                functionName: 'getUnitPrice',
              }) as bigint;
              unitPrice = Number(up) / 1e18;
            } catch {}
            // Progression de financement
            const fundingProgress = maxSupply > 0 ? Math.round((soldShares / maxSupply) * 100) : 0;
            // Montant levé
            const totalRaised = soldShares * unitPrice;
            // Nombre d'investisseurs (optionnel, à 0 si non dispo)
            const investors = 0;
            // Date de soumission (non dispo on-chain)
            const submittedDate = new Date();
            props.push({
              id: `${i}`,
              name: metadata.name || property.name,
              status: 'active',
              totalValue: Number(property.price) / 1e18,
              fundingProgress,
              totalRaised,
              investors,
              submittedDate,
            });
          } else {
            console.log(`Propriété ${i} ignorée (owner différent)`);
          }
        }
        setOwnerProperties(props);
      } catch (err) {
        console.error('Erreur globale fetchOwnerProperties:', err);
        setOwnerProperties([]);
      }
      setLoading(false);
    };
    fetchOwnerProperties();
  }, [address, publicClient]);

  const totalProperties = ownerProperties.length;
  const totalValue = ownerProperties.reduce((sum, prop) => sum + prop.totalValue, 0);
  const totalRaised = ownerProperties.reduce((sum, prop) => sum + prop.totalRaised, 0);
  // const totalInvestors = ownerProperties.reduce((sum, prop) => sum + prop.investors, 0); // supprimé

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case 'funded':
        return <CheckCircle className="h-5 w-5 text-indigo-600" />;
      case 'pending_approval':
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'pending_approval':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-semibold">Property Owner Dashboard (On-Chain)</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Welcome back, Property Owner
          </h1>
          <p className="text-xl text-gray-600">
            Manage your property listings and track investment performance (on-chain)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Properties</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {totalProperties}
                </p>
              </div>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Raised</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  ${(totalRaised / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Ready to List a New Property?</h2>
              </div>
              <p className="text-indigo-100 text-lg mb-6">
                Create a new property listing and start raising funds from investors
              </p>
            </div>
            <Link
              to="/owner/properties/new"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
                My Properties (On-Chain)
              </h2>
              <Link
                to="/owner/properties"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Chargement des propriétés on-chain...</div>
            ) : ownerProperties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Aucune propriété on-chain trouvée.</div>
            ) : (
              ownerProperties.map((property) => (
                <div key={property.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 mr-6">
                        {getStatusIcon(property.status)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                            {property.status.replace('_', ' ').charAt(0).toUpperCase() + property.status.replace('_', ' ').slice(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            Submitted: {property.submittedDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Total Value</p>
                          <p className="text-lg font-bold text-gray-900">${(property.totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Raised</p>
                          <p className="text-lg font-bold text-emerald-600">${(property.totalRaised / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${property.fundingProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{property.fundingProgress}% funded</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardOnChain; 