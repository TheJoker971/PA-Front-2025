import React, { useState, useEffect } from 'react';
import { Calendar, Filter, ExternalLink, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Download } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import ImmoPropertyABI from '../../abi/ImmoProperty.json';
import PropertySharesABI from '../../abi/PropertyShares.json';

const IMMO_PROPERTY_ADDRESS = import.meta.env.VITE_IMMO_PROPERTY_ADDRESS;

interface OnChainTransaction {
  id: string;
  type: 'purchase' | 'claim';
  propertyName: string;
  amount: number;
  tokens?: number;
  timestamp: number;
  hash: string;
  status: 'completed';
}

const Transactions: React.FC = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !publicClient) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const allTransactions: OnChainTransaction[] = [];
        
        // Récupérer le nombre de propriétés
        const propertiesCount = await publicClient.readContract({
          address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
          abi: ImmoPropertyABI.abi,
          functionName: 'getPropertiesCount',
        }) as bigint;
        const count = Number(propertiesCount);

        // Obtenir le numéro de bloc actuel pour limiter la plage
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - 10000n; // 10 000 blocs en arrière

        // Pour chaque propriété, récupérer les événements
        for (let i = 1; i <= count; i++) {
          try {
            // Récupérer les infos de la propriété
            const property = await publicClient.readContract({
              address: IMMO_PROPERTY_ADDRESS as `0x${string}`,
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

            // Récupérer les événements RevenueClaimed
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

            // Méthode alternative si aucun événement trouvé
            if (purchaseLogs.length === 0) {
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
              
              const filteredPurchaseLogs = allPurchaseLogs.filter(log => 
                log.args.investor?.toLowerCase() === address.toLowerCase()
              );
              
              for (const log of filteredPurchaseLogs) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                allTransactions.push({
                  id: `${log.transactionHash}-purchase`,
                  type: 'purchase',
                  propertyName,
                  amount: Number(log.args.amount) / 1e18,
                  tokens: Number(log.args.amount) / 1e18,
                  timestamp: Number(block.timestamp),
                  hash: log.transactionHash,
                  status: 'completed'
                });
              }
            } else {
              for (const log of purchaseLogs) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                allTransactions.push({
                  id: `${log.transactionHash}-purchase`,
                  type: 'purchase',
                  propertyName,
                  amount: Number(log.args.amount) / 1e18,
                  tokens: Number(log.args.amount) / 1e18,
                  timestamp: Number(block.timestamp),
                  hash: log.transactionHash,
                  status: 'completed'
                });
              }
            }

            // Traiter les événements de réclamation
            if (claimLogs.length === 0) {
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
              
              const filteredClaimLogs = allClaimLogs.filter(log => 
                log.args.investor?.toLowerCase() === address.toLowerCase()
              );
              
              for (const log of filteredClaimLogs) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                allTransactions.push({
                  id: `${log.transactionHash}-claim`,
                  type: 'claim',
                  propertyName,
                  amount: Number(log.args.amount) / 1e18,
                  timestamp: Number(block.timestamp),
                  hash: log.transactionHash,
                  status: 'completed'
                });
              }
            } else {
              for (const log of claimLogs) {
                const block = await publicClient.getBlock({ blockHash: log.blockHash });
                allTransactions.push({
                  id: `${log.transactionHash}-claim`,
                  type: 'claim',
                  propertyName,
                  amount: Number(log.args.amount) / 1e18,
                  timestamp: Number(block.timestamp),
                  hash: log.transactionHash,
                  status: 'completed'
                });
              }
            }

          } catch (e) {
            console.warn(`Erreur lors de la récupération des événements pour la propriété ${i}:`, e);
          }
        }

        // Trier par timestamp (plus récent en premier)
        allTransactions.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(allTransactions);

      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address, publicClient]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'claim':
        return <Download className="h-4 w-4 text-green-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historique des Transactions</h1>
        <p className="text-lg text-gray-600 mt-2">
          Consultez toutes vos transactions d'investissement et activités on-chain
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Transaction
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les Types</option>
              <option value="purchase">Achat</option>
              <option value="claim">Réclamation</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les Statuts</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-500">Chargement des transactions on-chain...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Aucune transaction on-chain trouvée.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {transaction.type === 'purchase' ? 'Achat' : 'Réclamation'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.propertyName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.tokens ? transaction.tokens.toLocaleString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.timestamp * 1000).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Terminé' : transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.hash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <span className="text-sm">{transaction.hash.slice(0, 8)}...</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune transaction trouvée correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;