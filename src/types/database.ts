export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'manager' | 'supervisor' | 'technician' | 'employee'
          department: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          two_factor_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'supervisor' | 'technician' | 'employee'
          department?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'supervisor' | 'technician' | 'employee'
          department?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          type: 'individual' | 'company'
          email: string | null
          phone: string | null
          address: string | null
          contact_person: string | null
          tax_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'individual' | 'company'
          email?: string | null
          phone?: string | null
          address?: string | null
          contact_person?: string | null
          tax_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'individual' | 'company'
          email?: string | null
          phone?: string | null
          address?: string | null
          contact_person?: string | null
          tax_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          estimated_duration: number | null
          base_price: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          estimated_duration?: number | null
          base_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          estimated_duration?: number | null
          base_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          client_id: string
          service_id: string
          assigned_technician_id: string | null
          title: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
          location: string | null
          scheduled_date: string | null
          completed_date: string | null
          estimated_cost: number | null
          final_cost: number | null
          notes: string | null
          attachments: string[] | null
          approval_status: 'pending' | 'manager_approved' | 'supervisor_approved' | 'rejected'
          approved_by_manager: string | null
          approved_by_supervisor: string | null
          manager_approval_date: string | null
          supervisor_approval_date: string | null
          rejection_reason: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          service_id: string
          assigned_technician_id?: string | null
          title: string
          description: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
          location?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          notes?: string | null
          attachments?: string[] | null
          approval_status?: 'pending' | 'manager_approved' | 'supervisor_approved' | 'rejected'
          approved_by_manager?: string | null
          approved_by_supervisor?: string | null
          manager_approval_date?: string | null
          supervisor_approval_date?: string | null
          rejection_reason?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          service_id?: string
          assigned_technician_id?: string | null
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
          location?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          notes?: string | null
          attachments?: string[] | null
          approval_status?: 'pending' | 'manager_approved' | 'supervisor_approved' | 'rejected'
          approved_by_manager?: string | null
          approved_by_supervisor?: string | null
          manager_approval_date?: string | null
          supervisor_approval_date?: string | null
          rejection_reason?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string | null
          details: Record<string, any> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          request_id: string
          client_id: string
          technician_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          client_id: string
          technician_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          client_id?: string
          technician_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
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
  }
}