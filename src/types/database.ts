export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator'
          is_active: boolean | null
          two_factor_secret: string | null
          two_factor_enabled: boolean | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator'
          is_active?: boolean | null
          two_factor_secret?: string | null
          two_factor_enabled?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator'
          is_active?: boolean | null
          two_factor_secret?: string | null
          two_factor_enabled?: boolean | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          type: 'individual' | 'company'
          contact_person: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type: 'individual' | 'company'
          contact_person?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          type?: 'individual' | 'company'
          contact_person?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      service_requests: {
        Row: {
          id: string
          client_id: string | null
          service_type: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          assigned_technician_id: string | null
          approved_by_id: string | null
          scheduled_date: string | null
          completed_date: string | null
          estimated_cost: number | null
          actual_cost: number | null
          materials: Json | null
          notes: string | null
          attachments: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          service_type: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          assigned_technician_id?: string | null
          approved_by_id?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          materials?: Json | null
          notes?: string | null
          attachments?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          service_type?: string
          description?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          assigned_technician_id?: string | null
          approved_by_id?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_cost?: number | null
          actual_cost?: number | null
          materials?: Json | null
          notes?: string | null
          attachments?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string
          resource_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource: string
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource?: string
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          is_read?: boolean | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}