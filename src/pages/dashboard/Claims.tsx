import React from 'react';
import { Calendar, DollarSign, Clock, CheckCircle, Sparkles, TrendingUp, Gift } from 'lucide-react';
import { mockClaimableRewards } from '../../data/mockData';
import { useNotification } from '../../context/NotificationContext';

const Claims: React.FC = () => {
  const { showToast, showModal } = useNotification();

  const handleClaim = async (rewardId: string, amount: number, propertyName: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Claim Reward',
      message: `Are you sure you want to claim $${amount.toLocaleString()} from ${propertyName}?`,
      confirmText: 'Claim Now',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Reward Claimed!',
        message: `Successfully claimed $${amount.toLocaleString()} from ${propertyName}. Funds will be transferred to your wallet.`
      });
    }
  };

  const handleClaimAll = async () => {
    const totalAmount = mockClaimableRewards
      .filter(reward => reward.available)
      .reduce((sum, reward) => sum + reward.amount, 0);

    const confirmed = await showModal({
      type: 'confirm',
      title: 'Claim All Rewards',
      message: `Are you sure you want to claim all available rewards totaling $${totalAmount.toLocaleString()}?`,
      confirmText: 'Claim All',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'All Rewards Claimed!',
        message: `Successfully claimed $${totalAmount.toLocaleString()} from all properties. Funds will be transferred to your wallet.`
      });
    }
  };

  const totalClaimable = mockClaimableRewards
    .filter(reward => reward.available)
    .reduce((sum, reward) => sum + reward.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-6 py-3 mb-4">
            <Gift className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-semibold">Rewards Center</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Claimable Rewards
          </h1>
          <p className="text-xl text-gray-600">
            Claim your rental income and investment returns
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Total Claimable Rewards</h2>
              </div>
              <p className="text-5xl font-bold mb-2">${totalClaimable.toLocaleString()}</p>
              <p className="text-emerald-100 text-lg">Ready to claim now</p>
            </div>
            <button
              onClick={handleClaimAll}
              className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5 inline mr-2" />
              Claim All
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {mockClaimableRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={reward.property.imageUrl}
                      alt={reward.property.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-2">
                      <Gift className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{reward.property.name}</h3>
                    <p className="text-gray-600 font-medium mb-2">{reward.property.location}</p>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1 w-fit">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{reward.period}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-4 border border-emerald-100">
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${reward.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-600 font-medium">Available to claim</p>
                  </div>
                  <div className="flex items-center justify-end">
                    {reward.available ? (
                      <button
                        onClick={() => handleClaim(reward.id, reward.amount, reward.property.name)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <CheckCircle className="h-5 w-5 inline mr-2" />
                        Claim Now
                      </button>
                    ) : (
                      <span className="flex items-center text-gray-500 bg-gray-100 px-6 py-3 rounded-2xl font-medium">
                        <Clock className="h-5 w-5 mr-2" />
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
            How Claims Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Quarterly Distribution</h4>
                  <p className="text-gray-600">Rental income is distributed quarterly to token holders</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Automatic Calculation</h4>
                  <p className="text-gray-600">Claims are automatically calculated based on your token ownership</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Direct Transfer</h4>
                  <p className="text-gray-600">Rewards are sent directly to your connected wallet</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Fast Processing</h4>
                  <p className="text-gray-600">Processing typically takes 1-3 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Claims;