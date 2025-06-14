
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/common/Badge";
import { TechnicalRequest, RequestStatus, Priority } from '@/types/requests';
import { MapPin, Clock, User, CheckCircle, XCircle, Eye, Star } from 'lucide-react';

interface RequestListProps {
  requests: TechnicalRequest[];
  showActions?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onView?: (request: TechnicalRequest) => void;
  onRate?: (request: TechnicalRequest) => void;
  loading?: boolean;
  actionLabel?: string;
}

const getStatusBadgeVariant = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.NEW: return 'info';
    case RequestStatus.VALIDATING: return 'warning';
    case RequestStatus.PENDING_MANAGER: return 'warning';
    case RequestStatus.PENDING_SUPERVISOR: return 'warning';
    case RequestStatus.ASSIGNED: return 'info';
    case RequestStatus.IN_PROGRESS: return 'success';
    case RequestStatus.COMPLETED: return 'success';
    case RequestStatus.APPROVED: return 'success';
    case RequestStatus.REJECTED: return 'danger';
    case RequestStatus.CLOSED: return 'neutral';
    case RequestStatus.CANCELLED: return 'danger';
    default: return 'neutral';
  }
};

const getPriorityBadgeVariant = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW: return 'neutral';
    case Priority.MEDIUM: return 'info';
    case Priority.HIGH: return 'warning';
    case Priority.CRITICAL: return 'danger';
    default: return 'neutral';
  }
};

const RequestList: React.FC<RequestListProps> = ({
  requests,
  showActions = false,
  onApprove,
  onReject,
  onView,
  onRate,
  loading = false,
  actionLabel = "Aprobar"
}) => {
  const handleReject = (requestId: string) => {
    const reason = prompt('Ingrese el motivo del rechazo:');
    if (reason && onReject) {
      onReject(requestId, reason);
    }
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No hay solicitudes pendientes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{request.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {request.requestNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getStatusBadgeVariant(request.status)}>
                  {request.status}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(request.priority)}>
                  {request.priority}
                </Badge>
                {request.hasRating && (
                  <div className="flex items-center text-green-600" title="Servicio calificado">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {request.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Cliente:</span>
                  <span>{request.clientName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Ubicación:</span>
                  <span>{request.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Fecha solicitada:</span>
                  <span>{new Date(request.requestedDate).toLocaleDateString('es-CL')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Horas estimadas:</span>
                  <span>{request.estimatedHours}h</span>
                </div>
              </div>

              {request.equipmentRequired.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Equipos requeridos:</p>
                  <div className="flex flex-wrap gap-1">
                    {request.equipmentRequired.map((equipment, index) => (
                      <Badge key={index} variant="neutral" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {showActions && (
                <div className="flex justify-end gap-2 pt-2 border-t">
                  {onView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(request)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                  )}
                  
                  {(request.status === RequestStatus.COMPLETED || request.status === RequestStatus.APPROVED) && 
                   !request.hasRating && onRate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRate(request)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Calificar
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(request.id)}
                    disabled={loading}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Rechazar
                  </Button>

                  {onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(request.id)}
                      disabled={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {actionLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RequestList;
