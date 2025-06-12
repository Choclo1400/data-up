
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TechnicalRequest, RequestType, Priority, ClientType } from '@/types/requests';
import { Loader2 } from 'lucide-react';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TechnicalRequest>) => Promise<void>;
  initialData?: Partial<TechnicalRequest>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  title: string;
  description: string;
  type: RequestType;
  priority: Priority;
  clientName: string;
  clientType: ClientType;
  location: string;
  estimatedHours: number;
  equipmentRequired: string;
  materials: string;
}

const RequestForm: React.FC<RequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nueva Solicitud Técnica"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || RequestType.MAINTENANCE,
      priority: initialData?.priority || Priority.MEDIUM,
      clientName: initialData?.clientName || '',
      clientType: initialData?.clientType || ClientType.OTHER,
      location: initialData?.location || '',
      estimatedHours: initialData?.estimatedHours || 4,
      equipmentRequired: initialData?.equipmentRequired?.join(', ') || '',
      materials: initialData?.materials?.join(', ') || ''
    }
  });

  const watchedType = watch('type');
  const watchedPriority = watch('priority');
  const watchedClientType = watch('clientType');

  const handleFormSubmit = async (data: FormData) => {
    const requestData: Partial<TechnicalRequest> = {
      ...data,
      clientId: `CLI-${Date.now()}`, // En una app real, esto vendría de un selector
      equipmentRequired: data.equipmentRequired.split(',').map(item => item.trim()).filter(Boolean),
      materials: data.materials.split(',').map(item => item.trim()).filter(Boolean)
    };

    await onSubmit(requestData);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título de la Solicitud</Label>
              <Input
                id="title"
                {...register("title", { required: "El título es obligatorio" })}
                placeholder="Ej: Instalación de medidor inteligente"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Tipo de Solicitud</Label>
              <Select value={watchedType} onValueChange={(value) => setValue("type", value as RequestType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RequestType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={watchedPriority} onValueChange={(value) => setValue("priority", value as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="clientName">Cliente</Label>
              <Input
                id="clientName"
                {...register("clientName", { required: "El cliente es obligatorio" })}
                placeholder="Nombre del cliente"
              />
              {errors.clientName && (
                <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientType">Tipo de Cliente</Label>
              <Select value={watchedClientType} onValueChange={(value) => setValue("clientType", value as ClientType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ClientType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                {...register("location", { required: "La ubicación es obligatoria" })}
                placeholder="Ej: Las Condes, RM"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="1"
                {...register("estimatedHours", { 
                  required: "Las horas estimadas son obligatorias",
                  valueAsNumber: true,
                  min: { value: 1, message: "Debe ser al menos 1 hora" }
                })}
              />
              {errors.estimatedHours && (
                <p className="text-sm text-destructive mt-1">{errors.estimatedHours.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description", { required: "La descripción es obligatoria" })}
                placeholder="Descripción detallada de la solicitud..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="equipmentRequired">Equipos Requeridos</Label>
              <Input
                id="equipmentRequired"
                {...register("equipmentRequired")}
                placeholder="Separar con comas"
              />
            </div>

            <div>
              <Label htmlFor="materials">Materiales</Label>
              <Input
                id="materials"
                {...register("materials")}
                placeholder="Separar con comas"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Actualizar' : 'Crear'} Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestForm;
