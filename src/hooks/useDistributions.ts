import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { distributionService } from '../services/api';

interface Distribution {
  id: string;
  property_id: string;
  property_name: string;
  amount: string;
  period: string;
  distributed_by: string;
  distributed_at: string;
  transaction_hash?: string;
  status: string;
}

interface DistributionStats {
  total_distributed: string;
  this_quarter: string;
  active_properties: string;
  total_distributions: string;
}

export const useDistributions = () => {
  const { address, isConnected } = useAccount();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [stats, setStats] = useState<DistributionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistributions = async () => {
    if (!isConnected || !address) {
      setDistributions([]);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [distributionsResponse, statsResponse] = await Promise.all([
        distributionService.getDistributions(address),
        distributionService.getDistributionStats(address)
      ]);
      
      setDistributions(distributionsResponse.distributions || []);
      setStats(statsResponse);
    } catch (err) {
      console.error('Erreur lors de la récupération des distributions:', err);
      setError('Erreur lors de la récupération des distributions');
      setDistributions([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const createDistribution = async (payload: {
    property_id: string;
    property_name: string;
    amount: string;
    period: string;
    transaction_hash?: string;
  }) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await distributionService.createDistribution(address, {
        ...payload,
        distributed_by: address
      });
      
      // Rafraîchir les données
      await fetchDistributions();
      
      return response;
    } catch (err) {
      console.error('Erreur lors de la création de la distribution:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, [isConnected, address]);

  return {
    distributions,
    stats,
    loading,
    error,
    refetch: fetchDistributions,
    createDistribution,
  };
}; 