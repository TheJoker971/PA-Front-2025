import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, CheckCircle, Clock, AlertCircle, Filter, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProperties } from '../../data/mockData';

const AdminProperties: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filteredProperties = mockProperties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'funded':
        return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'funded':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      case 'upcoming':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-4">
              <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-semibold">Property Management</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Property Management
            </h1>
            <p className="text-xl text-gray-600">
              Manage all tokenized properties on the platform
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 flex items-center font-semibold"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Property
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-semibold text-gray-700">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Properties', count: mockProperties.length },
                { key: 'active', label: 'Active', count: mockProperties.filter(p => p.status === 'active').length },
                { key: 'funded', label: 'Funded', count: mockProperties.filter(p => p.status === 'funded').length },
                { key: 'upcoming', label: 'Upcoming', count: mockProperties.filter(p => p.status === 'upcoming').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    filter === tab.key 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            const fundingProgress = ((property.totalTokens - property.availableTokens) / property.totalTokens) * 100;
            
            return (
              <div key={property.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(property.status)}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    {getStatusIcon(property.status)}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-6 font-medium">{property.location}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-sm text-gray-600 font-medium">Total Value</p>
                      <p className="text-lg font-bold text-gray-900">${(property.totalValue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                      <p className="text-sm text-gray-600 font-medium">Yield</p>
                      <p className="text-lg font-bold text-emerald-600">{property.annualYield}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Funding Progress</span>
                      <span className="font-bold text-gray-900">{fundingProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 shadow-lg"
                        style={{ width: `${fundingProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {property.availableTokens.toLocaleString()} of {property.totalTokens.toLocaleString()} tokens available
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/properties/${property.id}`}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-center font-semibold flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                    <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl hover:bg-gray-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="bg-red-100 text-red-700 py-3 px-4 rounded-2xl hover:bg-red-200 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-8">No properties match your current filter criteria.</p>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;