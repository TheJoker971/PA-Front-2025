import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

/**
 * Hook personnalisé pour faciliter l'utilisation des services API
 * @param serviceFunction - La fonction de service API à appeler
 * @returns Un objet contenant les données, l'état de chargement, l'erreur et une fonction pour exécuter la requête
 */
export function useApiService<T, P extends any[]>(
  serviceFunction: (...args: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | AxiosError | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        const result = await serviceFunction(...args);
        
        setData(result);
        setSuccess(true);
        return result;
      } catch (err) {
        const error = err as Error | AxiosError;
        setError(error);
        setSuccess(false);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [serviceFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    data,
    loading,
    error,
    success,
    execute,
    reset,
  };
}

export default useApiService; 