import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: Record<string, unknown>;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    message?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      context = {}
    } = options;

    const errorMessage = message || (error instanceof Error ? error.message : 'Ha ocurrido un error inesperado');
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (logError) {
      logger.error(errorMessage, errorObj, context);
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    return errorObj;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, errorMessage, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};