import { supabase } from '@/lib/supabase'
import type { User, Client, ServiceRequest } from '@/types'

// Servicio optimizado con queries eficientes
export class OptimizedService {
  // Paginación eficiente
  static async getUsers(page = 0, limit = 20) {
    const { data, error, count } = await supabase
      .from('users')
      .select('id, email, name, role, is_active, created_at', { count: 'exact' })
      .range(page * limit, (page + 1) * limit - 1)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data || [], count: count || 0 }
  }

  // Query con joins optimizados
  static async getServiceRequestsWithDetails(filters?: {
    status?: string
    priority?: string
    assignedTo?: string
  }) {
    let query = supabase
      .from('service_requests')
      .select(`
        id,
        service_type,
        description,
        priority,
        status,
        scheduled_date,
        estimated_cost,
        clients!inner(id, name, type),
        assigned_technician:users!assigned_technician_id(id, name)
      `)

    // Aplicar filtros de forma eficiente
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters?.assignedTo) {
      query = query.eq('assigned_technician_id', filters.assignedTo)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50) // Limitar resultados

    if (error) throw error
    return data || []
  }

  // Búsqueda optimizada con índices
  static async searchClients(searchTerm: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, type, contact_person')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`)
      .limit(20)

    if (error) throw error
    return data || []
  }

  // Estadísticas con queries agregadas eficientes
  static async getDashboardStats() {
    const [requestsStats, usersCount, clientsCount] = await Promise.all([
      supabase
        .from('service_requests')
        .select('status, priority')
        .then(({ data }) => {
          if (!data) return { byStatus: {}, byPriority: {} }
          
          const byStatus = data.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          
          const byPriority = data.reduce((acc, req) => {
            acc[req.priority] = (acc[req.priority] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          
          return { byStatus, byPriority }
        }),
      
      supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .then(({ count }) => count || 0),
      
      supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .then(({ count }) => count || 0)
    ])

    return {
      requests: requestsStats,
      totalUsers: usersCount,
      totalClients: clientsCount
    }
  }
}