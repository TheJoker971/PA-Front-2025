import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EnvironmentWarning: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const thirdwebClientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

  const missingEnvVars = [];
  
  if (!supabaseUrl) missingEnvVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingEnvVars.push('VITE_SUPABASE_ANON_KEY');
  if (!thirdwebClientId) missingEnvVars.push('VITE_THIRDWEB_CLIENT_ID');

  if (missingEnvVars.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            Variables d'environnement manquantes
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Les variables d'environnement suivantes ne sont pas définies :
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {missingEnvVars.map((envVar) => (
                <li key={envVar}>{envVar}</li>
              ))}
            </ul>
            <p className="mt-2">
              Créez un fichier <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> à la racine du projet avec ces variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentWarning; 