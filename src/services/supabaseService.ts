import { supabase, handleSupabaseError, handleSupabaseSuccess } from '@/lib/supabase'
import { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Client = Tables['clients']['Row']
type Service = Tables['services']['Row']
type Request = Tables['requests']['Row']
type Profile = Tables['profiles']['Row']
type AuditLog = Tables['audit_logs']['Row']
type Notification = Tables['notifications']['Row']
type Rating = Tables['ratings']['Row']

// Clients
export const clientService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(client: Tables['clients']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async update(id: string, updates: Tables['clients']['Update']) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(null)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Services
export const serviceService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(service: Tables['services']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async update(id: string, updates: Tables['services']['Update']) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(null)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Requests
export const requestService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          client:clients(*),
          service:services(*),
          assigned_technician:profiles!requests_assigned_technician_id_fkey(*),
          created_by_profile:profiles!requests_created_by_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(request: Tables['requests']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(request)
        .select(`
          *,
          client:clients(*),
          service:services(*),
          assigned_technician:profiles!requests_assigned_technician_id_fkey(*),
          created_by_profile:profiles!requests_created_by_fkey(*)
        `)
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async update(id: string, updates: Tables['requests']['Update']) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          service:services(*),
          assigned_technician:profiles!requests_assigned_technician_id_fkey(*),
          created_by_profile:profiles!requests_created_by_fkey(*)
        `)
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(null)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Profiles
export const profileService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async getTechnicians() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'technician')
        .eq('is_active', true)
        .order('full_name')

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async update(id: string, updates: Tables['profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Audit Logs
export const auditService = {
  async getAll(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          user:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(log: Tables['audit_logs']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(log)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Notifications
export const notificationService = {
  async getByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(notification: Tables['notifications']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async markAsRead(id: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Ratings
export const ratingService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          request:requests(*),
          client:clients(*),
          technician:profiles(*)
        `)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  async create(rating: Tables['ratings']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert(rating)
        .select(`
          *,
          request:requests(*),
          client:clients(*),
          technician:profiles(*)
        `)
        .single()

      if (error) return handleSupabaseError(error)
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}