import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, X, Building2, DollarSign, Percent, MapPin, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import ImageUploader from '../../components/common/ImageUploader';
import ImageGallery from '../../components/common/ImageGallery';
import DocumentGallery from '../../components/common/DocumentGallery';

const NewProperty: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    propertyType: 'residential',
    totalValue: '',
    tokenPrice: '',
    annualYield: '',
    mainImage: '',
    images: [] as string[],
    documents: [] as string[]
  });
  const { showToast, showModal } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name || !formData.location || !formData.mainImage || formData.images.length === 0 || formData.documents.length === 0) {
      showToast({
        type: 'error',
        title: 'Formulaire incomplet',
        message: 'Veuillez remplir tous les champs obligatoires et ajouter au moins une image et un document.'
      });
      return;
    }
    
    const confirmed = await showModal({
      type: 'confirm',
      title: 'Submit Property for Review',
      message: `Are you sure you want to submit "${formData.name}" for admin review? Once submitted, you won't be able to edit the property until it's reviewed.`,
      confirmText: 'Submit for Review',
      cancelText: 'Continue Editing'
    });

    if (confirmed) {
      showToast({
        type: 'success',
        title: 'Property Submitted Successfully!',
        message: `"${formData.name}" has been submitted for admin review. You'll be notified once it's approved and ready for investment.`
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
        mainImage: '',
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

  const handleMainImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      mainImage: url
    });
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData({
      ...formData,
      images: urls
    });
  };

  const handleDocumentsChange = (urls: string[]) => {
    setFormData({
      ...formData,
      documents: urls
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link to="/owner/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-gray-900">Submit a New Property</h1>
        <p className="text-gray-600">Fill in the details below to submit your property for tokenization.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Information */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
            Property Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter property name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter property location"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Describe your property in detail"
                required
              />
            </div>
            
            <div>
              <label htmlFor="propertyType" className="block text-sm font-bold text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="land">Land</option>
              </select>
            </div>
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
              <label htmlFor="totalValue" className="block text-sm font-bold text-gray-700 mb-2">
                Total Property Value (USD) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="totalValue"
                  name="totalValue"
                  value={formData.totalValue}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="500000"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tokenPrice" className="block text-sm font-bold text-gray-700 mb-2">
                Token Price (USD) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="tokenPrice"
                  name="tokenPrice"
                  value={formData.tokenPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="100"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="annualYield" className="block text-sm font-bold text-gray-700 mb-2">
                Expected Annual Yield (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="annualYield"
                  name="annualYield"
                  value={formData.annualYield}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full pr-8 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="5.5"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Documents */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-cyan-600" />
            Media & Documents
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Image principale *
              </label>
              <ImageUploader
                onImageUploaded={handleMainImageUploaded}
                initialImage={formData.mainImage}
                folder="properties/main"
                className="max-w-md"
                maxSizeMB={10}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Images supplémentaires *
              </label>
              <ImageGallery
                onImagesChange={handleImagesChange}
                initialImages={formData.images}
                maxImages={5}
                folder="properties/gallery"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Documents légaux *
              </label>
              <DocumentGallery
                onDocumentsChange={handleDocumentsChange}
                initialDocuments={formData.documents}
                maxDocuments={3}
                folder="properties/documents"
              />
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProperty;