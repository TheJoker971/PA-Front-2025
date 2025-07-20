export interface Property {
  id: string;
  name: string;
  image: string;
  location: string;
  propertyType: string;
  status: string;
  price: number;
  tokenAddress?: string;
  imageUrl?: string;
  description?: string;
  totalValue?: number;
  tokenPrice?: number;
  annualYield?: number;
  availableTokens?: number;
  totalTokens?: number;
  decimals?: number;
  // Ajoute d'autres champs si besoin
}

export interface Investment {
  id: string;
  propertyId: string;
  property: Property;
  tokens: number;
  investmentDate: Date;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  status: 'active' | 'sold';
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'reward' | 'sale' | 'withdrawal';
  propertyId?: string;
  property?: Property;
  amount: number;
  tokens?: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
}

export interface User {
  address: string;
  role: 'investor' | 'admin' | 'property_manager' | 'yield_manager' | 'property_owner';
  balance: number;
  investments: Investment[];
  transactions: Transaction[];
}

export interface ClaimableReward {
  id: string;
  propertyId: string;
  property: Property;
  amount: number;
  period: string;
  available: boolean;
}