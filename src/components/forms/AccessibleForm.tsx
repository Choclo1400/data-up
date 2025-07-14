import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedSelect, EnhancedSelectItem } from '@/components/ui/enhanced-select';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ 
  id, 
  label, 
  required, 
  error, 
  description, 
  children, 
  className 
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
      >
        {label}
      </Label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': ariaDescribedBy,
          'aria-invalid': !!error,
          'aria-required': required,
        })}
      </div>
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ className, error, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow form submission on Enter key
      if (event.key === 'Enter' && !event.shiftKey) {
        const form = event.currentTarget.closest('form');
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      }
      
      onKeyDown?.(event);
    };

    return (
      <Input
        ref={ref}
        className={cn(
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ className, error, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Allow form submission on Ctrl+Enter
      if (event.key === 'Enter' && event.ctrlKey) {
        const form = event.currentTarget.closest('form');
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
        }
      }
      
      onKeyDown?.(event);
    };

    return (
      <Textarea
        ref={ref}
        className={cn(
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex gap-3 pt-4', className)}>
      {children}
    </div>
  );
}