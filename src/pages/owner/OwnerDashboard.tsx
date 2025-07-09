import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Sparkles, Zap } from 'lucide-react';

const OwnerDashboard: React.FC = () => {

  // Mock data for property owner
  const ownerProperties = [
    {
      id: '1',
      name: 'Manhattan Office Complex',
      status: 'active',
      totalValue: 5000000,
      fundingProgress: 70,
      totalRaised: 3500000,
      investors: 245,
      submittedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Beverly Hills Residential',
      status: 'pending_approval',
      totalValue: 8000000,
      fundingProgress: 0,
      totalRaised: 0,
      investors: 0,
      submittedDate: new Date('2024-03-10')
    },
    {
      id: '3',
      name: 'Seattle Tech Hub',
      status: 'funded',
      totalValue: 6500000,
      fundingProgress: 100,
      totalRaised: 6500000,
      investors: 387,
      submittedDate: new Date('2023-11-20')
    }
  ];

  const totalProperties = ownerProperties.length;
  const totalValue = ownerProperties.reduce((sum, prop) => sum + prop.totalValue, 0);
  const totalRaised = ownerProperties.reduce((sum, prop) => sum + prop.totalRaised, 0);
  const totalInvestors = ownerProperties.reduce((sum, prop) => sum + prop.investors, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case 'funded':
        return <CheckCircle className="h-5 w-5 text-indigo-600" />;
      case 'pending_approval':
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'pending_approval':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-4">
            <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-indigo-800 font-semibold">Property Owner Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Welcome back, Property Owner
          </h1>
          <p className="text-xl text-gray-600">
            Manage your property listings and track investment performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Properties</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {totalProperties}
                </p>
              </div>
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${(totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Raised</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  ${(totalRaised / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-cyan-600" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Investors</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {totalInvestors}
                </p>
              </div>
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Ready to List a New Property?</h2>
              </div>
              <p className="text-indigo-100 text-lg mb-6">
                Create a new property listing and start raising funds from investors
              </p>
            </div>
            <Link
              to="/owner/properties/new"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
                My Properties
              </h2>
              <Link
                to="/owner/properties"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {ownerProperties.map((property) => (
              <div key={property.id} className="p-8 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 mr-6">
                      {getStatusIcon(property.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                          {property.status.replace('_', ' ').charAt(0).toUpperCase() + property.status.replace('_', ' ').slice(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Submitted: {property.submittedDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Value</p>
                        <p className="text-lg font-bold text-gray-900">${(property.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Raised</p>
                        <p className="text-lg font-bold text-emerald-600">${(property.totalRaised / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Investors</p>
                        <p className="text-lg font-bold text-indigo-600">{property.investors}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${property.fundingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{property.fundingProgress}% funded</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;