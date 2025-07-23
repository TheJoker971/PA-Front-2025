import React from 'react';
import { useRoleAccess, UserRole, RolePermissions } from '../../hooks/useRoleAccess';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermission?: keyof RolePermissions;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Composant pour afficher conditionnellement du contenu selon les rôles/permissions
 * Contrairement à ProtectedRoute, ce composant n'affiche rien si les conditions ne sont pas remplies,
 * au lieu de rediriger ou afficher un message d'erreur.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  requiredPermission,
  fallback = null,
  requireAuth = true,
}) => {
  const { isAuthenticated, hasRole, hasAnyRole, hasPermission } = useRoleAccess();

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Vérifier les rôles requis
  if (requiredRoles) {
    const hasRequiredRole = Array.isArray(requiredRoles) 
      ? hasAnyRole(requiredRoles)
      : hasRole(requiredRoles);
    
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Vérifier les permissions spécifiques
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Si toutes les conditions sont remplies, afficher le contenu
  return <>{children}</>;
};

export default RoleGuard; 