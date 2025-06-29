import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Client = Tables['clients']['Row'];
type ServiceRequest = Tables['service_requests']['Row'];
type AuditLog = Tables['audit_logs']['Row'];
type Notification = Tables['notifications']['Row'];

// Users Service
export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Client Service
export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Service Request Service
export const requestService = {
  async getAll() {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:clients(*),
        assigned_technician:users!service_requests_assigned_technician_id_fkey(*),
        approved_by:users!service_requests_approved_by_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:clients(*),
        assigned_technician:users!service_requests_assigned_technician_id_fkey(*),
        approved_by:users!service_requests_approved_by_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ServiceRequest>) {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Audit Service
export const auditService = {
  async getAll() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(*)
      `)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Notification Service
export const notificationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Export aliases for backward compatibility
export const clientsService = clientService;
export const notificationsService = notificationService;
export const requestsService = requestService;