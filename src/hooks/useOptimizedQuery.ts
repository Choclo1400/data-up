import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';
import { logger } from '@/lib/logger';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  logQueries?: boolean;
}

export const useOptimizedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
): UseQueryResult<T> => {
  const { handleError } = useErrorHandler();
  const { logQueries = false, ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (logQueries) {
        logger.debug(`Executing query: ${queryKey.join('.')}`);
      }
      
      try {
        const result = await queryFn();
        
        if (logQueries) {
          logger.debug(`Query successful: ${queryKey.join('.')}`, {
            dataLength: Array.isArray(result) ? result.length : 1
          });
        }
        
        return result;
      } catch (error) {
        handleError(error, `Error en consulta: ${queryKey.join('.')}`, {
          logError: true,
          showToast: false
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('auth')) {
        return false;
      }
      return failureCount < 3;
    },
    ...queryOptions
  });
};