
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TechnicalRequest, RequestStatus } from '@/types/requests';
import { Eye, CheckCircle, XCircle, Star, History } from 'lucide-react';
import ApprovalModal from './ApprovalModal';
import RejectionModal from './RejectionModal';

interface RequestActionsProps {
  request: TechnicalRequest;
  onApprove?: (requestId: string, comments?: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onView?: (request: TechnicalRequest) => void;
  onViewHistory?: (request: TechnicalRequest) => void;
  onRate?: (request: TechnicalRequest) => void;
  loading?: boolean;
  actionLabel?: string;
}

const RequestActions: React.FC<RequestActionsProps> = ({
  request,
  onApprove,
  onReject,
  onView,
  onViewHistory,
  onRate,
  loading = false,
  actionLabel = "Aprobar"
}) => {
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);

  const handleApprove = (comments: string) => {
    if (onApprove) {
      onApprove(request.id, comments);
    }
    setApprovalModalOpen(false);
  };

  const handleReject = (reason: string) => {
    if (onReject) {
      onReject(request.id, reason);
    }
    setRejectionModalOpen(false);
  };

  return (
    <>
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

        {onViewHistory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewHistory(request)}
            className="text-gray-600 hover:text-gray-700"
          >
            <History className="w-4 h-4 mr-1" />
            Historial
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
          onClick={() => setRejectionModalOpen(true)}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Rechazar
        </Button>

        {onApprove && (
          <Button
            size="sm"
            onClick={() => setApprovalModalOpen(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {actionLabel}
          </Button>
        )}
      </div>

      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onConfirm={handleApprove}
        loading={loading}
        title="Confirmar Aprobación"
        description={`¿Está seguro que desea aprobar la solicitud ${request.requestNumber}?`}
        actionLabel={actionLabel}
      />

      <RejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onConfirm={handleReject}
        loading={loading}
        requestNumber={request.requestNumber}
      />
    </>
  );
};

export default RequestActions;
