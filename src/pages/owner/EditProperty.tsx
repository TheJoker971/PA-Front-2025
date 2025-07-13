import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, DollarSign, FileText } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import ImageUploader from '../../components/common/ImageUploader';
import ImageGallery from '../../components/common/ImageGallery';
import DocumentGallery from '../../components/common/DocumentGallery';

// Simuler une récupération de données
const mockProperty = {
  id: '1',
  name: 'Appartement Paris 15ème',
  description: 'Bel appartement rénové avec vue dégagée',
  location: 'Paris, France',
  propertyType: 'residential',
  totalValue: '450000',
  tokenPrice: '100',
  annualYield: '5.2',
  mainImage: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  documents: ['https://example.com/doc1.pdf']
};

const EditProperty: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { showToast, showModal } = useNotification();
  
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
  
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setFormData(mockProperty);
      setIsLoading(false);
    }, 500);
  }, [propertyId]);

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
      title: 'Enregistrer les modifications',
      message: `Êtes-vous sûr de vouloir enregistrer les modifications de "${formData.name}" ?`,
      confirmText: 'Enregistrer',
      cancelText: 'Annuler'
    });

    if (confirmed) {
      // Simuler une sauvegarde
      showToast({
        type: 'success',
        title: 'Modifications enregistrées',
        message: `Les modifications de "${formData.name}" ont été enregistrées avec succès.`
      });
      
      // Rediriger vers la liste des propriétés
      navigate('/owner/properties');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-lg text-gray-600">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link to="/owner/properties" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux propriétés</span>
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-gray-900">Modifier la propriété</h1>
        <p className="text-gray-600">Mettez à jour les informations de votre propriété.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Information */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
            Informations de la propriété
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
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Entrez le nom de la propriété"
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
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Entrez l'emplacement"
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
                placeholder="Décrivez votre propriété en détail"
                required
              />
            </div>
            
            <div>
              <label htmlFor="propertyType" className="block text-sm font-bold text-gray-700 mb-2">
                Type de propriété *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="residential">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industriel</option>
                <option value="land">Terrain</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
            Détails financiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="totalValue" className="block text-sm font-bold text-gray-700 mb-2">
                Valeur totale (€) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
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
                Prix du token (€) *
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
                Rendement annuel attendu (%) *
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
            Médias et documents
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Image principale *
              </label>
              <ImageUploader
                onImageUploaded={handleMainImageUploaded}
                initialImage={formData.mainImage}
                folder="properties/edit/main"
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
                folder="properties/edit/gallery"
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
                folder="properties/edit/documents"
              />
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/owner/properties"
            className="px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty; 