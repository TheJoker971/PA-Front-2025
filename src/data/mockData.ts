import { Property, Investment, Transaction, ClaimableReward } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Manhattan Office Complex',
    description: 'Prime commercial real estate in the heart of Manhattan. Modern office building with high-quality tenants and stable rental income.',
    location: 'New York, NY',
    totalValue: 5000000,
    tokenPrice: 100,
    totalTokens: 50000,
    availableTokens: 15000,
    annualYield: 8.5,
    imageUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active',
    propertyType: 'commercial',
    documents: ['Property Report', 'Financial Statement', 'Legal Documents']
  },
  {
    id: '2',
    name: 'Beverly Hills Residential',
    description: 'Luxury residential property in Beverly Hills with premium amenities and excellent rental yield potential.',
    location: 'Beverly Hills, CA',
    totalValue: 8000000,
    tokenPrice: 200,
    totalTokens: 40000,
    availableTokens: 8000,
    annualYield: 6.2,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'active',
    propertyType: 'residential',
    documents: ['Property Report', 'Financial Statement', 'Legal Documents']
  },
  {
    id: '3',
    name: 'Miami Beach Hotel',
    description: 'Boutique hotel property on Miami Beach with consistent tourism revenue and growth potential.',
    location: 'Miami Beach, FL',
    totalValue: 12000000,
    tokenPrice: 300,
    totalTokens: 40000,
    availableTokens: 0,
    annualYield: 9.1,
    imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'funded',
    propertyType: 'commercial',
    documents: ['Property Report', 'Financial Statement', 'Legal Documents']
  },
  {
    id: '4',
    name: 'Seattle Tech Hub',
    description: 'Modern office space in Seattle\'s tech district. High-growth area with excellent tenant demand.',
    location: 'Seattle, WA',
    totalValue: 6500000,
    tokenPrice: 150,
    totalTokens: 43333,
    availableTokens: 43333,
    annualYield: 7.8,
    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'upcoming',
    propertyType: 'commercial',
    documents: ['Property Report', 'Financial Statement', 'Legal Documents']
  }
];

export const mockInvestments: Investment[] = [
  {
    id: '1',
    propertyId: '1',
    property: mockProperties[0],
    tokens: 500,
    investmentDate: new Date('2024-01-15'),
    totalInvested: 50000,
    currentValue: 52500,
    totalReturns: 4250,
    status: 'active'
  },
  {
    id: '2',
    propertyId: '2',
    property: mockProperties[1],
    tokens: 250,
    investmentDate: new Date('2024-02-20'),
    totalInvested: 50000,
    currentValue: 51000,
    totalReturns: 2580,
    status: 'active'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    propertyId: '1',
    property: mockProperties[0],
    amount: 50000,
    tokens: 500,
    date: new Date('2024-01-15'),
    status: 'completed',
    hash: '0x1234567890abcdef'
  },
  {
    id: '2',
    type: 'reward',
    propertyId: '1',
    property: mockProperties[0],
    amount: 2125,
    date: new Date('2024-07-01'),
    status: 'completed',
    hash: '0xabcdef1234567890'
  },
  {
    id: '3',
    type: 'purchase',
    propertyId: '2',
    property: mockProperties[1],
    amount: 50000,
    tokens: 250,
    date: new Date('2024-02-20'),
    status: 'completed',
    hash: '0x567890abcdef1234'
  }
];

export const mockClaimableRewards: ClaimableReward[] = [
  {
    id: '1',
    propertyId: '1',
    property: mockProperties[0],
    amount: 2125,
    period: 'Q3 2024',
    available: true
  },
  {
    id: '2',
    propertyId: '2',
    property: mockProperties[1],
    amount: 1290,
    period: 'Q3 2024',
    available: true
  }
];