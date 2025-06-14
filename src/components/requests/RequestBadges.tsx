
import { RequestStatus, Priority } from '@/types/requests';

export const getStatusBadgeVariant = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.NEW:
      return 'info';
    case RequestStatus.VALIDATING:
      return 'warning';
    case RequestStatus.PENDING_MANAGER:
      return 'warning';
    case RequestStatus.PENDING_SUPERVISOR:
      return 'warning';
    case RequestStatus.ASSIGNED:
      return 'info';
    case RequestStatus.IN_PROGRESS:
      return 'info';
    case RequestStatus.COMPLETED:
      return 'success';
    case RequestStatus.APPROVED:
      return 'success';
    case RequestStatus.REJECTED:
      return 'danger';
    case RequestStatus.CLOSED:
      return 'neutral';
    case RequestStatus.CANCELLED:
      return 'danger';
    default:
      return 'default';
  }
};

export const getPriorityBadgeVariant = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW:
      return 'neutral';
    case Priority.MEDIUM:
      return 'default';
    case Priority.HIGH:
      return 'warning';
    case Priority.CRITICAL:
      return 'danger';
    default:
      return 'default';
  }
};
