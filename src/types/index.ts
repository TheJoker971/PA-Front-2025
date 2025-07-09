export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  totalValue: number;
  tokenPrice: number;
  totalTokens: number;
  availableTokens: number;
  annualYield: number;
  imageUrl: string;
  status: 'active' | 'funded' | 'upcoming' | 'pending_approval';
  propertyType: 'residential' | 'commercial' | 'industrial';
  documents: string[];
  ownerId?: string;
  submittedDate?: Date;
  approvedDate?: Date;
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