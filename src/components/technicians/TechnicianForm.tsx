import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/useUsers';

const technicianSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['technician', 'supervisor'], {
    required_error: 'Selecciona un rol',
  }),
  specialization: z.string().optional(),
  phone: z.string().optional(),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

interface TechnicianFormProps {
  onSuccess?: () => void;
  initialData?: Partial<TechnicianFormData>;
  isEditing?: boolean;
  technicianId?: string;
}

export const TechnicianForm: React.FC<TechnicianFormProps> = ({
  onSuccess,
  initialData,
  isEditing = false,
  technicianId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, updateUser } = useUsers();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: TechnicianFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && technicianId) {
        await updateUser.mutateAsync({
          id: technicianId,
          ...data,
        });
        toast.success('Técnico actualizado exitosamente');
      } else {
        await createUser.mutateAsync({
          ...data,
          is_active: true,
        });
        toast.success('Técnico creado exitosamente');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(isEditing ? 'Error al actualizar técnico' : 'Error al crear técnico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Técnico' : 'Nuevo Técnico'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nombre del técnico"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@ejemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Contraseña"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={watch('role')}
                onValueChange={(value) => setValue('role', value as 'technician' | 'supervisor')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Técnico</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Número de teléfono"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Especialización</Label>
            <Textarea
              id="specialization"
              {...register('specialization')}
              placeholder="Describe las especialidades del técnico..."
              rows={3}
            />
            {errors.specialization && (
              <p className="text-sm text-red-500">{errors.specialization.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Técnico'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};