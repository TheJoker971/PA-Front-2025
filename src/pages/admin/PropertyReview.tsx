import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, MessageSquare, Clock, User, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const PropertyReview: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { showToast, showModal } = useNotification();
  const [reviewNotes, setReviewNotes] = useState('');

  // Mock property data for review
  const property = {
    id: '5',
    name: 'Downtown Austin Office',
    location: 'Austin, TX',
    submittedBy: '0x1234567890abcdef1234567890abcdef12345678',
    submittedDate: new Date('2024-03-15'),
    totalValue: 7500000,
    tokenPrice: 150,
    annualYield: 7.8,
    propertyType: 'commercial',
    status: 'pending_approval',
    imageUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Modern office building in downtown Austin with high-quality tenants and stable rental income. The property features state-of-the-art amenities, energy-efficient systems, and is located in the heart of the business district.',
    documents: [
      { name: 'Property Deed', size: '2.4 MB', type: 'PDF', verified: true },
      { name: 'Financial Statement', size: '1.8 MB', type: 'PDF', verified: true },
      { name: 'Appraisal Report', size: '3.2 MB', type: 'PDF', verified: false },
      { name: 'Legal Documents', size: '4.1 MB', type: 'PDF', verified: true },
      { name: 'Insurance Policy', size: '1.2 MB', type: 'PDF', verified: true },
      { name: 'Environmental Report', size: '2.8 MB', type: 'PDF', verified: false }
    ],
    financialDetails: {
      purchasePrice: 7500000,
      currentMarketValue: 7500000,
      monthlyRent: 48750,
      annualRent: 585000,
      operatingExpenses: 175500,
      netOperatingIncome: 409500,
      capRate: 5.46,
      occupancyRate: 95
    },
    propertyDetails: {
      yearBuilt: 2018,
      totalSquareFeet: 45000,
      floors: 8,
      parkingSpaces: 120,
      tenants: 12,
      averageLeaseLength: '5 years'
    }
  };

  const handleApprove = async () => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Approve Property',
      message: `Are you sure you want to approve "${property.name}"? This will make it available for investment on the platform.`,
      confirmText: 'Approve',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Property Approved!',
        message: `"${property.name}" has been approved and is now available for investment.`
      });
    }
  };

  const handleReject = async () => {
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Reject Property',
      message: `Are you sure you want to reject "${property.name}"? The property owner will be notified of the rejection.`,
      confirmText: 'Reject',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'error',
        title: 'Property Rejected',
        message: `"${property.name}" has been rejected. The property owner has been notified.`
      });
    }
  };

  const handleRequestInfo = async () => {
    if (!reviewNotes.trim()) {
      showToast({
        type: 'warning',
        title: 'Review Notes Required',
        message: 'Please add review notes before requesting additional information.'
      });
      return;
    }

    const confirmed = await showModal({
      type: 'confirm',
      title: 'Request Additional Information',
      message: `Send review notes to the property owner requesting additional information?`,
      confirmText: 'Send Request',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      showToast({
        type: 'info',
        title: 'Information Requested',
        message: 'Your review notes have been sent to the property owner.'
      });
      setReviewNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/admin/validation"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Validation Center</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Pending Review
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h1>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 bg-gray-50 rounded-2xl p-6">
                  {property.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-gray-900 mb-4">Submission Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-gray-600 text-sm">Submitted by: {property.submittedBy.slice(0, 6)}...{property.submittedBy.slice(-4)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-gray-600 text-sm">Date: {property.submittedDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-gray-900 mb-4">Financial Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Total Value</span>
                        <span className="font-semibold">${property.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Token Price</span>
                        <span className="font-semibold">${property.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Annual Yield</span>
                        <span className="font-semibold text-emerald-600">{property.annualYield}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-semibold">${property.financialDetails.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="font-semibold">${property.financialDetails.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Annual Rent</span>
                    <span className="font-semibold">${property.financialDetails.annualRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Operating Expenses</span>
                    <span className="font-semibold">${property.financialDetails.operatingExpenses.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-gray-600">Net Operating Income</span>
                    <span className="font-semibold text-emerald-600">${property.financialDetails.netOperatingIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                    <span className="text-gray-600">Cap Rate</span>
                    <span className="font-semibold text-indigo-600">{property.financialDetails.capRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-xl border border-cyan-200">
                    <span className="text-gray-600">Occupancy Rate</span>
                    <span className="font-semibold text-cyan-600">{property.financialDetails.occupancyRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.yearBuilt}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.totalSquareFeet.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.floors}</div>
                    <div className="text-sm text-gray-600">Floors</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.parkingSpaces}</div>
                    <div className="text-sm text-gray-600">Parking Spaces</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.tenants}</div>
                    <div className="text-sm text-gray-600">Tenants</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{property.propertyDetails.averageLeaseLength}</div>
                    <div className="text-sm text-gray-600">Avg Lease</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Documents</h3>
              <div className="space-y-3">
                {property.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <FileText className="h-4 w-4 text-indigo-600 mr-3" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size} • {doc.type}</div>
                      </div>
                      {doc.verified && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Notes */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Review Notes</h3>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Approve Property
                </button>
                <button
                  onClick={handleReject}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reject Property
                </button>
                <button
                  onClick={handleRequestInfo}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyReview;