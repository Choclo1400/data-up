import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface UseFormHandlerOptions<T> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useFormHandler = <T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  options: UseFormHandlerOptions<T> = {}
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (
    submitFn: (data: T) => Promise<void> | void,
    data: T
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await submitFn(data);
      
      if (options.onSuccess) {
        await options.onSuccess(data);
      }
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      form.reset();
      
      logger.info('Form submitted successfully', { formData: data });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      logger.error('Form submission failed', errorObj, { formData: data });
      
      if (options.onError) {
        options.onError(errorObj);
      } else {
        toast.error(options.errorMessage || 'Error al enviar el formulario');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, options]);

  const resetForm = useCallback(() => {
    form.reset();
    setIsSubmitting(false);
  }, [form]);

  return {
    isSubmitting,
    handleSubmit,
    resetForm
  };
};