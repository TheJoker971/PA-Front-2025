import React, { useState } from 'react';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import { useAuth } from '../../hooks/useAuth';

interface WalletConnectorProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  className?: string;
  showNameField?: boolean;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({
  onSuccess,
  onError,
  className = '',
  showNameField = true
}) => {
  const [wallet, setWallet] = useState('');
  const [name, setName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { connectWallet, isConnecting, error } = useWalletAuth();
  const { isAuthenticated, user, logout } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await connectWallet(wallet, name.trim() || undefined);
    
    if (result.success) {
      onSuccess?.(result.user);
      setWallet('');
      setName('');
    } else {
      onError?.(result.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className={`p-4 border rounded-lg bg-green-50 border-green-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Connecté</h3>
            <p className="text-sm text-green-600">{user?.name}</p>
            <p className="text-xs text-green-500">
              {user?.wallet.substring(0, 8)}...{user?.wallet.substring(user?.wallet.length - 4)}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="font-semibold mb-4">Connexion Wallet</h3>
      
      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Adresse Wallet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isConnecting}
          />
        </div>

        {showNameField && (
          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium">
                Nom d'utilisateur (optionnel)
              </label>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="ml-2 text-xs text-blue-500 hover:text-blue-600"
              >
                {showAdvanced ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            
            {showAdvanced && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isConnecting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si vide, un nom sera généré automatiquement
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isConnecting || !wallet}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
          ) : (
            'Se connecter / Créer compte'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          🔄 Création automatique de compte
        </h4>
        <p className="text-xs text-blue-600">
          Si votre wallet n'existe pas dans le système, un compte utilisateur sera 
          automatiquement créé avec le rôle "user".
        </p>
      </div>
    </div>
  );
};

export default WalletConnector; 