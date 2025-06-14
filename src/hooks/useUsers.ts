import { useState } from 'react';
import { UserRole } from '@/types';
import { useAudit } from './useAudit';
import { AuditEventType, AuditSeverity } from '@/types/audit';

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
  const { logAuditEvent } = useAudit();

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
      
      // Log audit event for user creation
      await logAuditEvent({
        type: AuditEventType.USER_CREATED,
        severity: AuditSeverity.MEDIUM,
        title: 'Usuario creado',
        description: `Se creó un nuevo usuario: ${newUser.name} (${newUser.email})`,
        userId: 'current-user-id',
        userName: 'Usuario Actual',
        userRole: 'ADMIN',
        entityType: 'user',
        entityId: newUser.id,
        metadata: { 
          newUserEmail: newUser.email, 
          newUserRole: newUser.role,
          newUserPermissions: newUser.permissions
        }
      });
      
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
      
      // Log audit event for user update
      await logAuditEvent({
        type: AuditEventType.USER_UPDATED,
        severity: AuditSeverity.MEDIUM,
        title: 'Usuario actualizado',
        description: `Se actualizó la información del usuario: ${userData.name || 'Usuario'}`,
        userId: 'current-user-id',
        userName: 'Usuario Actual',
        userRole: 'ADMIN',
        entityType: 'user',
        entityId: id,
        metadata: userData
      });
      
      console.log('Usuario actualizado:', id, userData);
      return { ...userData, id };
    } catch (err) {
      setError('Error al actualizar el usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (id: string, oldRole: UserRole, newRole: UserRole, userName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log audit event for role change
      await logAuditEvent({
        type: AuditEventType.ROLE_CHANGED,
        severity: AuditSeverity.HIGH,
        title: 'Cambio de rol de usuario',
        description: `Se modificó el rol del usuario ${userName} de ${oldRole} a ${newRole}`,
        userId: 'current-user-id',
        userName: 'Usuario Actual',
        userRole: 'ADMIN',
        entityType: 'user',
        entityId: id,
        changes: {
          role: { old: oldRole, new: newRole }
        },
        metadata: {
          targetUserName: userName,
          changeReason: 'Cambio administrativo'
        }
      });
      
      console.log('Rol del usuario cambiado:', id, 'De:', oldRole, 'A:', newRole);
      return { id, role: newRole };
    } catch (err) {
      setError('Error al cambiar el rol del usuario');
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
    changeUserRole,
    loading,
    error
  };
};
