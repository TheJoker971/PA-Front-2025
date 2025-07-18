import React from 'react';
import ApiHealthCheck from '../components/ApiHealthCheck';
import AuthManager from '../components/AuthManager';
import { useApi } from '../context/ApiContext';

const ApiConfigPage: React.FC = () => {
  const { userRole } = useApi();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Configuration API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApiHealthCheck />
        <AuthManager />
      </div>
      
      <div className="mt-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Informations de configuration</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Variables d'environnement</h3>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>
                <span className="font-mono bg-gray-100 px-1">VITE_BASE_URL</span>: 
                URL de base de l'API (ex: http://localhost:8080)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Configuration CORS</h3>
            <p className="text-sm mt-1">
              Assurez-vous que votre serveur API autorise les requêtes depuis votre domaine frontend.
              Pour le développement local, ajoutez <span className="font-mono bg-gray-100 px-1">http://localhost:5173</span> 
              à la liste des origines autorisées dans votre configuration CORS.
            </p>
          </div>
          
          {userRole === 'admin' && (
            <div>
              <h3 className="font-medium">Configuration avancée (Admin)</h3>
              <p className="text-sm mt-1">
                En tant qu'administrateur, vous avez accès à toutes les fonctionnalités de l'API.
                Vous pouvez gérer les propriétés, les utilisateurs et les rôles.
              </p>
            </div>
          )}
          
          {userRole === 'manager' && (
            <div>
              <h3 className="font-medium">Configuration avancée (Manager)</h3>
              <p className="text-sm mt-1">
                En tant que manager, vous pouvez gérer les propriétés et voir les investissements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiConfigPage; 