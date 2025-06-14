
import React from 'react';
import { AlertTriangle, RefreshCw, Shield, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  type?: 'network' | 'permission' | 'generic' | 'not-found';
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  description,
  onRetry,
  className
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          defaultTitle: 'Error de conexión',
          defaultDescription: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
          variant: 'destructive' as const
        };
      case 'permission':
        return {
          icon: Shield,
          defaultTitle: 'Acceso denegado',
          defaultDescription: 'No tienes permisos para acceder a esta sección.',
          variant: 'destructive' as const
        };
      case 'not-found':
        return {
          icon: AlertTriangle,
          defaultTitle: 'No encontrado',
          defaultDescription: 'El recurso que buscas no existe o ha sido eliminado.',
          variant: 'default' as const
        };
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: 'Error al cargar',
          defaultDescription: 'Ha ocurrido un error inesperado. Intenta nuevamente.',
          variant: 'destructive' as const
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <Alert variant={config.variant} className="max-w-md">
        <Icon className="h-4 w-4" />
        <AlertTitle>{title || config.defaultTitle}</AlertTitle>
        <AlertDescription className="mt-2">
          {description || config.defaultDescription}
          {onRetry && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
