import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { roleService } from '../services/api';

export type UserRole = 'admin' | 'manager' | 'investor' | null;

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

interface ConnectResponse {
  user: UserWithRole | null;
  role: string;
  permissions: PropertyPermission[];
}

export const useUserRole = () => {
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [permissions, setPermissions] = useState<PropertyPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectUserRole = async () => {
      if (!isConnected || !address) {
        setRole(null);
        setUser(null);
        setPermissions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: ConnectResponse = await roleService.connectUser(address);
        
        setRole(response.role as UserRole);
        setUser(response.user);
        setPermissions(response.permissions);
      } catch (err) {
        console.error('Erreur lors de la détection du rôle:', err);
        setError('Erreur lors de la détection du rôle');
        // Par défaut, on considère l'utilisateur comme un investisseur
        setRole('investor');
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    detectUserRole();
  }, [isConnected, address]);

  return {
    role,
    user,
    permissions,
    loading,
    error,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isInvestor: role === 'investor',
  };
}; 