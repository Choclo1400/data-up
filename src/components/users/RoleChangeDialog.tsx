
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { User } from '@/hooks/useUsers';
import { AlertTriangle, User as UserIcon, Shield, Settings, Crown } from 'lucide-react';

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  newRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onConfirm: () => void;
  loading?: boolean;
}

const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  isOpen,
  onClose,
  user,
  newRole,
  onRoleChange,
  onConfirm,
  loading = false
}) => {
  if (!user) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Crown className="w-4 h-4" />;
      case UserRole.SUPERVISOR:
        return <Shield className="w-4 h-4" />;
      case UserRole.MANAGER:
        return <Settings className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive";
      case UserRole.SUPERVISOR:
        return "default";
      case UserRole.MANAGER:
        return "secondary";
      default:
        return "outline";
    }
  };

  const isRoleDowngrade = () => {
    const roleHierarchy = {
      [UserRole.ADMIN]: 4,
      [UserRole.SUPERVISOR]: 3,
      [UserRole.MANAGER]: 2,
      [UserRole.OPERATOR]: 1
    };
    return roleHierarchy[newRole] < roleHierarchy[user.role];
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Acceso completo al sistema y configuración";
      case UserRole.SUPERVISOR:
        return "Gestión de solicitudes y supervisión de operaciones";
      case UserRole.MANAGER:
        return "Gestión de clientes y reportes";
      case UserRole.OPERATOR:
        return "Operaciones básicas y consultas";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Usuario seleccionado</h4>
            <div className="space-y-2">
              <p className="text-sm"><strong>Nombre:</strong> {user.name}</p>
              <p className="text-sm"><strong>Email:</strong> {user.email}</p>
              <div className="flex items-center gap-2">
                <strong className="text-sm">Rol actual:</strong>
                <Badge variant={getRoleBadgeColor(user.role)} className="flex items-center gap-1">
                  {getRoleIcon(user.role)}
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="new-role">Nuevo rol</Label>
            <Select value={newRole} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nuevo rol" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role} disabled={role === user.role}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <span>{role}</span>
                      {role === user.role && <span className="text-xs text-gray-500">(actual)</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {newRole && (
              <p className="text-xs text-gray-600">
                {getRoleDescription(newRole)}
              </p>
            )}
          </div>

          {isRoleDowngrade() && (
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Reducción de privilegios
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Este cambio reducirá los permisos del usuario. Esta acción será registrada en el historial de auditoría.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Registro de auditoría
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Este cambio de rol será registrado automáticamente en el historial de auditoría del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={loading || newRole === user.role}
            variant={isRoleDowngrade() ? "destructive" : "default"}
          >
            {loading ? 'Procesando...' : 'Confirmar Cambio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;
