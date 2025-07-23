import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UseWalletAuthReturn {
  connectWallet: (wallet: string, name?: string) => Promise<{
    success: boolean;
    isNewUser: boolean;
    user: any;
    message: string;
  }>;
  isConnecting: boolean;
  error: string | null;
}

/**
 * Hook spécialisé pour l'authentification par wallet avec création automatique d'utilisateur
 */
export const useWalletAuth = (): UseWalletAuthReturn => {
  const { login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async (wallet: string, name?: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // Validation basique de l'adresse wallet
      if (!wallet || wallet.length < 10) {
        throw new Error('Adresse wallet invalide');
      }

      if (!wallet.startsWith('0x')) {
        throw new Error('L\'adresse wallet doit commencer par 0x');
      }

      console.log(`🔗 Tentative de connexion avec le wallet: ${wallet}`);
      
      // Utiliser la fonction login qui gère automatiquement la création
      await login(wallet, name);
      
      // Simuler la vérification si c'est un nouvel utilisateur
      // En réalité, cette information pourrait venir de l'API
      const isNewUser = true; // Pour l'instant, on suppose que c'est possible
      
      const result = {
        success: true,
        isNewUser,
        user: { wallet, name: name || `User ${wallet.substring(0, 6)}...` },
        message: isNewUser 
          ? '✅ Compte créé et connexion réussie!' 
          : '✅ Connexion réussie!'
      };

      console.log(result.message, result.user);
      return result;

    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      
      console.error('❌ Erreur de connexion wallet:', errorMessage);
      
      return {
        success: false,
        isNewUser: false,
        user: null,
        message: errorMessage
      };
    } finally {
      setIsConnecting(false);
    }
  }, [login]);

  return {
    connectWallet,
    isConnecting,
    error,
  };
}; 