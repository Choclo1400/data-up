
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/common/Badge";
import { TechnicalRequest } from '@/types/requests';
import { MapPin, Clock, User, Star } from 'lucide-react';
import { getStatusBadgeVariant, getPriorityBadgeVariant } from './RequestBadges';
import RequestActions from './RequestActions';

interface RequestCardProps {
  request: TechnicalRequest;
  showActions?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onView?: (request: TechnicalRequest) => void;
  onRate?: (request: TechnicalRequest) => void;
  loading?: boolean;
  actionLabel?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  showActions = false,
  onApprove,
  onReject,
  onView,
  onRate,
  loading = false,
  actionLabel = "Aprobar"
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
            <RequestActions
              request={request}
              onApprove={onApprove}
              onReject={onReject}
              onView={onView}
              onRate={onRate}
              loading={loading}
              actionLabel={actionLabel}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
