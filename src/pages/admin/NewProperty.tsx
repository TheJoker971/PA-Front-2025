import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Users, Calendar, Sparkles, FileText } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import ImageUploader from '../../components/common/ImageUploader';
import ImageGallery from '../../components/common/ImageGallery';
import DocumentGallery from '../../components/common/DocumentGallery';
import { uploadFile, uploadJson } from '../../services/upload';
import PropertyFactoryABI from '../../abi/PropertyFactory.json';
import { useAccount, useWriteContract } from 'wagmi';

const PROPERTY_FACTORY_ADDRESS = '0x836C1C6FE9f544324c6722d65B3206B6a3106A20'; // À adapter si besoin

const NewProperty: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    propertyType: 'residential',
    totalValue: '',
    tokenPrice: '',
    annualYield: '',
    mainImage: '',
    images: [] as string[],
    documents: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, mainImage: url }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const handleDocumentsChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, documents: urls }));
  };

  const calculateTokens = () => {
    if (formData.totalValue && formData.tokenPrice) {
      return Math.floor(Number(formData.totalValue) / Number(formData.tokenPrice));
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.mainImage || formData.images.length === 0) {
      showToast({
        type: 'error',
        title: 'Formulaire incomplet',
        message: 'Veuillez remplir tous les champs obligatoires et ajouter au moins une image.'
      });
      return;
    }
    if (!address) {
      showToast({
        type: 'error',
        title: 'Wallet non connecté',
        message: 'Connectez votre wallet pour ajouter une propriété.'
      });
      return;
    }
    try {
      showToast({ type: 'info', title: 'Upload en cours', message: 'Envoi des images sur Firebase...' });
      // 1. Upload de l’image principale si c’est un fichier local (sinon déjà url)
      let mainImageUrl = formData.mainImage;
      if (
        formData.mainImage &&
        typeof formData.mainImage !== 'string' &&
        Object.prototype.toString.call(formData.mainImage) === '[object File]'
      ) {
        mainImageUrl = await uploadFile(formData.mainImage, `properties/${Date.now()}-main.jpg`);
      }
      // 2. Upload des images supplémentaires si besoin
      const imagesUrls = await Promise.all(
        formData.images.map(async (img: any, idx: number) => {
          if (typeof img === 'string') return img;
          return uploadFile(img, `properties/${Date.now()}-img${idx}.jpg`);
        })
      );
      // 3. Génération du JSON de métadonnées
      const metadata = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        propertyType: formData.propertyType,
        mainImage: mainImageUrl,
        images: imagesUrls,
        documents: formData.documents,
        createdAt: new Date().toISOString()
      };
      // 4. Upload du JSON sur Firebase
      showToast({ type: 'info', title: 'Upload des métadonnées', message: 'Envoi du JSON sur Firebase...' });
      const metadataUri = await uploadJson(metadata, `properties/${Date.now()}-metadata.json`);
      // 5. Préparation des paramètres pour le smart contract
      const totalTokens = calculateTokens();
      const unitPrice = formData.tokenPrice ? BigInt(Number(formData.tokenPrice) * 1e18) : 0n;
      const totalValue = formData.totalValue ? BigInt(Number(formData.totalValue) * 1e18) : 0n;
      const annualYield = formData.annualYield ? Math.round(Number(formData.annualYield) * 100) : 0; // 8% => 800
      const erc20Name = `${formData.name} Shares`;
      const erc20Symbol = formData.name.substring(0, 3).toUpperCase();
      // 6. Appel on-chain
      showToast({ type: 'info', title: 'Transaction en cours', message: 'Signature de la transaction...' });
      const args = [
        formData.name, // propertyName
        metadataUri,   // propertyURI
        totalValue,    // displayPrice
        erc20Name,     // erc20Name
        erc20Symbol,   // erc20Symbol
        totalTokens,   // erc20MaxSupply
        unitPrice,     // unitPrice
        metadataUri,   // metadataURI
        annualYield,   // annualYield (en basis points)
        totalValue,    // propertyPrice
        address        // admin
      ];
      console.log('Appel on-chain createFullProperty', args);
      try {
        const tx = await writeContractAsync({
          address: PROPERTY_FACTORY_ADDRESS,
          abi: PropertyFactoryABI.abi,
          functionName: 'createFullProperty',
          args
        });
        console.log('Transaction result:', tx);
    showToast({
      type: 'success',
          title: 'Propriété ajoutée !',
          message: `La propriété "${formData.name}" a été ajoutée on-chain avec succès.`
        });
        setFormData({
          name: '', location: '', description: '', propertyType: 'residential', totalValue: '', tokenPrice: '', annualYield: '', mainImage: '', images: [], documents: []
        });
    navigate('/admin/properties');
      } catch (err: any) {
        console.error('Erreur on-chain', err);
        showToast({
          type: 'error',
          title: 'Erreur',
          message: err?.message || 'Une erreur est survenue lors de l’ajout on-chain.'
        });
      }
    } catch (err: any) {
      console.error('Erreur on-chain', err);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: err?.message || 'Une erreur est survenue lors de l’ajout on-chain.'
      });
    }
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
            <div className="md:col-span-2">
              <label htmlFor="propertyType" className="block text-sm font-bold text-gray-700 mb-2">
                Type de propriété *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="residential">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industriel</option>
                <option value="other">Autre</option>
              </select>
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
              <label htmlFor="totalValue" className="block text-sm font-bold text-gray-700 mb-2">
                Prix total (€) *
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
              <label htmlFor="annualYield" className="block text-sm font-bold text-gray-700 mb-2">
                Rendement attendu (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="annualYield"
                  name="annualYield"
                  value={formData.annualYield}
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
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-indigo-600" />
            Images et documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image principale *</label>
              <ImageUploader onImageUploaded={handleMainImageUploaded} initialImage={formData.mainImage} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 mt-6">Galerie d'images</label>
              <ImageGallery onImagesChange={handleImagesChange} initialImages={formData.images} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Documents</label>
              <DocumentGallery onDocumentsChange={handleDocumentsChange} initialDocuments={formData.documents} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Créer la propriété
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProperty;