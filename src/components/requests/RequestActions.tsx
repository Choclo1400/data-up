
import React from 'react';
import { Button } from "@/components/ui/button";
import { TechnicalRequest, RequestStatus } from '@/types/requests';
import { Eye, CheckCircle, XCircle, Star } from 'lucide-react';

interface RequestActionsProps {
  request: TechnicalRequest;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onView?: (request: TechnicalRequest) => void;
  onRate?: (request: TechnicalRequest) => void;
  loading?: boolean;
  actionLabel?: string;
}

const RequestActions: React.FC<RequestActionsProps> = ({
  request,
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

  return (
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
  );
};

export default RequestActions;
