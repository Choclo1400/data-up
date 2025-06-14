
export enum AuditEventType {
  LOGIN = "login",
  LOGOUT = "logout",
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DELETED = "user_deleted",
  ROLE_CHANGED = "role_changed",
  PERMISSION_CHANGED = "permission_changed",
  REQUEST_CREATED = "request_created",
  REQUEST_APPROVED = "request_approved",
  REQUEST_REJECTED = "request_rejected",
  CLIENT_CREATED = "client_created",
  CLIENT_UPDATED = "client_updated",
  CLIENT_DELETED = "client_deleted",
  SYSTEM_ERROR = "system_error",
  BACKUP_CREATED = "backup_created",
  BACKUP_FAILED = "backup_failed",
  CONFIG_CHANGED = "config_changed"
}

export enum AuditSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  severity: AuditSeverity;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  entityType?: string;
  entityId?: string;
  changes?: Record<string, { old: any; new: any }>;
}

export interface AuditFilters {
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  eventType?: AuditEventType;
  severity?: AuditSeverity;
  searchTerm?: string;
}
