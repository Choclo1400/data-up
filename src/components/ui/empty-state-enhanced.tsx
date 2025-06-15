
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  FileX, 
  Users, 
  Search, 
  Plus, 
  Database, 
  AlertCircle,
  FolderOpen,
  Inbox,
  Settings
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  illustration?: 'search' | 'data' | 'users' | 'settings' | 'inbox' | 'files';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyStateEnhanced: React.FC<EmptyStateProps> = ({
  icon: IconComponent,
  title,
  description,
  action,
  illustration,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      button: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      button: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'text-lg'
    }
  };

  // Seleccionar icono basado en ilustración
  const getIllustrationIcon = () => {
    switch (illustration) {
      case 'search':
        return Search;
      case 'data':
        return Database;
      case 'users':
        return Users;
      case 'settings':
        return Settings;
      case 'inbox':
        return Inbox;
      case 'files':
        return FolderOpen;
      default:
        return FileX;
    }
  };

  const Icon = IconComponent || getIllustrationIcon();

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center animate-fade-in",
      sizeClasses[size].container,
      className
    )}>
      {/* Contenedor del ícono con efectos */}
      <div className="relative mb-6">
        {/* Círculo de fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full animate-pulse-slow" 
             style={{ padding: '1rem' }} />
        
        {/* Círculo secundario */}
        <div className="absolute inset-2 bg-primary/5 rounded-full animate-pulse" 
             style={{ animationDelay: '1s' }} />
        
        {/* Ícono principal */}
        <div className={cn(
          "relative z-10 mx-auto bg-background border-2 border-muted rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-lg",
          "flex items-center justify-center"
        )}>
          <Icon className={cn(
            "text-muted-foreground transition-colors duration-300 hover:text-primary",
            sizeClasses[size].icon
          )} />
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-md space-y-3">
        <h3 className={cn(
          "font-semibold text-foreground",
          sizeClasses[size].title
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-muted-foreground leading-relaxed",
          sizeClasses[size].description
        )}>
          {description}
        </p>
      </div>

      {/* Acción */}
      {action && (
        <div className="mt-6">
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className={cn(
              "transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg",
              sizeClasses[size].button
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        </div>
      )}

      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary/20 rounded-full animate-bounce" 
           style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-20 right-10 w-1 h-1 bg-primary/30 rounded-full animate-bounce" 
           style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-10 left-1/4 w-1.5 h-1.5 bg-primary/25 rounded-full animate-bounce" 
           style={{ animationDelay: '2s' }} />
    </div>
  );
};

// Componentes específicos para diferentes contextos
export const NoDataState: React.FC<Omit<EmptyStateProps, 'illustration'>> = (props) => (
  <EmptyStateEnhanced {...props} illustration="data" />
);

export const NoUsersState: React.FC<Omit<EmptyStateProps, 'illustration'>> = (props) => (
  <EmptyStateEnhanced {...props} illustration="users" />
);

export const NoSearchResultsState: React.FC<Omit<EmptyStateProps, 'illustration'>> = (props) => (
  <EmptyStateEnhanced {...props} illustration="search" />
);

export const NoNotificationsState: React.FC<Omit<EmptyStateProps, 'illustration'>> = (props) => (
  <EmptyStateEnhanced {...props} illustration="inbox" />
);

export const NoFilesState: React.FC<Omit<EmptyStateProps, 'illustration'>> = (props) => (
  <EmptyStateEnhanced {...props} illustration="files" />
);
