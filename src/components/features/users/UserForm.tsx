import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from '@/types';
// Mock types for now - will be replaced when Supabase is connected
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => Promise<void>;
  initialData?: Partial<User>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

const availablePermissions = [
  'create_requests',
  'edit_requests',
  'delete_requests',
  'manage_clients',
  'manage_technicians',
  'manage_users',
  'view_reports',
  'system_config'
];

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nuevo Usuario"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'operator' as UserRole,
      permissions: initialData?.permissions || []
    }
  });

  const watchedPermissions = watch('permissions') || [];

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const togglePermission = (permission: string) => {
    const currentPermissions = watchedPermissions;
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    setValue('permissions', newPermissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                {...register("name", { required: "El nombre es obligatorio" })}
                placeholder="Ej: María González"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido"
                  }
                })}
                placeholder="maria.gonzalez@inmel.cl"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="role">Rol</Label>
              <Select onValueChange={(value) => setValue("role", value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Permisos</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={watchedPermissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission)}
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission.replace('_', ' ').toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};