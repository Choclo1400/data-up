import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  PRIORITY_CONFIG, 
  STATUS_CONFIG, 
  ROLE_CONFIG,
  type RequestPriority,
  type RequestStatus,
  type UserRole
} from '@/lib/constants';

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = React.memo(({ priority, className }) => {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
});

PriorityBadge.displayName = 'PriorityBadge';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ status, className }) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = React.memo(({ role, className }) => {
  const config = ROLE_CONFIG[role];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
});

RoleBadge.displayName = 'RoleBadge';