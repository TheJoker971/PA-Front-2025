import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoleAccess, UserRole, RolePermissions } from '../../hooks/useRoleAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermission?: keyof RolePermissions;
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

const UnauthorizedMessage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Accès refusé
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  </div>
);

const LoginPrompt: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-blue-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Connexion requise
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Vous devez vous connecter pour accéder à cette page.
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Aller à l'accueil
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermission,
  fallbackPath = '/',
  showUnauthorized = true,
}) => {
  const location = useLocation();
  const { isAuthenticated, hasRole, hasAnyRole, hasPermission } = useRoleAccess();

  // Si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    if (showUnauthorized) {
      return <LoginPrompt />;
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Vérifier les rôles requis
  if (requiredRoles) {
    const hasRequiredRole = Array.isArray(requiredRoles) 
      ? hasAnyRole(requiredRoles)
      : hasRole(requiredRoles);
    
    if (!hasRequiredRole) {
      if (showUnauthorized) {
        return <UnauthorizedMessage />;
      }
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
  }

  // Vérifier les permissions spécifiques
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (showUnauthorized) {
      return <UnauthorizedMessage />;
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Si toutes les vérifications passent, rendre les enfants
  return <>{children}</>;
};

export default ProtectedRoute; 