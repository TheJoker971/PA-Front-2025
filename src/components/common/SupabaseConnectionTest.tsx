import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [bucketExists, setBucketExists] = useState<boolean>(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test de connexion basique
        const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
        
        if (error && !error.message.includes('relation "_dummy_query" does not exist')) {
          setStatus('error');
          setErrorMessage(`Erreur de connexion : ${error.message}`);
          return;
        }
        
        // Vérifier l'existence du bucket
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          setStatus('error');
          setErrorMessage(`Erreur lors de la vérification des buckets : ${bucketsError.message}`);
          return;
        }
        
        const immoBucket = buckets?.find(bucket => bucket.name === 'immo');
        setBucketExists(!!immoBucket);
        
        if (!immoBucket) {
          setStatus('error');
          setErrorMessage("Le bucket 'immo' n'existe pas dans votre projet Supabase");
          return;
        }
        
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(`Erreur inattendue : ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    testConnection();
  }, []);

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center text-gray-600">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Test de connexion à Supabase...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center text-emerald-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Connexion à Supabase établie</span>
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-red-700 font-medium">Erreur de connexion à Supabase</span>
            </div>
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            <div className="mt-3">
              <p className="text-sm text-gray-700 font-medium">Vérifiez :</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                <li>Les variables d'environnement dans .env.local</li>
                <li>La configuration CORS dans votre projet Supabase</li>
                <li>L'existence du bucket "immo" dans votre projet</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-2">État de la connexion Supabase</h3>
      {renderStatus()}
      {status === 'success' && (
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center text-gray-700">
            <span className="text-sm">Bucket "immo" : </span>
            {bucketExists ? (
              <span className="ml-2 text-sm text-emerald-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Disponible
              </span>
            ) : (
              <span className="ml-2 text-sm text-red-600 flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> Non trouvé
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest; 