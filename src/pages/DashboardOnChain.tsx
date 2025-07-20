import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, DollarSign, Calendar } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import ImmoPropertyABI from '../abi/ImmoProperty.json';
import PropertySharesABI from '../abi/PropertyShares.json';
import { formatEther } from 'viem';
import { Abi } from 'viem';

// Adresse du contrat ImmoProperty déployé (à adapter si besoin)
const IMMO_PROPERTY_ADDRESS = '0x4E167dc630f7fDecB87776eD6f5F0024602Ae37E';

interface OnChainInvestment {
    id: string;
    property: {
        name: string;
        imageUrl: string;
    };
    tokens: number;
    totalInvested: number;
    currentValue: number;
    totalReturns: number;
}

const DashboardOnChain: React.FC = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [investments, setInvestments] = useState<OnChainInvestment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestments = async () => {
            if (!address || !publicClient) {
                setInvestments([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // 1. Récupérer le nombre de propriétés
                const propertiesCount = await publicClient.readContract({
                    address: IMMO_PROPERTY_ADDRESS,
                    abi: ImmoPropertyABI.abi,
                    functionName: 'getPropertiesCount',
                }) as bigint;
                const count = Number(propertiesCount);
                const investmentsOnChain: OnChainInvestment[] = [];
                // 2. Pour chaque propriété, récupérer les infos et le solde de tokens
                for (let i = 1; i <= count; i++) {
                    // a. getProperty
                    const property = await publicClient.readContract({
                        address: IMMO_PROPERTY_ADDRESS,
                        abi: ImmoPropertyABI.abi,
                        functionName: 'getProperty',
                        args: [BigInt(i)],
                    }) as any;
                    const shareTokenAddress = property.shareToken as `0x${string}`;
                    // b. balanceOf sur le token ERC20
                    const balance = await publicClient.readContract({
                        address: shareTokenAddress,
                        abi: PropertySharesABI.abi,
                        functionName: 'balanceOf',
                        args: [address],
                    }) as bigint;
                    // c. Si l'utilisateur détient des parts, afficher la propriété
                    if (balance > 0n) {
                        // d. Récupérer les métadonnées (image, nom, etc.)
                        let imageUrl = '';
                        let propertyName = property.name;
                        try {
                            const metadataUri = property.uri;
                            if (metadataUri && metadataUri.startsWith('http')) {
                                const res = await fetch(metadataUri);
                                if (res.ok) {
                                    const meta = await res.json();
                                    imageUrl = meta.mainImage || meta.image || '';
                                    propertyName = meta.name || propertyName;
                                }
                            }
                        } catch (e) {
                            // ignore fetch error
                        }
                        // e. Récupérer le prix unitaire (optionnel)
                        let unitPrice = 0;
                        try {
                            const up = await publicClient.readContract({
                                address: shareTokenAddress,
                                abi: PropertySharesABI.abi,
                                functionName: 'getUnitPrice',
                            }) as bigint;
                            unitPrice = Number(up) / 1e18;
                        } catch (e) { }
                        // f. Calculer la valeur investie
                        const tokens = Number(balance) / 1e18;
                        const totalInvested = tokens * unitPrice;
                        // g. Récupérer la valeur actuelle (pour l'instant = totalInvested)
                        const currentValue = totalInvested; // Peut être amélioré avec la valeur de la propriété
                        // h. Récupérer les retours (optionnel)
                        let totalReturns = 0;
                        try {
                            const returns = await publicClient.readContract({
                                address: shareTokenAddress,
                                abi: PropertySharesABI.abi,
                                functionName: 'getClaimableRevenue',
                                args: [address],
                            }) as bigint;
                            totalReturns = Number(returns) / 1e18;
                        } catch (e) { }
                        investmentsOnChain.push({
                            id: `${i}`,
                            property: {
                                name: propertyName,
                                imageUrl,
                            },
                            tokens,
                            totalInvested,
                            currentValue,
                            totalReturns,
                        });
                    }
                }
                setInvestments(investmentsOnChain);
            } catch (err) {
                setInvestments([]);
            }
            setLoading(false);
        };
        fetchInvestments();
    }, [address, publicClient]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.totalReturns, 0);
    const totalProperties = investments.length;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard (On-Chain)</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Voici vos investissements immobiliers on-chain
                </p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Invested</p>
                            <p className="text-2xl font-bold text-gray-900">${totalInvested.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Current Value</p>
                            <p className="text-2xl font-bold text-gray-900">${totalCurrentValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm font-medium text-green-600">
                            +{totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Returns</p>
                            <p className="text-2xl font-bold text-gray-900">${totalReturns.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-100 rounded-full p-3">
                            <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Properties</p>
                            <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
                        </div>
                        <div className="bg-purple-100 rounded-full p-3">
                            <Building2 className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Investissements récents (à compléter ou placeholder) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Investments (On-Chain)</h2>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div>Chargement des investissements on-chain...</div>
                        ) : investments.length === 0 ? (
                            <div>Aucun investissement on-chain trouvé.</div>
                        ) : (
                            investments.map((investment) => (
                                <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        {investment.property.imageUrl && (
                                            <img
                                                src={investment.property.imageUrl}
                                                alt={investment.property.name}
                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{investment.property.name}</h3>
                                            <p className="text-sm text-gray-600">{investment.tokens} tokens</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${investment.totalInvested.toLocaleString()}</p>
                                        <p className="text-sm text-green-600">+{investment.totalInvested > 0 ? ((investment.currentValue - investment.totalInvested) / investment.totalInvested * 100).toFixed(1) : 0}%</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Transactions récentes à droite */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                        <button className="text-blue-400 cursor-not-allowed" disabled>View All</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-gray-900 capitalize">Aucune transaction trouvée.</h3>
                                <p className="text-sm text-gray-600">Vos transactions récentes apparaîtront ici.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOnChain; 