import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient, createSampleClients } from '@/services/clientService';
import { toast } from 'sonner';
import { Loader2, Users, Building2 } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['individual', 'company'], {
    required_error: 'El tipo de cliente es requerido'
  }),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  contact_person: z.string().optional()
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [isCreatingSamples, setIsCreatingSamples] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: 'individual'
    }
  });

  const clientType = watch('type');

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Clean empty strings to null for optional fields
      const cleanData = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        contact_person: data.contact_person || null
      };

      const newClient = await createClient(cleanData);
      toast.success('Cliente creado exitosamente');
      console.log('Nuevo cliente:', newClient);
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear el cliente');
      console.error('Failed to create client:', error);
    }
  };

  const handleCreateSamples = async () => {
    setIsCreatingSamples(true);
    try {
      await createSampleClients();
      toast.success('Clientes de ejemplo creados exitosamente');
      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear clientes de ejemplo');
      console.error('Failed to create sample clients:', error);
    } finally {
      setIsCreatingSamples(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {clientType === 'company' ? <Building2 className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            Crear Nuevo Cliente
          </CardTitle>
          <CardDescription>
            Completa la información del cliente para agregarlo al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Cliente *</Label>
                <Input
                  id="name"
                  placeholder="Ingresa el nombre"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Cliente *</Label>
                <Select
                  value={clientType}
                  onValueChange={(value: 'individual' | 'company') => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Individual
                      </div>
                    </SelectItem>
                    <SelectItem value="company">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Empresa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0123"
                  {...register('phone')}
                />
              </div>
            </div>

            {clientType === 'company' && (
              <div className="space-y-2">
                <Label htmlFor="contact_person">Persona de Contacto</Label>
                <Input
                  id="contact_person"
                  placeholder="Nombre del contacto principal"
                  {...register('contact_person')}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                placeholder="Dirección completa del cliente"
                {...register('address')}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Cliente'
                )}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Demostración</CardTitle>
          <CardDescription>
            Crea clientes de ejemplo para probar el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCreateSamples}
            disabled={isCreatingSamples}
            variant="outline"
            className="w-full"
          >
            {isCreatingSamples ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando clientes de ejemplo...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Crear 5 Clientes de Ejemplo
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}