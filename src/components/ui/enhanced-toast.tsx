
import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  type,
  title,
  description,
  duration = 5000,
  onClose,
  className,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-info-600" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 shadow-lg";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-success-50 border-success-500 shadow-glow-success`;
      case 'error':
        return `${baseStyles} bg-error-50 border-error-500 shadow-glow-error`;
      case 'warning':
        return `${baseStyles} bg-warning-50 border-warning-500 shadow-glow-warning`;
      case 'info':
        return `${baseStyles} bg-info-50 border-info-500 shadow-glow-info`;
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success-500';
      case 'error':
        return 'bg-error-500';
      case 'warning':
        return 'bg-warning-500';
      case 'info':
        return 'bg-info-500';
    }
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 w-96 max-w-sm p-4 rounded-lg transition-all duration-300",
      getStyles(),
      isExiting 
        ? "animate-slide-out-right opacity-0 transform translate-x-full" 
        : "animate-slide-in-right",
      className
    )}>
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 rounded-t-lg overflow-hidden">
          <div 
            className={cn("h-full transition-all ease-linear", getProgressColor())}
            style={{ 
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-semibold",
            type === 'success' && "text-success-800",
            type === 'error' && "text-error-800", 
            type === 'warning' && "text-warning-800",
            type === 'info' && "text-info-800"
          )}>
            {title}
          </p>
          {description && (
            <p className={cn(
              "text-sm mt-1",
              type === 'success' && "text-success-700",
              type === 'error' && "text-error-700",
              type === 'warning' && "text-warning-700", 
              type === 'info' && "text-info-700"
            )}>
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "text-sm font-medium mt-2 hover:underline transition-colors",
                type === 'success' && "text-success-700 hover:text-success-800",
                type === 'error' && "text-error-700 hover:text-error-800",
                type === 'warning' && "text-warning-700 hover:text-warning-800",
                type === 'info' && "text-info-700 hover:text-info-800"
              )}
            >
              {action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Hook para gestionar múltiples toasts
export function useEnhancedToast() {
  const [toasts, setToasts] = useState<Array<EnhancedToastProps & { id: string }>>([]);

  const showToast = (toast: Omit<EnhancedToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, description?: string, action?: EnhancedToastProps['action']) => {
    showToast({ type: 'success', title, description, action });
  };

  const error = (title: string, description?: string, action?: EnhancedToastProps['action']) => {
    showToast({ type: 'error', title, description, action });
  };

  const warning = (title: string, description?: string, action?: EnhancedToastProps['action']) => {
    showToast({ type: 'warning', title, description, action });
  };

  const info = (title: string, description?: string, action?: EnhancedToastProps['action']) => {
    showToast({ type: 'info', title, description, action });
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <EnhancedToast {...toast} />
        </div>
      ))}
    </div>
  );

  return {
    success,
    error, 
    warning,
    info,
    ToastContainer
  };
}

// CSS para la animación de progress bar
const styles = `
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
