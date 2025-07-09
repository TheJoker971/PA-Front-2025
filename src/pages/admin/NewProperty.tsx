import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, X, Building2, DollarSign, Percent, MapPin, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const NewProperty: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    propertyType: 'residential',
    totalValue: '',
    tokenPrice: '',
    annualYield: '',
    images: [] as string[],
    documents: [] as string[]
  });
  const { showToast, showModal } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Create Property',
      message: `Are you sure you want to create "${formData.name}"? This will add it directly to the platform as an active property.`,
      confirmText: 'Create Property',
      cancelText: 'Continue Editing'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Property Created Successfully!',
        message: `"${formData.name}" has been created and is now available for investment.`
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        propertyType: 'residential',
        totalValue: '',
        tokenPrice: '',
        annualYield: '',
        images: [],
        documents: []
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTokens = () => {
    if (formData.totalValue && formData.tokenPrice) {
      return Math.floor(Number(formData.totalValue) / Number(formData.tokenPrice));
    }
    return 0;
  };

  const calculateMinInvestment = () => {
    return formData.tokenPrice ? Number(formData.tokenPrice) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/admin/properties"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Properties</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Add New Property</h1>
                <p className="text-indigo-100 text-lg">Create a new tokenized property listing for investors</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="Manhattan Office Complex"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="New York, NY"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                  placeholder="Detailed description of the property, its features, and investment potential..."
                />
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
                Financial Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Total Property Value ($) *
                  </label>
                  <input
                    type="number"
                    name="totalValue"
                    value={formData.totalValue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="5000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Token Price ($) *
                  </label>
                  <input
                    type="number"
                    name="tokenPrice"
                    value={formData.tokenPrice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Percent className="h-4 w-4 inline mr-1" />
                    Annual Yield (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="annualYield"
                    value={formData.annualYield}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors font-medium"
                    placeholder="8.5"
                  />
                </div>
              </div>

              {/* Calculation Preview */}
              {formData.totalValue && formData.tokenPrice && (
                <div className="mt-6 bg-white rounded-2xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-emerald-600" />
                    Tokenization Preview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Tokens</p>
                      <p className="text-2xl font-bold text-emerald-600">{calculateTokens().toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Min Investment</p>
                      <p className="text-2xl font-bold text-emerald-600">${calculateMinInvestment()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Est. Annual Return per Token</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${formData.annualYield ? ((Number(formData.tokenPrice) * Number(formData.annualYield)) / 100).toFixed(2) : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* File Uploads */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-cyan-600" />
                Media & Documents
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Property Images *
                  </label>
                  <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-8 text-center bg-white hover:bg-cyan-50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Legal Documents *
                  </label>
                  <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-8 text-center bg-white hover:bg-cyan-50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Upload property documents</p>
                    <p className="text-sm text-gray-500 mt-2">PDF files up to 50MB each</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Ready to Create Property?</h3>
                  <p className="text-indigo-100">This property will be immediately available for investment.</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/admin/properties"
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-white text-indigo-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Create Property
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProperty;