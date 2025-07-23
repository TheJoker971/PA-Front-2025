import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/api-v2';
import { ApiProperty, CreatePropertyRequest, UpdatePropertyStatusRequest, PropertiesPublicResponse } from '../types/api';

interface UsePropertiesReturn {
  properties: ApiProperty[];
  isLoading: boolean;
  error: string | null;
  refreshProperties: () => Promise<void>;
  createProperty: (propertyData: CreatePropertyRequest) => Promise<void>;
  updateProperty: (propertyId: string, propertyData: Partial<CreatePropertyRequest>) => Promise<void>;
  updatePropertyStatus: (propertyId: string, status: UpdatePropertyStatusRequest) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
}

export const useProperties = (isPublic: boolean = false): UsePropertiesReturn => {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isPublic) {
        const response: PropertiesPublicResponse = await propertyService.getPublic();
        setProperties(response.properties);
      } else {
        const propertiesData = await propertyService.getAll();
        setProperties(propertiesData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des propriétés');
    } finally {
      setIsLoading(false);
    }
  }, [isPublic]);

  const createProperty = useCallback(async (propertyData: CreatePropertyRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await propertyService.create(propertyData);
      await fetchProperties(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la propriété');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProperties]);

  const updateProperty = useCallback(async (propertyId: string, propertyData: Partial<CreatePropertyRequest>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await propertyService.update(propertyId, propertyData);
      await fetchProperties(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la propriété');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProperties]);

  const updatePropertyStatus = useCallback(async (propertyId: string, statusData: UpdatePropertyStatusRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await propertyService.updateStatus(propertyId, statusData);
      await fetchProperties(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProperties]);

  const deleteProperty = useCallback(async (propertyId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await propertyService.delete(propertyId);
      await fetchProperties(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la propriété');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProperties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    isLoading,
    error,
    refreshProperties: fetchProperties,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
  };
}; 