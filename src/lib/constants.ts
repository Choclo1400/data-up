// Application Constants and Enums
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  TECHNICIAN: 'technician',
  OPERATOR: 'operator'
} as const;

export const CLIENT_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company'
} as const;

export const REQUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const REQUEST_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const;

// Type definitions from constants
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ClientType = typeof CLIENT_TYPES[keyof typeof CLIENT_TYPES];
export type RequestPriority = typeof REQUEST_PRIORITIES[keyof typeof REQUEST_PRIORITIES];
export type RequestStatus = typeof REQUEST_STATUSES[keyof typeof REQUEST_STATUSES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// UI Constants
export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

// API Constants
export const API_ENDPOINTS = {
  USERS: '/users',
  CLIENTS: '/clients',
  REQUESTS: '/service_requests',
  NOTIFICATIONS: '/notifications',
  AUDIT_LOGS: '/audit_logs'
} as const;

// Priority and Status Display Configurations
export const PRIORITY_CONFIG = {
  [REQUEST_PRIORITIES.LOW]: { color: 'bg-green-100 text-green-800', label: 'Baja' },
  [REQUEST_PRIORITIES.MEDIUM]: { color: 'bg-yellow-100 text-yellow-800', label: 'Media' },
  [REQUEST_PRIORITIES.HIGH]: { color: 'bg-orange-100 text-orange-800', label: 'Alta' },
  [REQUEST_PRIORITIES.URGENT]: { color: 'bg-red-100 text-red-800', label: 'Urgente' }
} as const;

export const STATUS_CONFIG = {
  [REQUEST_STATUSES.PENDING]: { color: 'bg-gray-100 text-gray-800', label: 'Pendiente' },
  [REQUEST_STATUSES.APPROVED]: { color: 'bg-blue-100 text-blue-800', label: 'Aprobado' },
  [REQUEST_STATUSES.IN_PROGRESS]: { color: 'bg-yellow-100 text-yellow-800', label: 'En Progreso' },
  [REQUEST_STATUSES.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Completado' },
  [REQUEST_STATUSES.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
} as const;

export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: { color: 'bg-purple-100 text-purple-800', label: 'Administrador' },
  [USER_ROLES.MANAGER]: { color: 'bg-blue-100 text-blue-800', label: 'Gerente' },
  [USER_ROLES.SUPERVISOR]: { color: 'bg-green-100 text-green-800', label: 'Supervisor' },
  [USER_ROLES.TECHNICIAN]: { color: 'bg-orange-100 text-orange-800', label: 'Técnico' },
  [USER_ROLES.OPERATOR]: { color: 'bg-gray-100 text-gray-800', label: 'Operador' }
} as const;