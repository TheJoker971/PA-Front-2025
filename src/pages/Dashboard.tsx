import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, DollarSign, Calendar } from 'lucide-react';
import { mockInvestments, mockTransactions } from '../data/mockData';

const Dashboard: React.FC = () => {
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalCurrentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = mockInvestments.reduce((sum, inv) => sum + inv.totalReturns, 0);
  const totalProperties = mockInvestments.length;
  
  const recentTransactions = mockTransactions.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome to your investment dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalCurrentValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium text-green-600">
              +{((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">${totalReturns.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Investments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Investments</h2>
            <Link to="/dashboard/properties" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {mockInvestments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={investment.property.imageUrl}
                    alt={investment.property.name}
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{investment.property.name}</h3>
                    <p className="text-sm text-gray-600">{investment.tokens} tokens</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${investment.totalInvested.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{((investment.currentValue - investment.totalInvested) / investment.totalInvested * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Link to="/dashboard/transactions" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">{transaction.type}</h3>
                  <p className="text-sm text-gray-600">{transaction.property?.name}</p>
                  <p className="text-xs text-gray-500">{transaction.date.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${transaction.amount.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;