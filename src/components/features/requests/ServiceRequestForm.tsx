import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceRequestSchema, ServiceType, Priority } from '@/lib/validations/requests';
import { useCreateServiceRequest, useUpdateServiceRequest } from '@/hooks/data/useServiceRequests';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/clientService';
import type { ServiceRequestFormData } from '@/lib/validations/requests';

interface ServiceRequestFormProps {
  initialData?: Partial<ServiceRequestFormData> & { id?: string };
  onSuccess?: () => void;
  isEditing?: boolean;
}

export function ServiceRequestForm({ initialData, onSuccess, isEditing = false }: ServiceRequestFormProps) {
  const createMutation = useCreateServiceRequest();
  const updateMutation = useUpdateServiceRequest();
  
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: initialData || {
      materials: [],
    },
  });

  const selectedServiceType = watch('service_type');
  const selectedPriority = watch('priority');
  const selectedClientId = watch('client_id');

  const onSubmit = async (data: ServiceRequestFormData) => {
    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Solicitud de Servicio' : 'Nueva Solicitud de Servicio'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service_type">Tipo de Servicio *</Label>
            <Select
              value={selectedServiceType || ''}
              onValueChange={(value) => setValue('service_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de servicio" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ServiceType).map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p className="text-sm text-destructive">{errors.service_type.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente el servicio requerido..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad *</Label>
            <Select
              value={selectedPriority || ''}
              onValueChange={(value) => setValue('priority', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Priority).map((label) => (
                  <SelectItem key={label} value={label}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        label === 'Crítica' ? 'bg-red-500' :
                        label === 'Alta' ? 'bg-orange-500' :
                        label === 'Media' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <Select
              value={selectedClientId || ''}
              onValueChange={(value) => setValue('client_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-sm text-destructive">{errors.client_id.message}</p>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Fecha Programada</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              {...register('scheduled_date')}
            />
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label htmlFor="estimated_cost">Costo Estimado (CLP)</Label>
            <Input
              id="estimated_cost"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              {...register('estimated_cost', { valueAsNumber: true })}
            />
            {errors.estimated_cost && (
              <p className="text-sm text-destructive">{errors.estimated_cost.message}</p>
            )}
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <Label htmlFor="materials">Materiales Necesarios</Label>
            <Textarea
              id="materials"
              placeholder="Lista los materiales necesarios (uno por línea)"
              onChange={(e) => {
                const materials = e.target.value.split('\n').filter(m => m.trim());
                setValue('materials', materials);
              }}
              defaultValue={initialData?.materials?.join('\n') || ''}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional relevante..."
              {...register('notes')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Solicitud' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}