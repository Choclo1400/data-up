
import React from 'react';
import { TechnicalRequest, RequestStatus, Priority } from '@/types';
import Badge from '@/components/common/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: TechnicalRequest;
  onClick: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL:
        return 'danger';
      case Priority.HIGH:
        return 'warning';
      case Priority.MEDIUM:
        return 'info';
      case Priority.LOW:
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED:
        return 'success';
      case RequestStatus.IN_PROGRESS:
        return 'info';
      case RequestStatus.APPROVED:
        return 'success';
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.REJECTED:
      case RequestStatus.CANCELLED:
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    const dueDate = new Date(request.dueDate);
    const now = new Date();
    return dueDate < now && request.status !== RequestStatus.COMPLETED;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        isOverdue() && "border-red-200 bg-red-50/50",
        "slide-enter"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {request.title}
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <Badge variant={getPriorityColor(request.priority)}>
              {request.priority}
            </Badge>
            <Badge variant={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">#{request.id}</span>
          <span>•</span>
          <span>{request.type}</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {request.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="truncate">{request.requestedBy}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="truncate">{request.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span>Creada: {formatDate(request.createdDate)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className={isOverdue() ? "text-red-600 font-medium" : ""}>
              Vence: {formatDate(request.dueDate)}
            </span>
          </div>
        </div>
        
        {isOverdue() && (
          <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Solicitud vencida</span>
          </div>
        )}
        
        {request.assignedTo && (
          <div className="text-xs text-muted-foreground">
            Asignada a: <span className="font-medium">{request.assignedTo}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
