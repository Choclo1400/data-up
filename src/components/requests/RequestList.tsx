
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TechnicalRequest } from '@/types/requests';
import RequestCard from './RequestCard';

interface RequestListProps {
  requests: TechnicalRequest[];
  showActions?: boolean;
  onApprove?: (requestId: string, comments?: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onView?: (request: TechnicalRequest) => void;
  onViewHistory?: (request: TechnicalRequest) => void;
  onRate?: (request: TechnicalRequest) => void;
  loading?: boolean;
  actionLabel?: string;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  showActions = false,
  onApprove,
  onReject,
  onView,
  onViewHistory,
  onRate,
  loading = false,
  actionLabel = "Aprobar"
}) => {
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
        <RequestCard
          key={request.id}
          request={request}
          showActions={showActions}
          onApprove={onApprove}
          onReject={onReject}
          onView={onView}
          onViewHistory={onViewHistory}
          onRate={onRate}
          loading={loading}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
};

export default RequestList;
