
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Technician, RequestType } from '@/types/requests';
import { Loader2 } from 'lucide-react';

interface TechnicianFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Technician>) => Promise<void>;
  initialData?: Partial<Technician>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  region: string;
  specialties: RequestType[];
  maxConcurrentRequests: number;
}

const regiones = [
  "Región de Arica y Parinacota", "Región de Tarapacá", "Región de Antofagasta",
  "Región de Atacama", "Región de Coquimbo", "Región de Valparaíso",
  "Región Metropolitana", "Región del Libertador", "Región del Maule",
  "Región del Biobío", "Región de La Araucanía", "Región de Los Ríos",
  "Región de Los Lagos", "Región de Aysén", "Región de Magallanes"
];

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nuevo Técnico"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      region: initialData?.region || regiones[0], // Set default to first region
      specialties: initialData?.specialties || [],
      maxConcurrentRequests: initialData?.maxConcurrentRequests || 5
    }
  });

  const watchedSpecialties = watch('specialties') || [];
  const watchedRegion = watch('region');

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleSpecialty = (specialty: RequestType) => {
    const currentSpecialties = watchedSpecialties;
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    setValue('specialties', newSpecialties);
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
                placeholder="Ej: Juan Pérez"
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
                placeholder="juan.perez@inmel.cl"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register("phone", { required: "El teléfono es obligatorio" })}
                placeholder="+56 9 1234 5678"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Región</Label>
              <Select value={watchedRegion} onValueChange={(value) => setValue("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  {regiones.filter(region => region && region.trim() !== '').map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxConcurrentRequests">Máximo de Solicitudes Concurrentes</Label>
              <Input
                id="maxConcurrentRequests"
                type="number"
                min="1"
                max="20"
                {...register("maxConcurrentRequests", { 
                  required: "Este campo es obligatorio",
                  valueAsNumber: true,
                  min: { value: 1, message: "Debe ser al menos 1" },
                  max: { value: 20, message: "No puede ser mayor a 20" }
                })}
              />
              {errors.maxConcurrentRequests && (
                <p className="text-sm text-destructive mt-1">{errors.maxConcurrentRequests.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Especialidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {Object.values(RequestType).filter(specialty => specialty && specialty.trim() !== '').map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={watchedSpecialties.includes(specialty)}
                      onCheckedChange={() => toggleSpecialty(specialty)}
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
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
              {initialData ? 'Actualizar' : 'Crear'} Técnico
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianForm;
