import { useState, useCallback } from 'react';
import { authService, setAuthWallet, getAuthWallet } from '../services/api-v2';
import { ApiUser } from '../types/api';

interface UseAuthReturn {
  user: ApiUser | null;
  isLoading: boolean;
  error: string | null;
  login: (wallet: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (wallet: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser loginOrCreate pour créer automatiquement l'utilisateur s'il n'existe pas
      const userData = await authService.loginOrCreate(wallet, name);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user && getAuthWallet());

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
  };
}; 