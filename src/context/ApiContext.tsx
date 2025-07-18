import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, userService, healthService } from '../services/api';

// Types pour le contexte
interface ApiContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userSignature: string | null;
  userName: string | null;
  userRole: string | null;
  apiHealth: boolean;
  login: (signature: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (signature: string, name?: string, role?: string) => Promise<void>;
}

// Valeurs par défaut du contexte
const defaultContextValue: ApiContextType = {
  isAuthenticated: false,
  isLoading: true,
  userSignature: null,
  userName: null,
  userRole: null,
  apiHealth: false,
  login: async () => {},
  logout: async () => {},
  createUser: async () => {},
};

// Création du contexte
const ApiContext = createContext<ApiContextType>(defaultContextValue);

// Hook personnalisé pour utiliser le contexte
export const useApi = () => useContext(ApiContext);

// Props du provider
interface ApiProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<boolean>(false);

  // Vérifier l'état de santé de l'API au chargement
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await healthService.check();
        setApiHealth(health?.status === 'ok');
      } catch (error) {
        console.error('Erreur lors de la vérification de la santé de l\'API:', error);
        setApiHealth(false);
      }
    };

    checkApiHealth();
  }, []);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Tenter de récupérer la signature depuis localStorage
        const storedSignature = localStorage.getItem('userSignature');
        
        if (storedSignature) {
          setUserSignature(storedSignature);
          
          // Tenter de se connecter avec la signature stockée
          try {
            const userData = await authService.login(storedSignature);
            if (userData) {
              setUserRole(userData.role || null);
              setUserName(userData.name || null);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Erreur lors de la vérification de la session:', error);
            // Supprimer les données stockées en cas d'erreur
            localStorage.removeItem('userSignature');
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (signature: string) => {
    try {
      setIsLoading(true);
      const userData = await authService.login(signature);
      
      if (userData) {
        setIsAuthenticated(true);
        setUserSignature(signature);
        setUserRole(userData.role || null);
        setUserName(userData.name || null);
        
        // Stocker la signature pour la persistance de session
        localStorage.setItem('userSignature', signature);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      
      // Nettoyer l'état local
      setIsAuthenticated(false);
      setUserSignature(null);
      setUserRole(null);
      setUserName(null);
      
      // Supprimer les données stockées
      localStorage.removeItem('userSignature');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de création d'utilisateur
  const createUser = async (signature: string, name?: string, role?: string) => {
    try {
      setIsLoading(true);
      const userData = await userService.create(signature, name, role);
      
      if (userData) {
        setIsAuthenticated(true);
        setUserSignature(signature);
        setUserRole(userData.role || null);
        setUserName(userData.name || null);
        
        // Stocker la signature pour la persistance de session
        localStorage.setItem('userSignature', signature);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valeur du contexte
  const contextValue: ApiContextType = {
    isAuthenticated,
    isLoading,
    userSignature,
    userName,
    userRole,
    apiHealth,
    login,
    logout,
    createUser,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext; 