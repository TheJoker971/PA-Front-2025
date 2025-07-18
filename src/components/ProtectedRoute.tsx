import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApi } from '../context/ApiContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { isAuthenticated, isLoading, userRole } = useApi();
  const location = useLocation();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si l'authentification est requise et que l'utilisateur n'est pas authentifié,
  // rediriger vers la page de connexion
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si des rôles spécifiques sont requis et que l'utilisateur n'a pas le bon rôle,
  // rediriger vers une page d'accès refusé
  if (
    allowedRoles.length > 0 &&
    (!userRole || !allowedRoles.includes(userRole))
  ) {
    return <Navigate to="/access-denied" replace />;
  }

  // Si toutes les conditions sont remplies, afficher le contenu de la route
  return <>{children}</>;
};

export default ProtectedRoute; 