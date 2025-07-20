import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { MapPin, TrendingUp, Calendar, Users, FileText, Shield, ArrowLeft, Sparkles, Zap, Star, Building2 } from 'lucide-react';
import { useProperty } from '../hooks/useImmoProperties';
import { useNotification } from '../context/NotificationContext';
import PropertySharesABI from '../abi/PropertyShares.json';
import { useContractRead } from 'wagmi';
import { ethers } from 'ethers';
import { usePublicClient } from 'wagmi';
import { useWriteContract } from 'wagmi';

const OnChainPropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { showToast, showModal } = useNotification();
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const { data, isLoading } = useProperty(Number(propertyId));
  console.log('OnChainPropertyDetails - propertyId:', propertyId, 'data:', data, 'isLoading:', isLoading);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasTriedLoad, setHasTriedLoad] = useState(false);
  const publicClient = usePublicClient();
  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    if (!data) return;
    const tuple = data as any;
    setLoading(true);
    setHasTriedLoad(false);
    fetch(tuple.uri)
      .then(async res => {
        const text = await res.text();
        let meta: Record<string, any> = {};
        try { meta = JSON.parse(text); } catch (e) { console.error('JSON parse error', e); }
        let decimals = 18;
        let totalTokens = tuple.totalShares ? Number(tuple.totalShares) : 0;
        let availableTokens = tuple.totalShares ? Number(tuple.totalShares) : 0;
        if ((tuple.shareToken || tuple.erc20Address) && publicClient) {
          try {
            const tokenAddress = tuple.shareToken || tuple.erc20Address;
            const provider = new ethers.providers.JsonRpcProvider(publicClient.transport.url);
            const contract = new ethers.Contract(tokenAddress, PropertySharesABI.abi, provider);
            decimals = await contract.decimals();
            totalTokens = totalTokens / 10 ** decimals;
            availableTokens = availableTokens / 10 ** decimals;
            // fetch tokenPrice et annualYield aussi ici pour être synchro
            const [unitPrice, annualYield] = await Promise.all([
              contract.getUnitPrice(),
              contract.getAnnualYield(),
            ]);
            setProperty({
              id: propertyId,
              name: tuple.name || tuple.propertyName || '',
              imageUrl: (meta && (meta['mainImage'] || meta['image'])) ? (meta['mainImage'] || meta['image']) : tuple.propertyURI || tuple.uri || '',
              location: (meta && meta['location']) ? meta['location'] : '',
              propertyType: (meta && meta['propertyType']) ? meta['propertyType'] : '',
              status: 'active',
              description: (meta && meta['description']) ? meta['description'] : '',
              totalValue: tuple.propertyPrice ? Number(tuple.propertyPrice) / 1e18 : (tuple.price ? Number(tuple.price) / 1e18 : 0),
              tokenPrice: Number(unitPrice) / 1e18,
              annualYield: Number(annualYield) / 100,
              availableTokens,
              totalTokens,
              decimals,
              tokenAddress,
              documents: meta && meta['documents'] ? meta['documents'] : [],
            });
            setHasTriedLoad(true);
            setLoading(false);
            return;
          } catch (e) { console.error('Erreur lecture PropertyShares', e); }
        }
        // fallback si pas de tokenAddress ou erreur
        setProperty({
          id: propertyId,
          name: tuple.name || tuple.propertyName || '',
          imageUrl: (meta && (meta['mainImage'] || meta['image'])) ? (meta['mainImage'] || meta['image']) : tuple.propertyURI || tuple.uri || '',
          location: (meta && meta['location']) ? meta['location'] : '',
          propertyType: (meta && meta['propertyType']) ? meta['propertyType'] : '',
          status: 'active',
          description: (meta && meta['description']) ? meta['description'] : '',
          totalValue: tuple.propertyPrice ? Number(tuple.propertyPrice) / 1e18 : (tuple.price ? Number(tuple.price) / 1e18 : 0),
          tokenPrice: tuple.unitPrice ? Number(tuple.unitPrice) / 1e18 : (meta && meta['tokenPrice'] ? Number(meta['tokenPrice']) : 0),
          annualYield: tuple.annualYield ? Number(tuple.annualYield) / 100 : (meta && meta['annualYield'] ? Number(meta['annualYield']) : 0),
          availableTokens,
          totalTokens,
          decimals,
          tokenAddress: tuple.shareToken || tuple.erc20Address || '',
          documents: meta && meta['documents'] ? meta['documents'] : [],
        });
        setHasTriedLoad(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error('OnChainPropertyDetails - Fetch error', err);
        setProperty(null);
        setHasTriedLoad(true);
        setLoading(false);
      });
  }, [data, propertyId, publicClient]);

  // Ajout : lecture annualYield et tokenPrice depuis PropertyShares
  useEffect(() => {
    if (!property || !property.tokenAddress) return;
    let isMounted = true;
    async function fetchSharesData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider(publicClient?.transport?.url);
        const contract = new ethers.Contract(property.tokenAddress, PropertySharesABI.abi, provider);
        const [unitPrice, annualYield, decimals, maxSupply, availableShares] = await Promise.all([
          contract.getUnitPrice(),
          contract.getAnnualYield(),
          contract.decimals(),
          contract.MAX_SUPPLY(),
          contract.getAvailableShares(),
        ]);
        if (isMounted) {
          setProperty((prev: any) => prev && ({
            ...prev,
            tokenPrice: Number(unitPrice) / 1e18,
            annualYield: Number(annualYield) / 100,
            totalTokens: Number(maxSupply) / 10 ** Number(decimals),
            availableTokens: Number(availableShares) / 10 ** Number(decimals),
            decimals: Number(decimals),
          }));
        }
      } catch (e) {
        console.error('Erreur lecture PropertyShares', e);
      }
    }
    fetchSharesData();
    return () => { isMounted = false; };
  }, [property?.tokenAddress, propertyId, publicClient]);

  if (
    isLoading ||
    loading ||
    !hasTriedLoad ||
    !property ||
    property.decimals === undefined ||
    property.annualYield === undefined
  ) {
    return <div>Chargement...</div>;
  }
  if (!property && hasTriedLoad) return <Navigate to="/not-found" replace />;

  const fundingProgress = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100;
  const tokensForInvestment = Math.floor(investmentAmount / property.tokenPrice);

  const handleInvest = async () => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Confirmer investissement',
      message: `Voulez-vous investir $${investmentAmount} dans ${property.name} ? Vous recevrez ${tokensForInvestment} tokens.`,
      confirmText: 'Investir',
      cancelText: 'Annuler'
    });
    console.log('DEBUG: confirmed', confirmed);
    if (!confirmed) return;
    try {
      const value = ethers.utils.parseEther((property.tokenPrice * tokensForInvestment).toString());
      console.log('DEBUG: writeContract params', {
        address: property.tokenAddress,
        value: value.toString(),
        tokensForInvestment,
        property
      });
      await writeContract({
        address: property.tokenAddress,
        abi: PropertySharesABI.abi,
        functionName: 'mint',
        args: [],
        value: BigInt(value.toString()),
        gas: 100000n, // Limite le gas à 100k
        maxFeePerGas: 1000000000n, // 1 Gwei max
        maxPriorityFeePerGas: 1000000000n, // 1 Gwei max
      });
      showToast({
        type: 'success',
        title: 'Investissement réussi !',
        message: `Votre investissement de $${investmentAmount} a été pris en compte. Vous possédez maintenant ${tokensForInvestment} tokens.`
      });
    } catch (e) {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'La transaction a échoué.'
      });
      console.error('DEBUG: erreur writeContract', e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded': return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'upcoming': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/onchain-properties"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Retour aux propriétés on-chain</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
              <div className="relative">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-xl ${getStatusColor(property.status)}`}>
                    <Star className="h-4 w-4 inline mr-1" />
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {property.name}
                  </h1>
                </div>
                <div className="flex items-center text-gray-600 mb-8">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full p-2 mr-3">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-medium">{property.location}</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 bg-gray-50 rounded-2xl p-6">
                  {property.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                      Property Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Value</span>
                        <span className="font-bold text-gray-900">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Property Type</span>
                        <span className="font-bold text-gray-900 capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Annual Yield</span>
                        <span className="font-bold text-emerald-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {property.annualYield}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                      Tokenization Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Token Price</span>
                        <span className="font-bold text-gray-900">${property.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Tokens</span>
                        <span className="font-bold text-gray-900">{property.totalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Available</span>
                        <span className="font-bold text-gray-900">{property.availableTokens.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                Legal Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.documents.map((doc: string, index: number) => (
                  <div key={index} className="group flex items-center p-4 bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 rounded-2xl hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 cursor-pointer transition-all duration-300 transform hover:scale-105">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2 mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-indigo-700">Document {index + 1}</span>
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800 font-medium">Voir</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
                Investment Details
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Funding Progress</span>
                  <span className="font-bold text-gray-900">{fundingProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${fundingProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 font-medium bg-gray-50 rounded-xl p-3">
                  ${((property.totalTokens - property.availableTokens) * property.tokenPrice).toLocaleString()} raised of ${property.totalValue.toLocaleString()}
                </div>
              </div>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Investment Amount ($) - Test Mode
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    min={property.tokenPrice}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleInvest}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center block font-semibold text-lg shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 mb-4"
                  disabled={isPending}
                >
                  {isPending ? 'Processing...' : 'Invest Now'}
                </button>
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">
                  <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                  <span className="font-medium">Secured by blockchain smart contracts</span>
                </div>
                <div className="mt-4 flex items-center justify-center text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
                  <span className="font-medium">⚠️ Frais de gas élevés sur Sepolia (~0.03 ETH)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnChainPropertyDetails; 