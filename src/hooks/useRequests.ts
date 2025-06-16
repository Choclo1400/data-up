import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import requestService, { Request, CreateRequestData, UpdateRequestData } from '../services/requestService';
import { toast } from 'sonner';

export const useRequests = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string;
}) => {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => requestService.getRequests(params),
  });
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