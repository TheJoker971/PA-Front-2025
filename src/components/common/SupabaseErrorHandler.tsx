import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SupabaseErrorHandlerProps {
  error: Error | null;
  type: 'upload' | 'download' | 'general';
}

const SupabaseErrorHandler: React.FC<SupabaseErrorHandlerProps> = ({ error, type }) => {
  if (!error) return null;

  const isCorsError = error.message.includes('CORS') || 
                     error.message.includes('NetworkError') || 
                     error.message.includes('Cross-Origin');
                     
  const isRLSError = error.message.includes('row-level security policy') ||
                    error.message.includes('violates row-level security') ||
                    error.message.includes('Unauthorized');

  const getErrorMessage = () => {
    if (isRLSError) {
      return (
        <>
          <p className="font-bold">Erreur de sécurité (RLS)</p>
          <ol className="list-decimal list-inside mt-2 text-sm">
            <li>Vous n'avez pas les permissions nécessaires pour effectuer cette action</li>
            <li>Assurez-vous d'être connecté avec un compte ayant les droits appropriés</li>
            <li>Vérifiez les politiques de sécurité (RLS) configurées dans votre projet Supabase</li>
          </ol>
        </>
      );
    }
    
    if (isCorsError) {
      return (
        <>
          <p className="font-bold">Erreur CORS détectée</p>
          <ol className="list-decimal list-inside mt-2 text-sm">
            <li>Vérifiez que vos variables d'environnement Supabase sont correctement configurées dans le fichier .env.local</li>
            <li>Assurez-vous que les règles CORS sont configurées dans votre projet Supabase pour autoriser votre domaine</li>
            <li>Vérifiez que votre bucket "immo" existe et est accessible</li>
          </ol>
        </>
      );
    }

    switch (type) {
      case 'upload':
        return <p>Une erreur s'est produite lors du téléchargement. Veuillez réessayer.</p>;
      case 'download':
        return <p>Une erreur s'est produite lors du chargement des données. Veuillez réessayer.</p>;
      default:
        return <p>Une erreur s'est produite. Veuillez réessayer.</p>;
    }
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {isRLSError ? "Erreur d'autorisation" : "Erreur de connexion à Supabase"}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {getErrorMessage()}
          </div>
          {(isCorsError || isRLSError) && (
            <div className="mt-4 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
              <code className="text-gray-800">{error.message}</code>
            </div>
          )}
          {isRLSError && (
            <div className="mt-3 text-sm">
              <a 
                href="/admin/supabase-config" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Consulter la page de configuration Supabase
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseErrorHandler; 