import React, { useState } from 'react';
import { Plus, Edit, Eye, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp, Building2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const OwnerProperties: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const { showModal, showToast } = useNotification();

  const ownerProperties = [
    {
      id: '1',
      name: 'Manhattan Office Complex',
      location: 'New York, NY',
      status: 'active',
      totalValue: 5000000,
      fundingProgress: 70,
      totalRaised: 3500000,
      investors: 245,
      submittedDate: new Date('2024-01-15'),
      imageUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      name: 'Beverly Hills Residential',
      location: 'Beverly Hills, CA',
      status: 'pending_approval',
      totalValue: 8000000,
      fundingProgress: 0,
      totalRaised: 0,
      investors: 0,
      submittedDate: new Date('2024-03-10'),
      imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      name: 'Seattle Tech Hub',
      location: 'Seattle, WA',
      status: 'funded',
      totalValue: 6500000,
      fundingProgress: 100,
      totalRaised: 6500000,
      investors: 387,
      submittedDate: new Date('2023-11-20'),
      imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      name: 'Miami Beach Resort',
      location: 'Miami Beach, FL',
      status: 'rejected',
      totalValue: 12000000,
      fundingProgress: 0,
      totalRaised: 0,
      investors: 0,
      submittedDate: new Date('2024-02-05'),
      imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const filteredProperties = ownerProperties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'funded':
        return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case 'pending_approval':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
      case 'pending_approval':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'rejected':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const handleDelete = async (propertyId: string, propertyName: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Delete Property',
      message: `Are you sure you want to delete "${propertyName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Property Deleted',
        message: `"${propertyName}" has been successfully deleted.`
      });
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
              My Properties
            </h1>
            <p className="text-xl text-gray-600">
              Manage all your property listings and track their performance
            </p>
          </div>
          <Link
            to="/owner/properties/new"
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
                { key: 'all', label: 'All Properties', count: ownerProperties.length },
                { key: 'active', label: 'Active', count: ownerProperties.filter(p => p.status === 'active').length },
                { key: 'funded', label: 'Funded', count: ownerProperties.filter(p => p.status === 'funded').length },
                { key: 'pending_approval', label: 'Pending', count: ownerProperties.filter(p => p.status === 'pending_approval').length },
                { key: 'rejected', label: 'Rejected', count: ownerProperties.filter(p => p.status === 'rejected').length }
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProperties.map((property) => (
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
                    {property.status.replace('_', ' ').charAt(0).toUpperCase() + property.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  {getStatusIcon(property.status)}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {property.name}
                </h3>
                <p className="text-gray-600 mb-6 font-medium">{property.location}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Value</p>
                    <p className="text-xl font-bold text-gray-900">${(property.totalValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Raised</p>
                    <p className="text-xl font-bold text-emerald-600">${(property.totalRaised / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Investors</p>
                    <p className="text-xl font-bold text-indigo-600">{property.investors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Submitted</p>
                    <p className="text-xl font-bold text-gray-900">{property.submittedDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {property.status !== 'rejected' && (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Funding Progress</span>
                      <span className="font-bold text-gray-900">{property.fundingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 shadow-lg"
                        style={{ width: `${property.fundingProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
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
                  <button 
                    onClick={() => handleDelete(property.id, property.name)}
                    className="bg-red-100 text-red-700 py-3 px-4 rounded-2xl hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-8">No properties match your current filter criteria.</p>
            <Link
              to="/owner/properties/new"
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerProperties;