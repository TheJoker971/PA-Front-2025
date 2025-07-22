import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, DollarSign, Calendar, ShoppingCart, Download } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import ImmoPropertyABI from '../abi/ImmoProperty.json';
import PropertySharesABI from '../abi/PropertyShares.json';
import { formatEther } from 'viem';
import { Abi } from 'viem';

// Adresse du contrat ImmoProperty déployé (à adapter si besoin)
const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

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

interface OnChainTransaction {
    id: string;
    type: 'purchase' | 'claim';
    propertyName: string;
    amount: number;
    timestamp: number;
    hash: string;
}

const DashboardOnChain: React.FC = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [investments, setInvestments] = useState<OnChainInvestment[]>([]);
    const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(true);

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
            } catch (error) {
                console.error('Erreur lors de la récupération des investissements:', error);
                setInvestments([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchTransactions = async () => {
            if (!address || !publicClient) {
                setTransactions([]);
                setTransactionsLoading(false);
                return;
            }
            setTransactionsLoading(true);
            try {
                const allTransactions: OnChainTransaction[] = [];
                
                // Récupérer le nombre de propriétés
                const propertiesCount = await publicClient.readContract({
                    address: IMMO_PROPERTY_ADDRESS,
                    abi: ImmoPropertyABI.abi,
                    functionName: 'getPropertiesCount',
                }) as bigint;
                const count = Number(propertiesCount);

                // Pour chaque propriété, récupérer les événements
                for (let i = 1; i <= count; i++) {
                    try {
                        // Récupérer les infos de la propriété
                        const property = await publicClient.readContract({
                            address: IMMO_PROPERTY_ADDRESS,
                            abi: ImmoPropertyABI.abi,
                            functionName: 'getProperty',
                            args: [BigInt(i)],
                        }) as any;
                        
                        const shareTokenAddress = property.shareToken as `0x${string}`;
                        if (!shareTokenAddress) continue;

                        // Récupérer le nom de la propriété
                        let propertyName = property.name;
                        try {
                            const metadataUri = property.uri;
                            if (metadataUri && metadataUri.startsWith('http')) {
                                const res = await fetch(metadataUri);
                                if (res.ok) {
                                    const meta = await res.json();
                                    propertyName = meta.name || propertyName;
                                }
                            }
                        } catch (e) {
                            // ignore fetch error
                        }

                        // Récupérer les événements TokensPurchased
                        console.log(`Recherche d'événements TokensPurchased pour ${shareTokenAddress} et utilisateur ${address}`);
                        
                        // Obtenir le numéro de bloc actuel
                        const currentBlock = await publicClient.getBlockNumber();
                        const fromBlock = currentBlock - 10000n; // 10 000 blocs en arrière
                        
                        const purchaseLogs = await publicClient.getLogs({
                            address: shareTokenAddress,
                            event: {
                                type: 'event',
                                name: 'TokensPurchased',
                                inputs: [
                                    { type: 'address', name: 'investor', indexed: true },
                                    { type: 'uint256', name: 'amount', indexed: false },
                                    { type: 'uint256', name: 'newTotalSupply', indexed: false }
                                ]
                            },
                            args: {
                                investor: address
                            },
                            fromBlock: fromBlock,
                            toBlock: 'latest'
                        });
                        console.log(`Événements TokensPurchased trouvés:`, purchaseLogs);

                        // Récupérer les événements RevenueClaimed
                        console.log(`Recherche d'événements RevenueClaimed pour ${shareTokenAddress} et utilisateur ${address}`);
                        const claimLogs = await publicClient.getLogs({
                            address: shareTokenAddress,
                            event: {
                                type: 'event',
                                name: 'RevenueClaimed',
                                inputs: [
                                    { type: 'address', name: 'investor', indexed: true },
                                    { type: 'uint256', name: 'amount', indexed: false },
                                    { type: 'uint256', name: 'timestamp', indexed: false }
                                ]
                            },
                            args: {
                                investor: address
                            },
                            fromBlock: fromBlock,
                            toBlock: 'latest'
                        });
                        console.log(`Événements RevenueClaimed trouvés:`, claimLogs);

                        // Méthode alternative : récupérer tous les événements puis filtrer
                        if (purchaseLogs.length === 0) {
                            console.log(`Tentative de récupération de tous les événements TokensPurchased...`);
                            const allPurchaseLogs = await publicClient.getLogs({
                                address: shareTokenAddress,
                                event: {
                                    type: 'event',
                                    name: 'TokensPurchased',
                                    inputs: [
                                        { type: 'address', name: 'investor', indexed: true },
                                        { type: 'uint256', name: 'amount', indexed: false },
                                        { type: 'uint256', name: 'newTotalSupply', indexed: false }
                                    ]
                                },
                                fromBlock: fromBlock,
                                toBlock: 'latest'
                            });
                            console.log(`Tous les événements TokensPurchased:`, allPurchaseLogs);
                            
                            // Filtrer côté client
                            const filteredPurchaseLogs = allPurchaseLogs.filter(log => 
                                log.args.investor?.toLowerCase() === address.toLowerCase()
                            );
                            console.log(`Événements filtrés pour l'utilisateur:`, filteredPurchaseLogs);
                            
                            // Utiliser les événements filtrés
                            for (const log of filteredPurchaseLogs) {
                                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                                allTransactions.push({
                                    id: `${log.transactionHash}-purchase`,
                                    type: 'purchase',
                                    propertyName,
                                    amount: Number(log.args.amount) / 1e18,
                                    timestamp: Number(block.timestamp),
                                    hash: log.transactionHash
                                });
                            }
                        } else {
                            // Traiter les événements d'achat (méthode originale)
                            for (const log of purchaseLogs) {
                                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                                allTransactions.push({
                                    id: `${log.transactionHash}-purchase`,
                                    type: 'purchase',
                                    propertyName,
                                    amount: Number(log.args.amount) / 1e18,
                                    timestamp: Number(block.timestamp),
                                    hash: log.transactionHash
                                });
                            }
                        }

                        // Traiter les événements de réclamation
                        if (claimLogs.length === 0) {
                            console.log(`Tentative de récupération de tous les événements RevenueClaimed...`);
                            const allClaimLogs = await publicClient.getLogs({
                                address: shareTokenAddress,
                                event: {
                                    type: 'event',
                                    name: 'RevenueClaimed',
                                    inputs: [
                                        { type: 'address', name: 'investor', indexed: true },
                                        { type: 'uint256', name: 'amount', indexed: false },
                                        { type: 'uint256', name: 'timestamp', indexed: false }
                                    ]
                                },
                                fromBlock: fromBlock,
                                toBlock: 'latest'
                            });
                            console.log(`Tous les événements RevenueClaimed:`, allClaimLogs);
                            
                            // Filtrer côté client
                            const filteredClaimLogs = allClaimLogs.filter(log => 
                                log.args.investor?.toLowerCase() === address.toLowerCase()
                            );
                            console.log(`Événements filtrés pour l'utilisateur:`, filteredClaimLogs);
                            
                            // Utiliser les événements filtrés
                            for (const log of filteredClaimLogs) {
                                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                                allTransactions.push({
                                    id: `${log.transactionHash}-claim`,
                                    type: 'claim',
                                    propertyName,
                                    amount: Number(log.args.amount) / 1e18,
                                    timestamp: Number(block.timestamp),
                                    hash: log.transactionHash
                                });
                            }
                        } else {
                            // Traiter les événements de réclamation (méthode originale)
                            for (const log of claimLogs) {
                                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                                allTransactions.push({
                                    id: `${log.transactionHash}-claim`,
                                    type: 'claim',
                                    propertyName,
                                    amount: Number(log.args.amount) / 1e18,
                                    timestamp: Number(block.timestamp),
                                    hash: log.transactionHash
                                });
                            }
                        }

                    } catch (e) {
                        console.warn(`Erreur lors de la récupération des événements pour la propriété ${i}:`, e);
                    }
                }

                // Trier par timestamp (plus récent en premier) et prendre les 5 plus récentes
                allTransactions.sort((a, b) => b.timestamp - a.timestamp);
                setTransactions(allTransactions.slice(0, 5));

            } catch (error) {
                console.error('Erreur lors de la récupération des transactions:', error);
                setTransactions([]);
            } finally {
                setTransactionsLoading(false);
            }
        };

        fetchInvestments();
        fetchTransactions();
    }, [address, publicClient]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.totalReturns, 0);
    const totalProperties = investments.length;

    // Spinner global pendant le chargement initial
    if (loading || transactionsLoading) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Voici vos investissements immobiliers
                    </p>
                </div>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Voici vos investissements immobiliers
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
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
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
                        {transactionsLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div>Aucune transaction on-chain trouvée.</div>
                        ) : (
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-3 ${
                                            transaction.type === 'purchase' 
                                                ? 'bg-blue-100 text-blue-600' 
                                                : 'bg-green-100 text-green-600'
                                        }`}>
                                            {transaction.type === 'purchase' ? (
                                                <ShoppingCart className="h-4 w-4" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{transaction.propertyName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {transaction.type === 'purchase' ? 'Achat de tokens' : 'Réclamation de revenus'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(transaction.timestamp * 1000).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${
                                            transaction.type === 'purchase' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                            {transaction.type === 'purchase' ? '-' : '+'}${transaction.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {transaction.hash.substring(0, 8)}...{transaction.hash.substring(transaction.hash.length - 6)}
                                        </p>
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

export default DashboardOnChain; 