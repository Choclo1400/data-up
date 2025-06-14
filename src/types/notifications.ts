
export enum NotificationType {
  APPROVAL = "approval",
  REJECTION = "rejection",
  ASSIGNMENT = "assignment",
  STATUS_CHANGE = "status_change",
  BACKUP_ALERT = "backup_alert",
  ERROR = "error",
  SYSTEM = "system"
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  requestId?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationGroup {
  type: NotificationType;
  count: number;
  notifications: Notification[];
}
