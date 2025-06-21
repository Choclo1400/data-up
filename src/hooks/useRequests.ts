
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import requestService, { Request, CreateRequestData, UpdateRequestData } from '../services/requestService';
import { toast } from 'sonner';
import { TechnicalRequest, Priority } from '../types/requests';

// Transform TechnicalRequest to service Request format
const transformToServiceRequest = (techRequest: Partial<TechnicalRequest>): Partial<Request> => {
  return {
    title: techRequest.title,
    description: techRequest.description,
    type: techRequest.type,
    priority: transformPriority(techRequest.priority),
    client: techRequest.clientId,
    scheduledDate: techRequest.scheduledDate,
    // Add other compatible fields as needed
  };
};

// Transform Priority enum to service format
const transformPriority = (priority?: Priority): 'low' | 'medium' | 'high' | 'urgent' | undefined => {
  if (!priority) return undefined;
  
  switch (priority) {
    case Priority.LOW: return 'low';
    case Priority.MEDIUM: return 'medium';
    case Priority.HIGH: return 'high';
    case Priority.CRITICAL: return 'urgent';
    default: return 'medium';
  }
};

export const useRequests = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const queryResult = useQuery({
    queryKey: ['requests', params],
    queryFn: () => requestService.getRequests(params),
  });

  const createRequest = async (data: Partial<TechnicalRequest>) => {
    setLoading(true);
    try {
      const serviceData = transformToServiceRequest(data);
      await requestService.createRequest(serviceData as CreateRequestData);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud creada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la solicitud');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, data: Partial<TechnicalRequest>) => {
    setLoading(true);
    try {
      const serviceData = transformToServiceRequest(data);
      await requestService.updateRequest(id, serviceData as UpdateRequestData);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success('Solicitud actualizada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar la solicitud');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateScheduleConflict = async (date: string, hours: number): Promise<boolean> => {
    // Mock validation - in real app would check against API
    return false;
  };

  const fetchPendingManager = async () => {
    return requestService.getRequests({ status: 'pending-manager' });
  };

  const fetchPendingSupervisor = async () => {
    return requestService.getRequests({ status: 'pending-supervisor' });
  };

  const approveManager = async (id: string, comment?: string) => {
    setLoading(true);
    try {
      await requestService.approveRequest(id, comment);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud aprobada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al aprobar la solicitud');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveSupervisor = async (id: string, comment?: string) => {
    setLoading(true);
    try {
      await requestService.approveRequest(id, comment);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud aprobada exitosamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al aprobar la solicitud');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    setLoading(true);
    try {
      await requestService.rejectRequest(id, reason);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud rechazada');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al rechazar la solicitud');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...queryResult,
    createRequest,
    updateRequest,
    validateScheduleConflict: async (date: string, hours: number): Promise<boolean> => {
      // Mock validation - in real app would check against API
      return false;
    },
    fetchPendingManager: async () => {
      return requestService.getRequests({ status: 'pending-manager' });
    },
    fetchPendingSupervisor: async () => {
      return requestService.getRequests({ status: 'pending-supervisor' });
    },
    approveManager: async (id: string, comment?: string) => {
      setLoading(true);
      try {
        await requestService.approveRequest(id, comment);
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast.success('Solicitud aprobada exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al aprobar la solicitud');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    approveSupervisor: async (id: string, comment?: string) => {
      setLoading(true);
      try {
        await requestService.approveRequest(id, comment);
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast.success('Solicitud aprobada exitosamente');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al aprobar la solicitud');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    rejectRequest: async (id: string, reason: string) => {
      setLoading(true);
      try {
        await requestService.rejectRequest(id, reason);
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        toast.success('Solicitud rechazada');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al rechazar la solicitud');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    loading: loading || queryResult.isLoading
  };
};

export const useRequest = (id: string) => {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(id),
    enabled: !!id,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRequestData) => requestService.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear la solicitud');
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestData }) => 
      requestService.updateRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success('Solicitud actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar la solicitud');
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => requestService.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Solicitud eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar la solicitud');
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => 
      requestService.approveRequest(id, comment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success('Solicitud aprobada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al aprobar la solicitud');
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      requestService.rejectRequest(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      toast.success('Solicitud rechazada');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al rechazar la solicitud');
    },
  });
};

export const useMyRequests = () => {
  return useQuery({
    queryKey: ['my-requests'],
    queryFn: () => requestService.getMyRequests(),
  });
};

export const useAssignedRequests = () => {
  return useQuery({
    queryKey: ['assigned-requests'],
    queryFn: () => requestService.getAssignedRequests(),
  });
};
