import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { roleService } from '../services/api';

interface UserWithRole {
  id: string;
  signature: string;
  name?: string;
  role: string;
  created_at: string;
}

interface PropertyPermission {
  id: string;
  user_signature: string;
  property_id: string;
  role_type: string;
  granted_by: string;
  granted_at?: string;
  is_active?: boolean;
}

interface UserWithPermissions {
  id: string;
  signature: string;
  name?: string;
  role: string;
  created_at: string;
  permissions: PropertyPermission[];
}

export const useUsersWithPermissions = () => {
  const { address, isConnected } = useAccount();
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!isConnected || !address) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await roleService.getUsersWithPermissions(address);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError('Erreur lors de la récupération des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isConnected, address]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}; 