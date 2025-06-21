
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, { User as ServiceUser, CreateUserData, UpdateUserData } from '../services/userService';
import { toast } from 'sonner';
import { UserRole } from '../types';

// Extend the service User type with id property for compatibility
export interface User extends Omit<ServiceUser, '_id'> {
  id: string;
  _id?: string;
}

// Transform service user to app user format
const transformUser = (serviceUser: ServiceUser): User => ({
  ...serviceUser,
  id: serviceUser._id,
});

// Transform app user to service format for updates
const transformUserForService = (user: Partial<User>): Partial<ServiceUser> => {
  const { id, ...rest } = user;
  return {
    ...rest,
    _id: id,
  };
};

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  department?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const result = await userService.getUsers(params);
      return {
        ...result,
        users: result.users.map(transformUser)
      };
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const user = await userService.getUserById(id);
      return transformUser(user);
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el usuario');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      userService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el usuario');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => 
      userService.changeUserRole(id, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('Rol de usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar el rol del usuario');
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('Estado del usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar el estado del usuario');
    },
  });
};
