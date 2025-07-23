import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiUser,
  ApiProperty,
  ApiInvestment,
  LoginRequest,
  CreateUserRequest,
  CreatePropertyRequest,
  UpdatePropertyStatusRequest,
  UpdateUserRoleRequest,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  PropertiesPublicResponse,
  InvestmentsResponse,
  HealthResponse,
  CreateResponse,
} from '../types/api';

// URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Configuration par défaut pour Axios
const apiConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create(apiConfig);

// Store pour le wallet address (utilisé comme Bearer token)
let currentWallet: string | null = null;

// Fonction pour définir le wallet courant
export const setAuthWallet = (wallet: string) => {
  currentWallet = wallet;
};

// Fonction pour obtenir le wallet courant
export const getAuthWallet = (): string | null => {
  return currentWallet;
};

// Intercepteur pour ajouter automatiquement l'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Ajouter l'autorisation si un wallet est défini et que la route nécessite l'auth
    if (currentWallet && config.url && isAuthenticatedRoute(config.url)) {
      config.headers.Authorization = `Bearer ${currentWallet}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction pour déterminer si une route nécessite l'authentification
const isAuthenticatedRoute = (url: string): boolean => {
  const publicRoutes = [
    '/auth/login',
    '/auth/logout',
    '/health',
    '/properties/public'
  ];
  
  return !publicRoutes.some(route => url.includes(route));
};

// Intercepteur pour gérer les erreurs de manière cohérente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('Erreur API:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('Non authentifié - token invalide');
        // Réinitialiser le wallet
        currentWallet = null;
      }
    } else if (error.request) {
      console.error('Aucune réponse reçue:', error.request);
    } else {
      console.error('Erreur:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  /**
   * Connexion utilisateur avec adresse wallet
   * @param wallet - L'adresse wallet de l'utilisateur
   */
  login: async (wallet: string): Promise<ApiUser> => {
    const response = await apiClient.post<ApiUser>('/auth/login', { wallet } as LoginRequest);
    // Définir le wallet pour les futures requêtes
    setAuthWallet(wallet);
    return response.data;
  },

  /**
   * Connexion avec création automatique d'utilisateur si inexistant
   * @param wallet - L'adresse wallet de l'utilisateur
   * @param name - Nom optionnel pour l'utilisateur (défaut: adresse wallet tronquée)
   */
  loginOrCreate: async (wallet: string, name?: string): Promise<ApiUser> => {
    try {
      // Tentative de connexion normale
      return await authService.login(wallet);
    } catch (error: any) {
      // Si l'utilisateur n'existe pas (erreur 404 ou 401), le créer
      if (error.response?.status === 404 || error.response?.status === 401) {
        console.log(`Utilisateur ${wallet} non trouvé, création automatique...`);
        
        try {
          // Créer l'utilisateur avec un nom par défaut si non fourni
          const defaultName = name || `User ${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
          
          await userService.create({
            wallet,
            name: defaultName,
            role: 'user' // Rôle par défaut
          });

          console.log(`Utilisateur créé avec succès: ${defaultName}`);
          
          // Maintenant essayer de se connecter avec l'utilisateur nouvellement créé
          return await authService.login(wallet);
        } catch (createError: any) {
          console.error('Erreur lors de la création de l\'utilisateur:', createError);
          throw new Error(`Impossible de créer l'utilisateur: ${createError.response?.data?.message || createError.message}`);
        }
      } else {
        // Pour toute autre erreur, la relancer
        throw error;
      }
    }
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    // Réinitialiser le wallet
    currentWallet = null;
    return response.data;
  },
};

// Service pour vérifier la santé de l'API
export const healthService = {
  /**
   * Vérifier l'état de santé de l'API
   */
  check: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};

// Services pour les utilisateurs
export const userService = {
  /**
   * Créer un nouvel utilisateur
   */
  create: async (userData: CreateUserRequest): Promise<CreateResponse> => {
    const response = await apiClient.post<CreateResponse>('/users', userData);
    return response.data;
  },

  /**
   * Récupérer tous les utilisateurs (admin uniquement)
   */
  getAll: async (): Promise<ApiUser[]> => {
    const response = await apiClient.get<ApiUser[]>('/api/users');
    return response.data;
  },

  /**
   * Mettre à jour le rôle d'un utilisateur (admin uniquement)
   */
  updateRole: async (userId: string, roleData: UpdateUserRoleRequest): Promise<void> => {
    await apiClient.put(`/api/users/${userId}/role`, roleData);
  },
};

// Services pour les propriétés
export const propertyService = {
  /**
   * Récupérer toutes les propriétés validées (route publique)
   */
  getPublic: async (): Promise<PropertiesPublicResponse> => {
    const response = await apiClient.get<PropertiesPublicResponse>('/properties/public');
    return response.data;
  },

  /**
   * Récupérer les propriétés selon le rôle de l'utilisateur (authentifié)
   */
  getAll: async (): Promise<ApiProperty[]> => {
    const response = await apiClient.get<ApiProperty[]>('/api/properties');
    return response.data;
  },

  /**
   * Récupérer une propriété par ID (authentifié)
   */
  getById: async (propertyId: string): Promise<ApiProperty> => {
    const response = await apiClient.get<ApiProperty>(`/api/properties/${propertyId}`);
    return response.data;
  },

  /**
   * Créer une nouvelle propriété (manager/admin)
   */
  create: async (propertyData: CreatePropertyRequest): Promise<CreateResponse> => {
    const response = await apiClient.post<CreateResponse>('/api/properties', propertyData);
    return response.data;
  },

  /**
   * Mettre à jour une propriété (manager/admin)
   */
  update: async (propertyId: string, propertyData: Partial<CreatePropertyRequest>): Promise<void> => {
    await apiClient.put(`/api/properties/${propertyId}`, propertyData);
  },

  /**
   * Mettre à jour le statut d'une propriété (admin uniquement)
   */
  updateStatus: async (propertyId: string, statusData: UpdatePropertyStatusRequest): Promise<void> => {
    await apiClient.put(`/api/properties/${propertyId}/status`, statusData);
  },

  /**
   * Supprimer une propriété (admin uniquement)
   */
  delete: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/api/properties/${propertyId}`);
  },
};

// Services pour les investissements
export const investmentService = {
  /**
   * Récupérer les investissements selon le rôle de l'utilisateur
   */
  getAll: async (): Promise<InvestmentsResponse> => {
    const response = await apiClient.get<InvestmentsResponse>('/api/investments');
    return response.data;
  },

  /**
   * Récupérer un investissement par ID
   */
  getById: async (investmentId: string): Promise<ApiInvestment> => {
    const response = await apiClient.get<ApiInvestment>(`/api/investments/${investmentId}`);
    return response.data;
  },

  /**
   * Créer un nouvel investissement
   */
  create: async (investmentData: CreateInvestmentRequest): Promise<CreateResponse> => {
    const response = await apiClient.post<CreateResponse>('/api/investments', investmentData);
    return response.data;
  },

  /**
   * Mettre à jour un investissement
   */
  update: async (investmentId: string, investmentData: UpdateInvestmentRequest): Promise<void> => {
    await apiClient.put(`/api/investments/${investmentId}`, investmentData);
  },

  /**
   * Supprimer un investissement
   */
  delete: async (investmentId: string): Promise<void> => {
    await apiClient.delete(`/api/investments/${investmentId}`);
  },
};

// Export de l'instance API pour une utilisation directe si nécessaire
export default apiClient; 