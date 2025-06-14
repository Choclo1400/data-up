
import { RequestStatus, RequestPriority } from '@/types/requests';

export const getStatusBadgeVariant = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.PENDING:
      return 'default';
    case RequestStatus.APPROVED:
      return 'secondary';
    case RequestStatus.REJECTED:
      return 'destructive';
    case RequestStatus.IN_PROGRESS:
      return 'default';
    case RequestStatus.COMPLETED:
      return 'secondary';
    default:
      return 'default';
  }
};

export const getPriorityBadgeVariant = (priority: RequestPriority) => {
  switch (priority) {
    case RequestPriority.LOW:
      return 'secondary';
    case RequestPriority.MEDIUM:
      return 'default';
    case RequestPriority.HIGH:
      return 'destructive';
    case RequestPriority.URGENT:
      return 'destructive';
    default:
      return 'default';
  }
};
