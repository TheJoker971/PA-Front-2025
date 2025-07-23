import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/api-v2';
import { ApiUser, CreateUserRequest, UpdateUserRoleRequest } from '../types/api';

interface UseUsersReturn {
  users: ApiUser[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUserRole: (userId: string, roleData: UpdateUserRoleRequest) => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.create(userData);
      await fetchUsers(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId: string, roleData: UpdateUserRoleRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await userService.updateRole(userId, roleData);
      await fetchUsers(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du rôle utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refreshUsers: fetchUsers,
    createUser,
    updateUserRole,
  };
}; 