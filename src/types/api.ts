// Types pour l'API selon la documentation
export interface ApiUser {
  id: string;
  wallet: string;
  name: string;
  role: 'user' | 'manager' | 'admin';
  created_at: string;
}

export interface ApiProperty {
  id: string;
  onchain_id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  total_price: number;
  token_price: number;
  annual_yield: number;
  image_url: string;
  documents: string[];
  status?: 'pending' | 'validated' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface ApiInvestment {
  id: string;
  user_id: string;
  property_id: string;
  amount_eth: number;
  shares: number;
  tx_hash: string;
  created_at: string;
}

// Types pour les requêtes
export interface LoginRequest {
  wallet: string;
}

export interface CreateUserRequest {
  wallet: string;
  name: string;
  role?: 'user' | 'manager' | 'admin';
}

export interface CreatePropertyRequest {
  onchain_id: string;
  name: string;
  location: string;
  property_type: string;
  description?: string;
  total_price: number;
  token_price: number;
  annual_yield: number;
  image_url?: string;
  documents?: string[];
}

export interface UpdatePropertyStatusRequest {
  status: 'pending' | 'validated' | 'rejected';
}

export interface UpdateUserRoleRequest {
  role: 'user' | 'manager' | 'admin';
}

export interface CreateInvestmentRequest {
  property_id: string;
  amount_eth: number;
  shares: number;
  tx_hash: string;
}

export interface UpdateInvestmentRequest {
  amount_eth: number;
  shares: number;
  tx_hash: string;
}

// Types pour les réponses
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PropertiesPublicResponse {
  properties: ApiProperty[];
  count: number;
  message: string;
}

export interface InvestmentsResponse {
  investments: ApiInvestment[];
  count: number;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export interface CreateResponse {
  id: string;
  message: string;
} 