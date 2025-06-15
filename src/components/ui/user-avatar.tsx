
import React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  email?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  fallbackColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  src,
  size = 'md',
  className,
  showStatus = false,
  status = 'offline',
  fallbackColor
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500'
  };

  // Generar iniciales
  const getInitials = () => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Generar color de fondo basado en el nombre
  const getBackgroundColor = () => {
    if (fallbackColor) return fallbackColor;
    
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
      'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
      'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
      'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500'
    ];
    
    const text = name || email || 'user';
    const hash = text.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(
        "rounded-full flex items-center justify-center font-medium text-white transition-all duration-200 hover:scale-105",
        sizeClasses[size],
        !src && getBackgroundColor()
      )}>
        {src ? (
          <img
            src={src}
            alt={name || email || 'Usuario'}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              // Si la imagen falla, mostrar las iniciales
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials()}</span>
        )}
        
        {!src && (
          <User className="w-1/2 h-1/2 opacity-80" />
        )}
      </div>
      
      {showStatus && (
        <div className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-white",
          statusSizes[size],
          statusColors[status]
        )} />
      )}
    </div>
  );
};

// Componente para mostrar avatar con información adicional
export const UserAvatarWithInfo: React.FC<UserAvatarProps & {
  showName?: boolean;
  showEmail?: boolean;
  layout?: 'horizontal' | 'vertical';
}> = ({
  showName = true,
  showEmail = true,
  layout = 'horizontal',
  ...avatarProps
}) => {
  if (layout === 'vertical') {
    return (
      <div className="flex flex-col items-center space-y-2">
        <UserAvatar {...avatarProps} />
        {showName && avatarProps.name && (
          <p className="text-sm font-medium text-center">{avatarProps.name}</p>
        )}
        {showEmail && avatarProps.email && (
          <p className="text-xs text-muted-foreground text-center">{avatarProps.email}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <UserAvatar {...avatarProps} />
      <div className="min-w-0 flex-1">
        {showName && avatarProps.name && (
          <p className="text-sm font-medium truncate">{avatarProps.name}</p>
        )}
        {showEmail && avatarProps.email && (
          <p className="text-xs text-muted-foreground truncate">{avatarProps.email}</p>
        )}
      </div>
    </div>
  );
};
