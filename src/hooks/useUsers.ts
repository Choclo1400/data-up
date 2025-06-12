
import { useState } from 'react';
import { UserRole } from '@/types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  permissions: string[];
  createdDate: string;
  lastLogin?: string;
}

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `USER-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || UserRole.OPERATOR,
        isActive: true,
        permissions: userData.permissions || [],
        createdDate: new Date().toISOString()
      };
      
      console.log('Usuario creado:', newUser);
      return newUser;
    } catch (err) {
      setError('Error al crear el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Usuario actualizado:', id, userData);
      return { ...userData, id };
    } catch (err) {
      setError('Error al actualizar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Usuario eliminado:', id);
      return true;
    } catch (err) {
      setError('Error al eliminar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('Estado del usuario cambiado:', id, 'Activo:', isActive);
      return { id, isActive };
    } catch (err) {
      setError('Error al cambiar el estado del usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    loading,
    error
  };
};
