import React, { useState } from 'react';
import { Settings, Info, AlertTriangle, CheckCircle, Copy, Shield } from 'lucide-react';
import SupabaseConnectionTest from '../../components/common/SupabaseConnectionTest';

const SupabaseConfig: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEnvTemplate = () => {
    const template = `# Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase`;
    
    navigator.clipboard.writeText(template)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration Supabase</h1>
        <p className="text-gray-600">Vérifiez et configurez votre connexion Supabase</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-indigo-600" />
              État de la connexion
            </h2>
            <SupabaseConnectionTest />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-indigo-600" />
              Politiques de sécurité (RLS)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800">Erreur de politique de sécurité (RLS)</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Si vous rencontrez des erreurs de type "violates row-level security policy", suivez les étapes ci-dessous.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Comprendre les politiques RLS</h3>
                <p className="text-gray-700 mb-3">
                  Les politiques RLS (Row Level Security) contrôlent qui peut effectuer des actions sur vos buckets de stockage. Par défaut, les utilisateurs non authentifiés n'ont pas le droit de télécharger des fichiers.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Configurer les politiques RLS pour le bucket "immo"</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Connectez-vous à votre <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Dashboard Supabase</a></li>
                  <li>Sélectionnez votre projet</li>
                  <li>Allez dans "Storage" dans le menu de gauche</li>
                  <li>Cliquez sur le bucket "immo"</li>
                  <li>Allez dans l'onglet "Policies"</li>
                  <li>Pour permettre à tous les utilisateurs (même non authentifiés) de télécharger des fichiers :
                    <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                      <li>Cliquez sur "New Policy"</li>
                      <li>Sélectionnez "INSERT" comme type de politique</li>
                      <li>Utilisez la politique "Allow public uploads" ou créez une politique personnalisée</li>
                      <li>Pour une politique personnalisée, définissez la condition SQL comme <code className="bg-gray-100 px-1 py-0.5 rounded">true</code> pour permettre à tous les utilisateurs</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Exemple de politiques recommandées</h3>
                <div className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-3">
                  <p className="mb-2">-- Politique pour permettre à tous les utilisateurs de télécharger des fichiers</p>
                  <p>CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (true);</p>
                  <p className="mt-2 mb-2">-- Politique pour permettre à tous les utilisateurs de lire les fichiers</p>
                  <p>CREATE POLICY "Allow public downloads" ON storage.objects FOR SELECT TO public USING (true);</p>
                </div>
                <p className="text-sm text-gray-600">
                  Note: Ces politiques sont permissives et conviennent pour le développement. Pour la production, envisagez des politiques plus restrictives.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="h-6 w-6 mr-2 text-indigo-600" />
              Résolution des problèmes CORS
            </h2>
            
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800">Erreur CORS détectée</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Si vous rencontrez des erreurs CORS lors du téléchargement d'images ou de documents, suivez les étapes ci-dessous.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Vérifiez vos variables d'environnement</h3>
                <p className="text-gray-700 mb-3">
                  Assurez-vous que votre fichier <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> contient les bonnes valeurs :
                </p>
                <div className="relative">
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {`# Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase`}
                  </pre>
                  <button 
                    onClick={copyEnvTemplate}
                    className="absolute top-2 right-2 bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-colors"
                    title="Copier"
                  >
                    {copied ? 
                      <CheckCircle className="h-4 w-4 text-green-400" /> : 
                      <Copy className="h-4 w-4 text-gray-300" />
                    }
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Configurez les règles CORS dans Supabase</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Connectez-vous à votre <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Dashboard Supabase</a></li>
                  <li>Sélectionnez votre projet</li>
                  <li>Allez dans "Storage" dans le menu de gauche</li>
                  <li>Cliquez sur "Policies" (ou "Règles")</li>
                  <li>Dans la section CORS, ajoutez les origines autorisées :
                    <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                      <li>Pour le développement : <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:5173</code></li>
                      <li>Pour la production : ajoutez l'URL de votre site déployé</li>
                    </ul>
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Créez le bucket "immo" s'il n'existe pas</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Dans la section Storage de Supabase, cliquez sur "New Bucket" (ou "Nouveau Bucket")</li>
                  <li>Nommez-le exactement "immo"</li>
                  <li>Assurez-vous que l'option "Public bucket" est activée</li>
                  <li>Cliquez sur "Create bucket" pour terminer</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ressources Supabase</h2>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://supabase.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Documentation Supabase
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/storage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Guide du stockage Supabase
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/storage/cors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Configuration CORS Supabase
                </a>
              </li>
              <li>
                <a 
                  href="https://supabase.com/docs/guides/auth/row-level-security" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Guide des politiques RLS
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Conseil</h2>
            <p className="text-gray-700 text-sm">
              Si vous êtes en développement local, assurez-vous que votre serveur de développement est en cours d'exécution sur le port que vous avez configuré dans les règles CORS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfig; 