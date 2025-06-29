// Tipos principales del sistema
export interface User {
  id: string;
  email: string;
  password_hash?: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator';
  is_active?: boolean;
  two_factor_secret?: string;
  two_factor_enabled?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'individual' | 'company';
  contact_person?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRequest {
  id: string;
  client_id?: string;
  service_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  assigned_technician_id?: string;
  approved_by_id?: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  materials?: any[];
  notes?: string;
  attachments?: any[];
  created_at?: string;
  updated_at?: string;
  client?: Client;
  assigned_technician?: User;
  approved_by?: User;
}

// Importamos y reexportamos los tipos de solicitudes técnicas
export * from './requests';
export * from './notifications';
export * from './audit';

// Maintenance Types (mantenemos para compatibilidad)
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceRequest {
  id: string;
  equipment_id: string;
  type: MaintenanceType;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assigned_technician_id?: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  materials?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface UserForm {
  name: string;
  email: string;
  role: User['role'];
  password?: string;
}

export interface ClientForm {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: Client['type'];
  contact_person?: string;
}

export interface RequestForm {
  client_id: string;
  service_type: string;
  description: string;
  priority: ServiceRequest['priority'];
  estimated_cost?: number;
  materials?: string[];
  notes?: string;
}

// Filter Types
export interface UserFilters {
  role?: User['role'];
  is_active?: boolean;
  search?: string;
}

export interface ClientFilters {
  type?: Client['type'];
  is_active?: boolean;
  search?: string;
}

export interface RequestFilters {
  status?: ServiceRequest['status'];
  priority?: ServiceRequest['priority'];
  assigned_technician_id?: string;
  client_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Dashboard Types
export interface DashboardStats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  total_clients: number;
  active_technicians: number;
  revenue_this_month: number;
  average_completion_time: number;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// Settings Types
export interface SystemSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  default_service_types: string[];
  notification_settings: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };
  maintenance_settings: {
    default_reminder_days: number;
    auto_assign_technicians: boolean;
    require_approval_for_high_priority: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Permission Types
export type Permission = 
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'clients.read'
  | 'clients.write'
  | 'clients.delete'
  | 'requests.read'
  | 'requests.write'
  | 'requests.delete'
  | 'requests.approve'
  | 'reports.read'
  | 'settings.read'
  | 'settings.write'
  | 'audit.read';

export interface RolePermissions {
  [key: string]: Permission[];
}