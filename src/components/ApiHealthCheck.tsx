import React, { useEffect, useState } from 'react';
import { healthService } from '../services/api';
import ApiErrorHandler from './ApiErrorHandler';
import { useApi } from '../context/ApiContext';

const ApiHealthCheck: React.FC = () => {
  const { apiHealth } = useApi();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [healthStatus, setHealthStatus] = useState<boolean>(apiHealth);

  useEffect(() => {
    setHealthStatus(apiHealth);
  }, [apiHealth]);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const health = await healthService.check();
      setHealthStatus(health?.status === 'ok');
    } catch (err) {
      setError(err as Error);
      setHealthStatus(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">État de l'API</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${healthStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>API {healthStatus ? 'connectée' : 'déconnectée'}</span>
        </div>
        
        <div className="text-sm text-gray-600">
          URL de base: {import.meta.env.VITE_BASE_URL || 'http://localhost:8080'}
        </div>
      </div>
      
      <ApiErrorHandler error={error} loading={loading} />
      
      <button
        onClick={checkHealth}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Vérification...' : 'Tester la connexion'}
      </button>
      
      {!healthStatus && !loading && (
        <div className="mt-4 text-sm text-gray-700">
          <p className="font-semibold">Conseils de dépannage:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Vérifiez que votre serveur API est en cours d'exécution</li>
            <li>Vérifiez que la variable d'environnement VITE_BASE_URL est correctement définie</li>
            <li>Assurez-vous que les règles CORS sont configurées correctement sur le serveur</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiHealthCheck; 