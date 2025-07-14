import React, { forwardRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface EnhancedSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const EnhancedSelect = forwardRef<HTMLButtonElement, EnhancedSelectProps>(
  ({ 
    value, 
    onValueChange, 
    placeholder, 
    disabled, 
    children, 
    className,
    ...ariaProps 
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    useKeyboardNavigation(containerRef, {
      orientation: 'vertical',
      enableArrowKeys: true,
      enableHomeEnd: true,
      enableTypeAhead: true,
    });

    return (
      <div ref={containerRef} className={className}>
        <Select 
          value={value} 
          onValueChange={onValueChange} 
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-expanded={false}
            {...ariaProps}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            role="listbox"
          >
            {children}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

EnhancedSelect.displayName = 'EnhancedSelect';

interface EnhancedSelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const EnhancedSelectItem = forwardRef<HTMLDivElement, EnhancedSelectItemProps>(
  ({ value, children, disabled, className }, ref) => {
    // Ensure value is never an empty string
    const safeValue = value || 'undefined';
    
    return (
      <SelectItem
        ref={ref}
        value={safeValue}
        disabled={disabled}
        className={`
          focus-visible:bg-blue-50 focus-visible:text-blue-900
          focus-visible:outline-none
          ${className || ''}
        `}
        role="option"
        aria-selected={false}
      >
        {children}
      </SelectItem>
    );
  }
);

EnhancedSelectItem.displayName = 'EnhancedSelectItem';