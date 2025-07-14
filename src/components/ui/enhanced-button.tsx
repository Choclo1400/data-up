import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-pressed'?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    children, 
    disabled, 
    loading = false, 
    loadingText = 'Loading...', 
    onClick,
    onKeyDown,
    ...props 
  }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space keys for button activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!disabled && !loading && onClick) {
          onClick(event as any);
        }
      }
      
      onKeyDown?.(event);
    };

    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        className={cn(
          // Enhanced focus styles
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'focus-visible:outline-none',
          // Loading state styles
          loading && 'cursor-wait opacity-75',
          className
        )}
        disabled={isDisabled}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">{loadingText}</span>
            {loadingText}
          </span>
        ) : (
          children
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';