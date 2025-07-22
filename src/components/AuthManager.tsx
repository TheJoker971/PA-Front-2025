import React, { useState } from 'react';
// import { useApi } from '../context/ApiContext';
// import ApiErrorHandler from './ApiErrorHandler';
// Suppression de l'import thirdweb
// import { useAddress, useDisconnect, useMetamask, useSDK } from '@thirdweb-dev/react';

const AuthManager: React.FC = () => {
  // const { isAuthenticated, isLoading, userSignature, userName, userRole, login, logout, createUser } = useApi();
  const [error, setError] = useState<Error | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showCreateUser, setShowCreateUser] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  // Suppression des hooks thirdweb
  // const address = useAddress();
  // const connectWithMetamask = useMetamask();
  // const disconnectWallet = useDisconnect();
  // const sdk = useSDK();

  // Fonction pour signer un message et se connecter (à réécrire avec wagmi si besoin)
  // TODO: Remplacer la logique de connexion par wagmi si besoin

  // ... le reste du composant doit être adapté pour ne plus utiliser thirdweb
  // Par exemple, masquer ou désactiver les boutons de connexion si pas de wagmi

  return (
    <div>
      <p>Connexion via thirdweb désactivée. À remplacer par wagmi.</p>
      {/* Le reste de l'UI peut être adapté ici */}
    </div>
  );
};

export default AuthManager; 
  // Hooks ThirdWeb pour interagir avec le wallet
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const sdk = useSDK();

  // Fonction pour signer un message et se connecter
  const handleSignMessage = async () => {
    if (!address) {
      try {
        await connectWithMetamask();
        return; // Attendre que l'adresse soit disponible après la connexion
      } catch (err) {
        setError(err as Error);
        return;
      }
    }

    try {
      setLocalLoading(true);
      setError(null);
      setSuccess(false);

      // Signer un message avec le wallet pour l'authentification
      const message = `Authentification sur PropertyTokens: ${Date.now()}`;
      const signature = await sdk?.wallet.sign(message);
      
      if (!signature) {
        throw new Error("Échec de la signature du message");
      }

      // Se connecter avec la signature
      await login(signature);
      
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
      
      // Si l'erreur indique que l'utilisateur n'existe pas, proposer de créer un compte
      if ((err as Error).message?.includes('user not found')) {
        setShowCreateUser(true);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  // Fonction pour créer un nouvel utilisateur
  const handleCreateUser = async () => {
    if (!address) return;

    try {
      setLocalLoading(true);
      setError(null);
      setSuccess(false);

      // Signer un message avec le wallet pour l'authentification
      const message = `Création de compte sur PropertyTokens: ${Date.now()}`;
      const signature = await sdk?.wallet.sign(message);
      
      if (!signature) {
        throw new Error("Échec de la signature du message");
      }

      // Créer un nouvel utilisateur avec la signature
      await createUser(signature, name);
      
      setSuccess(true);
      setShowCreateUser(false);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      setSuccess(false);

      await logout();
      await disconnectWallet();
      
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Authentification</h2>
      
      <div className="mb-4">
        {isAuthenticated ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Connecté</span>
            </div>
            {userName && <div className="text-sm">Nom: {userName}</div>}
            {userRole && <div className="text-sm">Rôle: {userRole}</div>}
            {address && (
              <div className="text-sm text-gray-600 truncate">
                Adresse: {address.substring(0, 8)}...{address.substring(address.length - 6)}
              </div>
            )}
            {userSignature && (
              <div className="text-sm text-gray-600 truncate">
                Signature: {userSignature.substring(0, 8)}...{userSignature.substring(userSignature.length - 6)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Non connecté</span>
          </div>
        )}
      </div>
      
      <ApiErrorHandler error={error} loading={localLoading || isLoading} success={success} />
      
      {!isAuthenticated ? (
        <>
          {!showCreateUser ? (
            <button
              onClick={handleSignMessage}
              disabled={localLoading || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {localLoading || isLoading ? 'Connexion...' : 'Se connecter avec Metamask'}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez votre nom"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCreateUser}
                  disabled={localLoading || isLoading || !name}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                >
                  {localLoading || isLoading ? 'Création...' : 'Créer un compte'}
                </button>
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleLogout}
          disabled={localLoading || isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
        >
          {localLoading || isLoading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      )}
    </div>
  );
};

export default AuthManager; 