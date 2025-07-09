import React from 'react';
import { TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
import { mockInvestments } from '../../data/mockData';

const DashboardProperties: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
        <p className="text-lg text-gray-600 mt-2">
          Track your real estate investments and their performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockInvestments.map((investment) => (
          <div key={investment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={investment.property.imageUrl}
                alt={investment.property.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {investment.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{investment.property.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{investment.property.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tokens Owned</p>
                  <p className="text-lg font-semibold text-gray-900">{investment.tokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Investment Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {investment.investmentDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Invested</span>
                  <span className="font-semibold text-gray-900">${investment.totalInvested.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Value</span>
                  <span className="font-semibold text-gray-900">${investment.currentValue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Returns</span>
                  <span className="font-semibold text-green-600">${investment.totalReturns.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className="font-semibold text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +{((investment.currentValue - investment.totalInvested) / investment.totalInvested * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Annual Yield</span>
                  <span className="font-semibold text-blue-600">{investment.property.annualYield}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardProperties;