import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Generic hook for Supabase queries
export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<{ success: boolean; data?: T; error?: string }>,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  })
}

// Generic hook for Supabase mutations
export function useSupabaseMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ success: boolean; data?: TData; error?: string }>,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: string) => void
    invalidateQueries?: string[][]
    successMessage?: string
    errorMessage?: string
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: (data) => {
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
      
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      const errorMessage = options?.errorMessage || error.message
      toast.error(errorMessage)
      options?.onError?.(error.message)
    },
  })
}