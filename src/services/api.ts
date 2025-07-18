import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

// Configuration par défaut pour Axios
const apiConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important pour envoyer les cookies de session
};

// Création de l'instance Axios
const apiClient: AxiosInstance = axios.create(apiConfig);

// Intercepteur pour gérer les erreurs de manière cohérente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Gérer les erreurs spécifiques ici
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui n'est pas dans la plage 2xx
      console.error('Erreur API:', error.response.data);
      
      // Rediriger vers la page de connexion si non authentifié (401)
      if (error.response.status === 401) {
        console.error('Session expirée ou non authentifié');
        // window.location.href = '/login'; // Décommentez pour rediriger
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Types pour les données API
export interface Property {
  id?: string;
  onchain_id: string;
  name: string;
  location: string;
  property_type: string;
  description: string;
  total_price: number;
  token_price: number;
  annual_yield: number;
  image_url: string;
  documents: string[];
  is_validated?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Investment {
  id?: string;
  property_id: string;
  user_id?: string;
  amount_eth: number;
  shares: number;
  tx_hash: string;
  created_at?: string;
}

export interface User {
  id?: string;
  signature: string;
  name?: string;
  role?: string;
  created_at?: string;
}

// Services d'authentification
export const authService = {
  /**
   * Connexion utilisateur avec signature
   * @param signature - La signature cryptographique
   */
  login: async (signature: string) => {
    const response = await apiClient.post('/auth/login', { signature });
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Services pour les propriétés
export const propertyService = {
  /**
   * Récupérer toutes les propriétés validées (public)
   */
  getAll: async () => {
    const response = await apiClient.get('/properties');
    return response.data;
  },

  /**
   * Récupérer une propriété validée par son ID (public)
   * @param propertyId - L'ID de la propriété
   */
  getById: async (propertyId: string) => {
    const response = await apiClient.get(`/properties/${propertyId}`);
    return response.data;
  },

  /**
   * Récupérer toutes les propriétés (validées et non validées) (admin/manager)
   */
  getAllAdmin: async () => {
    const response = await apiClient.get('/properties/all');
    return response.data;
  },

  /**
   * Récupérer une propriété par son ID (validée ou non) (admin/manager)
   * @param propertyId - L'ID de la propriété
   */
  getByIdAdmin: async (propertyId: string) => {
    const response = await apiClient.get(`/properties/admin/${propertyId}`);
    return response.data;
  },

  /**
   * Créer une nouvelle propriété (admin/manager)
   * @param property - Les données de la propriété
   */
  create: async (property: Property) => {
    const response = await apiClient.post('/properties', property);
    return response.data;
  },

  /**
   * Valider ou invalider une propriété (admin)
   * @param propertyId - L'ID de la propriété
   * @param isValidated - État de validation
   */
  validate: async (propertyId: string, isValidated: boolean) => {
    const response = await apiClient.put(`/properties/${propertyId}/validate`, { is_validated: isValidated });
    return response.data;
  },
};

// Services pour les investissements
export const investmentService = {
  /**
   * Créer un nouvel investissement (authentifié)
   * @param investment - Les données de l'investissement
   */
  create: async (investment: Omit<Investment, 'user_id' | 'id' | 'created_at'>) => {
    const response = await apiClient.post('/investments', investment);
    return response.data;
  },

  /**
   * Récupérer les investissements (tous pour admin/manager, personnels pour utilisateur)
   */
  getAll: async () => {
    const response = await apiClient.get('/investments');
    return response.data;
  },

  /**
   * Récupérer les investissements d'un utilisateur spécifique (admin/manager ou l'utilisateur lui-même)
   * @param userId - L'ID de l'utilisateur
   */
  getByUserId: async (userId: string) => {
    const response = await apiClient.get(`/investments/user/${userId}`);
    return response.data;
  },
};

// Services pour les utilisateurs
export const userService = {
  /**
   * Créer un nouvel utilisateur
   * @param signature - La signature cryptographique
   * @param name - Le nom de l'utilisateur
   * @param role - Le rôle de l'utilisateur (optionnel, pour admin)
   */
  create: async (signature: string, name?: string, role?: string) => {
    const userData: { signature: string; name?: string; role?: string } = { signature };
    
    if (name) userData.name = name;
    if (role) userData.role = role;
    
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  /**
   * Récupérer tous les utilisateurs (admin/manager)
   */
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
};

// Service pour vérifier la santé de l'API
export const healthService = {
  /**
   * Vérifier l'état de santé de l'API
   */
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Export de l'instance API pour une utilisation directe si nécessaire
export default apiClient; 