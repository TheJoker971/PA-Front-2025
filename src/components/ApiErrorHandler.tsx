import React from 'react';
import { AxiosError } from 'axios';

interface ApiErrorHandlerProps {
  error: Error | AxiosError | null;
  loading?: boolean;
  success?: boolean;
  successMessage?: string;
  className?: string;
}

const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({
  error,
  loading = false,
  success = false,
  successMessage = 'Opération réussie',
  className = '',
}) => {
  // Si aucun état à afficher, ne rien rendre
  if (!error && !loading && !success) {
    return null;
  }

  // Déterminer le message d'erreur à afficher
  let errorMessage = '';
  let statusCode = 0;

  if (error) {
    if ('isAxiosError' in error && error.isAxiosError) {
      const axiosError = error as AxiosError;
      
      // Récupérer le code de statut
      statusCode = axiosError.response?.status || 0;
      
      // Récupérer le message d'erreur de la réponse API si disponible
      if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
        const data = axiosError.response.data as any;
        errorMessage = data.message || data.error || axiosError.message;
      } else {
        errorMessage = axiosError.message;
      }
      
      // Messages personnalisés pour les codes d'erreur courants
      if (statusCode === 401) {
        errorMessage = 'Vous devez être connecté pour effectuer cette action.';
      } else if (statusCode === 403) {
        errorMessage = 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
      } else if (statusCode === 404) {
        errorMessage = 'La ressource demandée n\'existe pas.';
      } else if (statusCode >= 500) {
        errorMessage = 'Une erreur serveur s\'est produite. Veuillez réessayer plus tard.';
      }
    } else {
      // Erreur standard non-Axios
      errorMessage = error.message;
    }
  }

  // Déterminer la classe CSS en fonction du type de message
  let alertClass = 'p-4 mb-4 rounded-md ';
  
  if (loading) {
    alertClass += 'bg-blue-50 text-blue-800 border border-blue-300';
  } else if (error) {
    alertClass += 'bg-red-50 text-red-800 border border-red-300';
  } else if (success) {
    alertClass += 'bg-green-50 text-green-800 border border-green-300';
  }

  return (
    <div className={`${alertClass} ${className}`}>
      {loading && (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Chargement en cours...</span>
        </div>
      )}
      
      {!loading && error && (
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Erreur{statusCode ? ` (${statusCode})` : ''}</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      
      {!loading && success && (
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ApiErrorHandler; 