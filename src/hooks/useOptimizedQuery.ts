import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Hook optimizado para queries con cache inteligente
export function useOptimizedQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number
    cacheTime?: number
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: key,
    queryFn,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
    gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutos
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}

// Hook para invalidar cache de forma eficiente
export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return {
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    invalidateClients: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    invalidateRequests: () => queryClient.invalidateQueries({ queryKey: ['service-requests'] }),
    invalidateAll: () => queryClient.invalidateQueries()
  }
}