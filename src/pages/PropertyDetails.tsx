import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin, TrendingUp, Calendar, Users, FileText, Shield, ArrowLeft, Sparkles, Zap, Star, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProperties } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { showToast, showModal } = useNotification();
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  
  const property = mockProperties.find(p => p.id === propertyId);
  
  if (!property) {
    return <Navigate to="/not-found" replace />;
  }

  const fundingProgress = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100;
  const tokensForInvestment = Math.floor(investmentAmount / property.tokenPrice);

  const handleInvest = async () => {

    const confirmed = await showModal({
      type: 'confirm',
      title: 'Confirm Investment',
      message: `Are you sure you want to invest $${investmentAmount.toLocaleString()} in ${property.name}? You will receive ${tokensForInvestment} tokens.`,
      confirmText: 'Invest Now',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      // Simulate investment processing
      showToast({
        type: 'success',
        title: 'Investment Successful!',
        message: `Your investment of $${investmentAmount.toLocaleString()} has been processed. You now own ${tokensForInvestment} tokens.`
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded': return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'upcoming': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/properties"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Properties</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
              <div className="relative">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-xl ${getStatusColor(property.status)}`}>
                    <Star className="h-4 w-4 inline mr-1" />
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {property.name}
                  </h1>
                </div>
                
                <div className="flex items-center text-gray-600 mb-8">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full p-2 mr-3">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-medium">{property.location}</span>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-8 bg-gray-50 rounded-2xl p-6">
                  {property.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                      Property Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Value</span>
                        <span className="font-bold text-gray-900">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Property Type</span>
                        <span className="font-bold text-gray-900 capitalize">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Annual Yield</span>
                        <span className="font-bold text-emerald-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {property.annualYield}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                      Tokenization Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Token Price</span>
                        <span className="font-bold text-gray-900">${property.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Tokens</span>
                        <span className="font-bold text-gray-900">{property.totalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Available</span>
                        <span className="font-bold text-gray-900">{property.availableTokens.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                Legal Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.documents.map((doc, index) => (
                  <div key={index} className="group flex items-center p-4 bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 rounded-2xl hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 cursor-pointer transition-all duration-300 transform hover:scale-105">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-2 mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-indigo-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
                Investment Details
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Funding Progress</span>
                  <span className="font-bold text-gray-900">{fundingProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-700 shadow-lg"
                    style={{ width: `${fundingProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 font-medium bg-gray-50 rounded-xl p-3">
                  ${((property.totalTokens - property.availableTokens) * property.tokenPrice).toLocaleString()} raised of ${property.totalValue.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    min={property.tokenPrice}
                    step={property.tokenPrice}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Tokens to receive</span>
                    <span className="font-bold text-gray-900 text-lg">{tokensForInvestment}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Ownership %</span>
                    <span className="font-bold text-gray-900">{((tokensForInvestment / property.totalTokens) * 100).toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Est. Annual Return</span>
                    <span className="font-bold text-emerald-600 text-lg">${((investmentAmount * property.annualYield) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleInvest}
                disabled={property.availableTokens === 0}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  property.availableTokens === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/25'
                }`}
              >
                {property.availableTokens === 0 ? 'Fully Funded' : 'Invest Now'}
              </button>
              
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-2xl p-4">
                <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="font-medium">Secured by blockchain smart contracts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;