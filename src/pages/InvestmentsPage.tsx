import React, { useEffect, useState } from 'react';
import { investmentService, propertyService } from '../services/api';
import ApiErrorHandler from '../components/ApiErrorHandler';
import { useApi } from '../context/ApiContext';
import useApiService from '../hooks/useApiService';

interface Investment {
  id: string;
  property_id: string;
  user_id: string;
  amount_eth: number;
  shares: number;
  tx_hash: string;
  created_at: string;
  property?: {
    name: string;
    image_url: string;
    token_price: number;
    annual_yield: number;
  };
}

const InvestmentsPage: React.FC = () => {
  const { isAuthenticated, userSignature } = useApi();
  const [investments, setInvestments] = useState<Investment[]>([]);
  
  // Utilisation de notre hook personnalisé pour les appels API
  const { loading, error, execute: fetchInvestments } = useApiService<Investment[], []>(
    async () => {
      return investmentService.getAll();
    }
  );

  // Charger les investissements au chargement de la page
  useEffect(() => {
    if (isAuthenticated) {
      const loadInvestments = async () => {
        const result = await fetchInvestments();
        if (result) {
          // Charger les détails des propriétés pour chaque investissement
          const investmentsWithProperties = await Promise.all(
            result.map(async (investment) => {
              try {
                const property = await propertyService.getById(investment.property_id);
                return {
                  ...investment,
                  property: {
                    name: property.name,
                    image_url: property.image_url,
                    token_price: property.token_price,
                    annual_yield: property.annual_yield,
                  },
                };
              } catch (error) {
                console.error(`Erreur lors du chargement de la propriété ${investment.property_id}:`, error);
                return investment;
              }
            })
          );
          
          setInvestments(investmentsWithProperties);
        }
      };

      loadInvestments();
    }
  }, [isAuthenticated, fetchInvestments]);

  // Calculer le total des investissements
  const totalInvestment = investments.reduce((total, inv) => total + inv.amount_eth, 0);
  const totalShares = investments.reduce((total, inv) => total + inv.shares, 0);

  // Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes investissements</h1>
      
      <ApiErrorHandler error={error} loading={loading} />
      
      {!isAuthenticated ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Veuillez vous connecter pour voir vos investissements.</p>
        </div>
      ) : (
        <>
          {/* Résumé des investissements */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Résumé</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total investi</p>
                <p className="text-2xl font-bold">{totalInvestment.toFixed(4)} ETH</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Nombre de parts</p>
                <p className="text-2xl font-bold">{totalShares}</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Nombre de propriétés</p>
                <p className="text-2xl font-bold">{new Set(investments.map(inv => inv.property_id)).size}</p>
              </div>
            </div>
          </div>
          
          {/* Liste des investissements */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {investment.property?.image_url && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={investment.property.image_url} alt="" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {investment.property?.name || 'Propriété inconnue'}
                          </div>
                          {investment.property?.annual_yield && (
                            <div className="text-sm text-gray-500">
                              Rendement: {investment.property.annual_yield}%
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{investment.amount_eth} ETH</div>
                      {investment.property?.token_price && (
                        <div className="text-xs text-gray-500">
                          ({investment.shares} × {investment.property.token_price} ETH)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(investment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${investment.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {investment.tx_hash.substring(0, 6)}...{investment.tx_hash.substring(investment.tx_hash.length - 4)}
                      </a>
                    </td>
                  </tr>
                ))}
                
                {investments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Vous n'avez pas encore d'investissements
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestmentsPage; 