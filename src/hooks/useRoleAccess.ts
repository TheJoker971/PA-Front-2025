import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { ApiUser } from '../types/api';

export type UserRole = 'user' | 'manager' | 'admin';

export interface RolePermissions {
  canAccessAdmin: boolean;
  canAccessOwner: boolean;
  canManageProperties: boolean;
  canManageUsers: boolean;
  canValidateProperties: boolean;
  canAccessDashboard: boolean;
}

export const useRoleAccess = () => {
  const { user, isAuthenticated } = useAuth();

  const permissions = useMemo((): RolePermissions => {
    if (!isAuthenticated || !user) {
      return {
        canAccessAdmin: false,
        canAccessOwner: false,
        canManageProperties: false,
        canManageUsers: false,
        canValidateProperties: false,
        canAccessDashboard: false,
      };
    }

    const role = user.role;

    return {
      canAccessAdmin: role === 'admin',
      canAccessOwner: role === 'manager' || role === 'admin',
      canManageProperties: role === 'manager' || role === 'admin',
      canManageUsers: role === 'admin',
      canValidateProperties: role === 'admin',
      canAccessDashboard: isAuthenticated,
    };
  }, [user, isAuthenticated]);

  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  return {
    user,
    isAuthenticated,
    permissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    userRole: user?.role,
  };
}; 