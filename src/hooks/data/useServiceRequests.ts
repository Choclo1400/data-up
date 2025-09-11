import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getServiceRequests,
  getServiceRequestById,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
  updateRequestStatus,
  assignTechnician,
  getRequestsByStatus,
  getOverdueRequests
} from '@/services/requestService';

// Get all service requests
export function useServiceRequests() {
  return useQuery({
    queryKey: ['service-requests'],
    queryFn: getServiceRequests,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get service request by ID
export function useServiceRequest(id: string) {
  return useQuery({
    queryKey: ['service-requests', id],
    queryFn: () => getServiceRequestById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Create service request mutation
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Solicitud creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear solicitud: ${error.message}`);
    },
  });
}

// Update service request mutation
export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Solicitud actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar solicitud: ${error.message}`);
    },
  });
}

// Delete service request mutation
export function useDeleteServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Solicitud eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar solicitud: ${error.message}`);
    },
  });
}

// Update request status mutation (for approval workflow)
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, data }: { id: string; status: string; data?: Record<string, any> }) =>
      updateRequestStatus(id, status, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Estado actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    },
  });
}

// Assign technician mutation
export function useAssignTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, technicianId }: { requestId: string; technicianId: string }) =>
      assignTechnician(requestId, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Técnico asignado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al asignar técnico: ${error.message}`);
    },
  });
}

// Dashboard statistics
export function useRequestStatistics() {
  return useQuery({
    queryKey: ['dashboard-stats', 'requests-by-status'],
    queryFn: getRequestsByStatus,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get overdue requests for dashboard
export function useOverdueRequests() {
  return useQuery({
    queryKey: ['dashboard-stats', 'overdue-requests'],
    queryFn: getOverdueRequests,
    staleTime: 60 * 1000, // 1 minute
  });
}