import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';
import PropertySharesABI from '../../abi/PropertyShares.json';

console.log('DashboardPropertiesOnChain MONTÉ');

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

interface OnChainProperty {
    id: string;
    name: string;
    imageUrl: string;
    location?: string;
    tokens: number;
    investmentDate?: Date;
    totalInvested: number;
    currentValue: number;
    totalReturns: number;
    annualYield: number;
    status: string;
}

const DashboardPropertiesOnChain: React.FC = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [properties, setProperties] = useState<OnChainProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('useEffect lancé', { address, publicClient });
        const fetchProperties = async () => {
            if (!address || !publicClient) {
                setProperties([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                console.log('IMMO_PROPERTY_ADDRESS:', IMMO_PROPERTY_ADDRESS);
                // 1. Récupérer le nombre de propriétés
                const propertiesCount = await publicClient.readContract({
                    address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
                    abi: ImmoPropertyABI.abi,
                    functionName: 'getPropertiesCount',
                }) as bigint;
                const count = Number(propertiesCount);
                console.log('propertiesCount:', count);
                const props: OnChainProperty[] = [];
                for (let i = 1; i <= count; i++) {
                    const property = await publicClient.readContract({
                        address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
                        abi: ImmoPropertyABI.abi,
                        functionName: 'getProperty',
                        args: [BigInt(i)],
                    }) as any;
                    const shareToken = property.shareToken as string;
                    // Vérifier le solde de l'utilisateur
                    const balance = await publicClient.readContract({
                        address: shareToken as `0x${string}`,
                        abi: PropertySharesABI.abi,
                        functionName: 'balanceOf',
                        args: [address],
                    }) as bigint;
                    console.log('Propriété', i, 'shareToken:', shareToken, 'balance:', Number(balance) / 1e18);
                    if (balance > 0n) {
                        // Récupérer les métadonnées via property.uri (comme dans DashboardOnChain)
                        let metadata: any = {};
                        let imageUrl = '';
                        let propertyName = property.name;
                        try {
                            const metadataUri = property.uri;
                            if (metadataUri && metadataUri.startsWith('http')) {
                                const res = await fetch(metadataUri);
                                if (res.ok) {
                                    metadata = await res.json();
                                    imageUrl = metadata.mainImage || metadata.image || '';
                                    propertyName = metadata.name || propertyName;
                                }
                            }
                        } catch { }
                        // Récupérer le rendement annuel
                        let annualYield = 0;
                        try {
                            const ay = await publicClient.readContract({
                                address: shareToken as `0x${string}`,
                                abi: PropertySharesABI.abi,
                                functionName: 'getAnnualYield',
                            }) as bigint;
                            annualYield = Number(ay) / 100;
                        } catch { }
                        // Récupérer le prix d'une part
                        let unitPrice = 0;
                        try {
                            const up = await publicClient.readContract({
                                address: shareToken as `0x${string}`,
                                abi: PropertySharesABI.abi,
                                functionName: 'getUnitPrice',
                            }) as bigint;
                            unitPrice = Number(up) / 1e18;
                        } catch { }
                        // Calculer les valeurs
                        const tokens = Number(balance) / 1e18;
                        const totalInvested = tokens * unitPrice;
                        const currentValue = totalInvested; // À adapter si besoin
                        const totalReturns = 0; // À calculer si besoin
                        const propertyObj = {
                            id: `${i}`,
                            name: propertyName,
                            imageUrl,
                            location: metadata?.location || '',
                            tokens,
                            investmentDate: undefined,
                            totalInvested,
                            currentValue,
                            totalReturns,
                            annualYield,
                            status: 'active',
                        };
                        console.log('Ajout propriété on-chain:', propertyObj);
                        props.push(propertyObj);
                    }
                }
                setProperties(props);
            } catch (err) {
                console.error('Erreur globale fetchProperties:', err);
                setProperties([]);
            }
            setLoading(false);
        };
        fetchProperties();
    }, [address, publicClient]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Suivez vos investissements immobiliers et leurs performances.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <div>Aucune propriété on-chain trouvée.</div>
                ) : (
                    properties.map((investment) => (
                        <div key={investment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative">
                                <img
                                    src={investment.imageUrl}
                                    alt={investment.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        {investment.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{investment.name}</h3>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{investment.location}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Tokens Owned</p>
                                        <p className="text-lg font-semibold text-gray-900">{investment.tokens.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Investment Date</p>
                                        <p className="text-lg font-semibold text-gray-900">-</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Invested</span>
                                        <span className="font-semibold text-gray-900">${investment.totalInvested.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Current Value</span>
                                        <span className="font-semibold text-gray-900">${investment.currentValue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Returns</span>
                                        <span className="font-semibold text-green-600">${investment.totalReturns.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Performance</span>
                                        <span className="font-semibold text-green-600 flex items-center">
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            +{investment.totalInvested > 0 ? ((investment.currentValue - investment.totalInvested) / investment.totalInvested * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Annual Yield</span>
                                        <span className="font-semibold text-blue-600">{investment.annualYield}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardPropertiesOnChain; 