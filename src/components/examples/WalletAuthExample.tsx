import React, { useState } from 'react';
import WalletConnector from '../Auth/WalletConnector';
import { useAuth } from '../../hooks/useAuth';

const WalletAuthExample: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev].slice(0, 5)); // Garder les 5 dernières
  };

  const handleSuccess = (user: any) => {
    addNotification(`✅ Connexion réussie pour ${user.name || user.wallet}`);
  };

  const handleError = (error: string) => {
    addNotification(`❌ Erreur: ${error}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Authentification Wallet avec Création Automatique</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Démonstration de la connexion wallet avec création automatique d'utilisateur. 
          Si votre wallet n'existe pas dans le système, un compte sera automatiquement créé.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Composant de connexion */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Connexion</h2>
          <WalletConnector
            onSuccess={handleSuccess}
            onError={handleError}
            showNameField={true}
          />
        </div>

        {/* Informations utilisateur */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations Utilisateur</h2>
          
          {isAuthenticated && user ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom:</label>
                  <p className="font-semibold">{user.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Wallet:</label>
                  <p className="font-mono text-sm break-all">{user.wallet}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Rôle:</label>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'manager' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Créé le:</label>
                  <p className="text-sm">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">ID Utilisateur:</label>
                  <p className="font-mono text-xs text-gray-500">{user.id}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <p>Connectez-vous pour voir vos informations</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className={`p-3 rounded border-l-4 ${
                  notification.startsWith('✅') 
                    ? 'bg-green-50 border-green-400 text-green-700'
                    : 'bg-red-50 border-red-400 text-red-700'
                }`}
              >
                <p className="text-sm">{notification}</p>
                <p className="text-xs opacity-75">{new Date().toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setNotifications([])}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Effacer les notifications
          </button>
        </div>
      )}

      {/* Informations sur le processus */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Comment ça fonctionne</h2>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <h3 className="font-medium">Tentative de connexion</h3>
              <p className="text-blue-600">Le système tente de connecter votre wallet avec l'API</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <h3 className="font-medium">Vérification de l'utilisateur</h3>
              <p className="text-blue-600">Si votre wallet existe déjà, vous êtes connecté immédiatement</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <h3 className="font-medium">Création automatique</h3>
              <p className="text-blue-600">Si votre wallet n'existe pas, un nouveau compte utilisateur est créé automatiquement avec le rôle "user"</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <div>
              <h3 className="font-medium">Connexion réussie</h3>
              <p className="text-blue-600">Vous êtes maintenant connecté et pouvez accéder aux fonctionnalités selon votre rôle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exemples de wallets pour test */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Exemples pour les tests</h2>
        <p className="text-sm text-gray-600 mb-4">
          Vous pouvez utiliser ces adresses d'exemple pour tester la fonctionnalité :
        </p>
        
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-mono text-sm">0x1234567890123456789012345678901234567890</p>
              <p className="text-xs text-gray-500">Wallet exemple 1</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText('0x1234567890123456789012345678901234567890')}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Copier
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <p className="font-mono text-sm">0xabcdefabcdefabcdefabcdefabcdefabcdefabcd</p>
              <p className="text-xs text-gray-500">Wallet exemple 2</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Copier
            </button>
          </div>
        </div>
      </div>

      {/* Cas d'utilisation */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">Cas d'utilisation</h2>
        
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-medium text-yellow-800">🎯 Onboarding simplifié</h3>
            <p className="text-yellow-700">Les nouveaux utilisateurs n'ont pas besoin de s'inscrire manuellement</p>
          </div>
          
          <div>
            <h3 className="font-medium text-yellow-800">🔗 Intégration Web3</h3>
            <p className="text-yellow-700">Compatible avec les wallets Web3 comme MetaMask, WalletConnect, etc.</p>
          </div>
          
          <div>
            <h3 className="font-medium text-yellow-800">⚡ Expérience fluide</h3>
            <p className="text-yellow-700">Un seul clic pour se connecter ou créer un compte</p>
          </div>
          
          <div>
            <h3 className="font-medium text-yellow-800">🛡️ Sécurité</h3>
            <p className="text-yellow-700">Authentification basée sur la possession du wallet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAuthExample; 