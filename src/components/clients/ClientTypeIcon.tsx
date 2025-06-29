import React from 'react';
import { Building2, Zap, Power, Cpu, Factory } from 'lucide-react';
import { ClientType } from '@/types/requests';
import { cn } from '@/lib/utils';

interface ClientTypeIconProps {
  type: ClientType;
  className?: string;
}

export const ClientTypeIcon: React.FC<ClientTypeIconProps> = ({ type, className }) => {
  const getIcon = () => {
    switch (type) {
      case ClientType.ENEL:
        return <Zap className={cn("w-4 h-4", className)} />;
      case ClientType.CGE:
        return <Power className={cn("w-4 h-4", className)} />;
      case ClientType.SAESA:
        return <Cpu className={cn("w-4 h-4", className)} />;
      case ClientType.FRONTEL:
        return <Factory className={cn("w-4 h-4", className)} />;
      default:
        return <Building2 className={cn("w-4 h-4", className)} />;
    }
  };

  return getIcon();
};

export default ClientTypeIcon;