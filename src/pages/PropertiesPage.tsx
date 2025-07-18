import React, { useEffect, useState } from 'react';
import { propertyService, Property } from '../services/api';
import ApiErrorHandler from '../components/ApiErrorHandler';
import { useApi } from '../context/ApiContext';
import useApiService from '../hooks/useApiService';

const PropertiesPage: React.FC = () => {
  const { isAuthenticated, userRole } = useApi();
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Utilisation de notre hook personnalisé pour les appels API
  const { loading, error, execute: fetchProperties } = useApiService<Property[], []>(
    async () => {
      // Utiliser le service approprié en fonction du rôle
      if (userRole === 'admin' || userRole === 'manager') {
        return propertyService.getAllAdmin();
      } else {
        return propertyService.getAll();
      }
    }
  );

  const { loading: validateLoading, error: validateError, execute: validateProperty } = useApiService<any, [string, boolean]>(
    async (propertyId, isValidated) => {
      return propertyService.validate(propertyId, isValidated);
    }
  );

  // Charger les propriétés au chargement de la page
  useEffect(() => {
    const loadProperties = async () => {
      const result = await fetchProperties();
      if (result) {
        setProperties(result);
      }
    };

    loadProperties();
  }, [fetchProperties]);

  // Fonction pour valider/invalider une propriété
  const handleValidateProperty = async (propertyId: string, isValidated: boolean) => {
    const result = await validateProperty(propertyId, isValidated);
    if (result) {
      // Mettre à jour la liste des propriétés
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId ? { ...prop, is_validated: isValidated } : prop
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Propriétés</h1>
      
      <ApiErrorHandler error={error || validateError} loading={loading} />
      
      {/* Afficher les propriétés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm">
            {property.image_url && (
              <img 
                src={property.image_url} 
                alt={property.name} 
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h3 className="font-semibold text-lg">{property.name}</h3>
              <p className="text-gray-600">{property.location}</p>
              
              <div className="mt-2">
                <span className="text-sm bg-gray-100 rounded px-2 py-1 mr-2">
                  {property.property_type}
                </span>
                <span className="text-sm bg-blue-100 rounded px-2 py-1">
                  {property.token_price} ETH/token
                </span>
              </div>
              
              <p className="mt-2 text-sm line-clamp-2">{property.description}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="font-medium">
                  {property.total_price} ETH
                </span>
                <span className="text-sm text-green-600">
                  {property.annual_yield}% rendement
                </span>
              </div>
              
              {/* Actions pour admin/manager */}
              {(userRole === 'admin' || userRole === 'manager') && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {property.is_validated ? (
                        <span className="text-green-600">Validée</span>
                      ) : (
                        <span className="text-red-600">Non validée</span>
                      )}
                    </span>
                    
                    {userRole === 'admin' && (
                      <button
                        onClick={() => handleValidateProperty(property.id!, !property.is_validated)}
                        disabled={validateLoading}
                        className={`px-3 py-1 text-sm rounded ${
                          property.is_validated
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {validateLoading ? '...' : property.is_validated ? 'Invalider' : 'Valider'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {properties.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Aucune propriété disponible
          </div>
        )}
      </div>
      
      {/* Bouton pour ajouter une propriété (admin/manager) */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Ajouter une propriété
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage; 