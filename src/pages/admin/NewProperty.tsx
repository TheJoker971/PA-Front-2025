import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Users, Calendar, Sparkles, FileText } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import ImageUploader from '../../components/common/ImageUploader';
import ImageGallery from '../../components/common/ImageGallery';
import DocumentGallery from '../../components/common/DocumentGallery';

const NewProperty: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    tokenPrice: '',
    totalTokens: '',
    expectedReturn: '',
    mainImage: '',
    galleryImages: [] as string[],
    documents: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, mainImage: url }));
  };

  const handleGalleryImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, galleryImages: urls }));
  };

  const handleDocumentsChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, documents: urls }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.name || !formData.location || !formData.mainImage || formData.documents.length === 0) {
      showToast({
        type: 'error',
        title: 'Formulaire incomplet',
        message: 'Veuillez remplir tous les champs obligatoires, ajouter une image principale et au moins un document.'
      });
      return;
    }
    
    // Ici, vous enverriez les données au backend ou à la blockchain
    console.log('Données du formulaire:', formData);
    
    // Simulation de succès
    showToast({
      type: 'success',
      title: 'Propriété créée',
      message: 'La propriété a été créée avec succès et est en attente de validation.'
    });
    
    // Rediriger vers la liste des propriétés
    navigate('/admin/properties');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle propriété</h1>
        <p className="text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour ajouter une nouvelle propriété</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
            Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Nom de la propriété *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                Emplacement *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
            Informations financières
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">
                Prix total (€) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tokenPrice" className="block text-sm font-bold text-gray-700 mb-2">
                Prix par token (€) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  id="tokenPrice"
                  name="tokenPrice"
                  value={formData.tokenPrice}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="expectedReturn" className="block text-sm font-bold text-gray-700 mb-2">
                Rendement attendu (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="expectedReturn"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full pr-8 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="totalTokens" className="block text-sm font-bold text-gray-700 mb-2">
                Nombre total de tokens *
              </label>
              <input
                type="number"
                id="totalTokens"
                name="totalTokens"
                value={formData.totalTokens}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-cyan-600" />
            Images et documents
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Image principale *
              </label>
              <ImageUploader
                onImageUploaded={handleMainImageUploaded}
                initialImage={formData.mainImage}
                folder="properties/admin/main"
                className="max-w-md"
                maxSizeMB={10}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Images supplémentaires
              </label>
              <ImageGallery
                onImagesChange={handleGalleryImagesChange}
                initialImages={formData.galleryImages}
                maxImages={5}
                folder="properties/admin/gallery"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Documents légaux *
              </label>
              <DocumentGallery
                onDocumentsChange={handleDocumentsChange}
                initialDocuments={formData.documents}
                maxDocuments={5}
                folder="properties/admin/documents"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Créer la propriété
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProperty;