import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { 
  USER_ROLES, 
  CLIENT_TYPES, 
  REQUEST_PRIORITIES, 
  REQUEST_STATUSES,
  type UserRole,
  type ClientType,
  type RequestPriority,
  type RequestStatus
} from '@/lib/constants';

// Enhanced error handling wrapper
const withErrorHandling = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  context: string
): Promise<T> => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      logger.error(`Supabase operation failed: ${context}`, error, { context });
      throw new Error(error.message || `Error en ${context}`);
    }
    
    if (!data) {
      const message = `No data returned from ${context}`;
      logger.warn(message, { context });
      throw new Error(message);
    }
    
    logger.debug(`Supabase operation successful: ${context}`, { context, dataLength: Array.isArray(data) ? data.length : 1 });
    return data;
  } catch (error) {
    logger.error(`Supabase service error: ${context}`, error instanceof Error ? error : new Error(String(error)), { context });
    throw error;
  }
};

// User Management
export const userService = {
  async getUsers() {
    return withErrorHandling(
      () => supabase
        .from('users')
        .select('id, email, name, role, is_active, last_login, created_at, updated_at')
        .order('created_at', { ascending: false }),
      'fetching users'
    );
  },

  async getUserById(id: string) {
    return withErrorHandling(
      () => supabase
        .from('users')
        .select('id, email, name, role, is_active, two_factor_enabled, last_login, created_at, updated_at')
        .eq('id', id)
        .single(),
      `fetching user ${id}`
    );
  },

  async createUser(userData: {
    email: string;
    password_hash: string;
    name: string;
    role: UserRole;
  }) {
    return withErrorHandling(
      () => supabase
        .from('users')
        .insert([userData])
        .select('id, email, name, role, is_active, created_at')
        .single(),
      'creating user'
    );
  },

  async updateUser(id: string, updates: Partial<{
    name: string;
    role: UserRole;
    is_active: boolean;
  }>) {
    return withErrorHandling(
      () => supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, email, name, role, is_active, updated_at')
        .single(),
      `updating user ${id}`
    );
  },

  async deleteUser(id: string) {
    return withErrorHandling(
      () => supabase
        .from('users')
        .delete()
        .eq('id', id),
      `deleting user ${id}`
    );
  },

  async getUsersByRole(role: UserRole) {
    return withErrorHandling(
      () => supabase
        .from('users')
        .select('id, name, email, role')
        .eq('role', role)
        .eq('is_active', true)
        .order('name'),
      `fetching users by role ${role}`
    );
  }
};

// Client Management
export const clientService = {
  async getClients() {
    return withErrorHandling(
      () => supabase
        .from('clients')
        .select('id, name, email, phone, address, type, contact_person, is_active, created_at, updated_at')
        .order('created_at', { ascending: false }),
      'fetching clients'
    );
  },

  async getClientById(id: string) {
    return withErrorHandling(
      () => supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single(),
      `fetching client ${id}`
    );
  },

  async createClient(clientData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    type: ClientType;
    contact_person?: string;
  }) {
    return withErrorHandling(
      () => supabase
        .from('clients')
        .insert([clientData])
        .select('*')
        .single(),
      'creating client'
    );
  },

  async updateClient(id: string, updates: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    type: ClientType;
    contact_person: string;
    is_active: boolean;
  }>) {
    return withErrorHandling(
      () => supabase
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single(),
      `updating client ${id}`
    );
  },

  async deleteClient(id: string) {
    return withErrorHandling(
      () => supabase
        .from('clients')
        .delete()
        .eq('id', id),
      `deleting client ${id}`
    );
  }
};

// Export clientService as clientsService for backward compatibility
export const clientsService = clientService;

// Service Request Management
export const requestService = {
  async getRequests() {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .select(`
          id, service_type, description, priority, status, 
          scheduled_date, completed_date, estimated_cost, actual_cost,
          notes, created_at, updated_at,
          client:clients(id, name, type),
          assigned_technician:users!assigned_technician_id(id, name, email),
          approved_by:users!approved_by_id(id, name)
        `)
        .order('created_at', { ascending: false }),
      'fetching service requests'
    );
  },

  async getRequestById(id: string) {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .select(`
          *,
          client:clients(*),
          assigned_technician:users!assigned_technician_id(*),
          approved_by:users!approved_by_id(id, name, email)
        `)
        .eq('id', id)
        .single(),
      `fetching service request ${id}`
    );
  },

  async createRequest(requestData: {
    client_id: string;
    service_type: string;
    description: string;
    priority: RequestPriority;
    estimated_cost?: number;
    materials?: any[];
    notes?: string;
  }) {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .insert([{ 
          ...requestData, 
          status: REQUEST_STATUSES.PENDING,
          materials: requestData.materials || [],
          attachments: []
        }])
        .select('*')
        .single(),
      'creating service request'
    );
  },

  async updateRequest(id: string, updates: Partial<{
    service_type: string;
    description: string;
    priority: RequestPriority;
    status: RequestStatus;
    assigned_technician_id: string;
    approved_by_id: string;
    scheduled_date: string;
    completed_date: string;
    estimated_cost: number;
    actual_cost: number;
    materials: any[];
    notes: string;
  }>) {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single(),
      `updating service request ${id}`
    );
  },

  async deleteRequest(id: string) {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .delete()
        .eq('id', id),
      `deleting service request ${id}`
    );
  },

  async getRequestsByTechnician(technicianId: string) {
    return withErrorHandling(
      () => supabase
        .from('service_requests')
        .select(`
          id, service_type, description, priority, status,
          scheduled_date, created_at,
          client:clients(id, name)
        `)
        .eq('assigned_technician_id', technicianId)
        .order('scheduled_date', { ascending: true }),
      `fetching requests for technician ${technicianId}`
    );
  }
};

// Export requestService as requestsService for backward compatibility
export const requestsService = requestService;

// Notification Management
export const notificationService = {
  async getNotifications(userId: string) {
    return withErrorHandling(
      () => supabase
        .from('notifications')
        .select('id, title, message, type, is_read, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      `fetching notifications for user ${userId}`
    );
  },

  async markAsRead(notificationId: string) {
    return withErrorHandling(
      () => supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId),
      `marking notification ${notificationId} as read`
    );
  },

  async markAllAsRead(userId: string) {
    return withErrorHandling(
      () => supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false),
      `marking all notifications as read for user ${userId}`
    );
  }
};

// Export notificationService as notificationsService for backward compatibility
export const notificationsService = notificationService;

// Audit Log Management
export const auditService = {
  async getAuditLogs(limit = 100) {
    return withErrorHandling(
      () => supabase
        .from('audit_logs')
        .select(`
          id, action, resource, resource_id, details,
          ip_address, user_agent, timestamp,
          user:users(id, name, email)
        `)
        .order('timestamp', { ascending: false })
        .limit(limit),
      'fetching audit logs'
    );
  },

  async createAuditLog(logData: {
    user_id?: string;
    action: string;
    resource: string;
    resource_id?: string;
    details?: any;
    ip_address?: string;
    user_agent?: string;
  }) {
    return withErrorHandling(
      () => supabase
        .from('audit_logs')
        .insert([logData]),
      'creating audit log'
    );
  }
};

// Authentication helpers
export const authService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      logger.error('Failed to get current user', error);
      throw error;
    }
    
    return user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Failed to sign out', error);
      throw error;
    }
    
    logger.info('User signed out successfully');
  }
};