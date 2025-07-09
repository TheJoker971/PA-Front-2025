import React, { useState } from 'react';
import { DollarSign, Calendar, Send, CheckCircle, Sparkles, TrendingUp, Gift } from 'lucide-react';
import { mockProperties } from '../../data/mockData';
import { useNotification } from '../../context/NotificationContext';

const AdminRewards: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardPeriod, setRewardPeriod] = useState('');
  const { showToast, showModal } = useNotification();

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const property = mockProperties.find(p => p.id === selectedProperty);
    if (!property) return;

    const confirmed = await showModal({
      type: 'confirm',
      title: 'Confirm Reward Distribution',
      message: `Are you sure you want to distribute $${Number(rewardAmount).toLocaleString()} to investors of ${property.name} for ${rewardPeriod}?`,
      confirmText: 'Distribute',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Distribution Successful!',
        message: `$${Number(rewardAmount).toLocaleString()} has been distributed to ${property.name} investors for ${rewardPeriod}.`
      });
      
      // Reset form
      setSelectedProperty('');
      setRewardAmount('');
      setRewardPeriod('');
    }
  };

  const recentDistributions = [
    {
      id: '1',
      property: mockProperties[0],
      amount: 125000,
      period: 'Q3 2024',
      date: new Date('2024-09-30'),
      status: 'completed'
    },
    {
      id: '2',
      property: mockProperties[1],
      amount: 85000,
      period: 'Q3 2024',
      date: new Date('2024-09-30'),
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-6 py-3 mb-4">
            <Gift className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-semibold">Reward Distribution</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Reward Distribution
          </h1>
          <p className="text-xl text-gray-600">
            Distribute rental income and returns to property investors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Distribution Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
                New Distribution
              </h2>
              
              <form onSubmit={handleDistribute} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Property
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                  >
                    <option value="">Choose a property...</option>
                    {mockProperties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Total Amount ($)
                    </label>
                    <input
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                      placeholder="125000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Period
                    </label>
                    <input
                      type="text"
                      value={rewardPeriod}
                      onChange={(e) => setRewardPeriod(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                      placeholder="Q4 2024"
                    />
                  </div>
                </div>

                {selectedProperty && rewardAmount && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Distribution Preview
                    </h3>
                    <div className="text-sm text-indigo-800 space-y-2">
                      <p>Property: {mockProperties.find(p => p.id === selectedProperty)?.name}</p>
                      <p>Total Amount: ${Number(rewardAmount).toLocaleString()}</p>
                      <p>Estimated Recipients: {Math.floor(Math.random() * 500) + 100} investors</p>
                      <p>Average per Token: ${(Number(rewardAmount) / 50000).toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Distribute Rewards
                </button>
              </form>
            </div>
          </div>

          {/* Stats & Recent Distributions */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
                Distribution Stats
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">This Quarter</span>
                    <span className="font-bold text-emerald-600 text-xl">$210,000</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Distributed</span>
                    <span className="font-bold text-indigo-600 text-xl">$2.5M</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Active Properties</span>
                    <span className="font-bold text-cyan-600 text-xl">8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Distributions */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-emerald-600" />
                Recent Distributions
              </h3>
              <div className="space-y-6">
                {recentDistributions.map((distribution) => (
                  <div key={distribution.id} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{distribution.property.name}</h4>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">${distribution.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Period:</span>
                        <span className="font-semibold">{distribution.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-semibold">{distribution.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewards;