import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Eye, FileText, MapPin, DollarSign, Calendar, AlertTriangle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const PropertyValidation: React.FC = () => {
  const { showToast, showModal } = useNotification();
  const [filter, setFilter] = useState('pending');

  // Mock data for pending properties
  const pendingProperties = [
    {
      id: '5',
      name: 'Downtown Austin Office',
      location: 'Austin, TX',
      submittedBy: '0x1234...5678',
      submittedDate: new Date('2024-03-15'),
      totalValue: 7500000,
      tokenPrice: 150,
      annualYield: 7.8,
      propertyType: 'commercial',
      status: 'pending_approval',
      imageUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Modern office building in downtown Austin with high-quality tenants and stable rental income.',
      documents: ['Property Deed', 'Financial Statement', 'Appraisal Report', 'Legal Documents'],
      validationNotes: []
    },
    {
      id: '6',
      name: 'Miami Beach Condo',
      location: 'Miami Beach, FL',
      submittedBy: '0x9876...4321',
      submittedDate: new Date('2024-03-12'),
      totalValue: 3200000,
      tokenPrice: 80,
      annualYield: 6.5,
      propertyType: 'residential',
      status: 'pending_approval',
      imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Luxury beachfront condominium with ocean views and premium amenities.',
      documents: ['Property Deed', 'HOA Documents', 'Financial Statement', 'Insurance Policy'],
      validationNotes: ['Missing recent appraisal', 'Need updated financial projections']
    }
  ];

  const handleApprove = async (propertyId: string, propertyName: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Approve Property',
      message: `Are you sure you want to approve "${propertyName}"? This will make it available for investment on the platform.`,
      confirmText: 'Approve',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Property Approved!',
        message: `"${propertyName}" has been approved and is now available for investment.`
      });
    }
  };

  const handleReject = async (propertyId: string, propertyName: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Reject Property',
      message: `Are you sure you want to reject "${propertyName}"? The property owner will be notified of the rejection.`,
      confirmText: 'Reject',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'error',
        title: 'Property Rejected',
        message: `"${propertyName}" has been rejected. The property owner has been notified.`
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'approved':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'rejected':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/admin"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Admin Dashboard</span>
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-6 py-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-amber-800 font-semibold">Property Validation</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Property Approval Center
          </h1>
          <p className="text-xl text-gray-600">
            Review and validate property submissions before they go live
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-semibold text-gray-700">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'pending', label: 'Pending Approval', count: 2 },
                { key: 'approved', label: 'Recently Approved', count: 5 },
                { key: 'rejected', label: 'Rejected', count: 1 }
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

        {/* Properties List */}
        <div className="space-y-6">
          {pendingProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                {/* Property Image and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={property.imageUrl} 
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(property.status)}`}>
                        Pending Review
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Submitted by</span>
                      <span className="font-bold text-gray-900">{property.submittedBy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Date</span>
                      <span className="font-bold text-gray-900">{property.submittedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Type</span>
                      <span className="font-bold text-gray-900 capitalize">{property.propertyType}</span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Financial Details</h4>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Value</span>
                        <span className="font-bold text-gray-900">${property.totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Token Price</span>
                        <span className="font-bold text-gray-900">${property.tokenPrice}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Annual Yield</span>
                        <span className="font-bold text-emerald-600">{property.annualYield}%</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-4">Description</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-2xl p-4">
                    {property.description}
                  </p>
                </div>

                {/* Documents and Actions */}
                <div className="lg:col-span-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Documents</h4>
                  <div className="space-y-3 mb-6">
                    {property.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-indigo-600 mr-2" />
                          <span className="text-gray-700 font-medium">{doc}</span>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {property.validationNotes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Validation Notes</h4>
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <ul className="space-y-2">
                          {property.validationNotes.map((note, index) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-amber-800 text-sm">{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => handleApprove(property.id, property.name)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approve Property
                    </button>
                    <button
                      onClick={() => handleReject(property.id, property.name)}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Reject Property
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors font-semibold">
                      Request More Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties pending approval</h3>
            <p className="text-gray-600">All submitted properties have been reviewed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyValidation;