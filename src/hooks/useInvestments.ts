import { useState, useEffect, useCallback } from 'react';
import { investmentService } from '../services/api-v2';
import { ApiInvestment, CreateInvestmentRequest, UpdateInvestmentRequest, InvestmentsResponse } from '../types/api';

interface UseInvestmentsReturn {
  investments: ApiInvestment[];
  isLoading: boolean;
  error: string | null;
  count: number;
  refreshInvestments: () => Promise<void>;
  createInvestment: (investmentData: CreateInvestmentRequest) => Promise<void>;
  updateInvestment: (investmentId: string, investmentData: UpdateInvestmentRequest) => Promise<void>;
  deleteInvestment: (investmentId: string) => Promise<void>;
  getInvestmentById: (investmentId: string) => Promise<ApiInvestment>;
}

export const useInvestments = (): UseInvestmentsReturn => {
  const [investments, setInvestments] = useState<ApiInvestment[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: InvestmentsResponse = await investmentService.getAll();
      setInvestments(response.investments);
      setCount(response.count);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des investissements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInvestment = useCallback(async (investmentData: CreateInvestmentRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await investmentService.create(investmentData);
      await fetchInvestments(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'investissement');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInvestments]);

  const updateInvestment = useCallback(async (investmentId: string, investmentData: UpdateInvestmentRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await investmentService.update(investmentId, investmentData);
      await fetchInvestments(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'investissement');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInvestments]);

  const deleteInvestment = useCallback(async (investmentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await investmentService.delete(investmentId);
      await fetchInvestments(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression de l\'investissement');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInvestments]);

  const getInvestmentById = useCallback(async (investmentId: string): Promise<ApiInvestment> => {
    setError(null);
    
    try {
      return await investmentService.getById(investmentId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'investissement');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return {
    investments,
    isLoading,
    error,
    count,
    refreshInvestments: fetchInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentById,
  };
}; 