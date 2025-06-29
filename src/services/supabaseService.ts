import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Client = Tables['clients']['Row']
type ServiceRequest = Tables['service_requests']['Row']
type AuditLog = Tables['audit_logs']['Row']
type Notification = Tables['notifications']['Row']

// Auth Service
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

// Users Service
export const usersService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async createUser(user: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()
    return { data, error }
  },

  async updateUser(id: string, updates: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Clients Service
export const clientsService = {
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getClientById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async createClient(client: Tables['clients']['Insert']) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
    return { data, error }
  },

  async updateClient(id: string, updates: Tables['clients']['Update']) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Service Requests Service
export const requestsService = {
  async getRequests() {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:clients(*),
        assigned_technician:users!assigned_technician_id(*),
        approved_by:users!approved_by_id(*)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getRequestById(id: string) {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:clients(*),
        assigned_technician:users!assigned_technician_id(*),
        approved_by:users!approved_by_id(*)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  async createRequest(request: Tables['service_requests']['Insert']) {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single()
    return { data, error }
  },

  async updateRequest(id: string, updates: Tables['service_requests']['Update']) {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteRequest(id: string) {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Notifications Service
export const notificationsService = {
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async createNotification(notification: Tables['notifications']['Insert']) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single()
    return { data, error }
  }
}

// Audit Logs Service
export const auditService = {
  async getAuditLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(*)
      `)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  async createAuditLog(log: Tables['audit_logs']['Insert']) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(log)
      .select()
      .single()
    return { data, error }
  }
}