
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceType, ServiceCategory } from '@/types/services';
import { Loader2, Plus, X } from 'lucide-react';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceType>) => Promise<void>;
  initialData?: Partial<ServiceType>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  name: string;
  description: string;
  category: ServiceCategory;
  estimatedHours: number;
  basePrice: number;
  equipmentRequired: string[];
  skillsRequired: string[];
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nuevo Servicio"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || ServiceCategory.ELECTRICAL,
      estimatedHours: initialData?.estimatedHours || 0,
      basePrice: initialData?.basePrice || 0,
      equipmentRequired: initialData?.equipmentRequired || [],
      skillsRequired: initialData?.skillsRequired || []
    }
  });

  const watchedEquipment = watch('equipmentRequired') || [];
  const watchedSkills = watch('skillsRequired') || [];

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addEquipment = () => {
    const equipment = prompt('Ingrese el equipo requerido:');
    if (equipment && !watchedEquipment.includes(equipment)) {
      setValue('equipmentRequired', [...watchedEquipment, equipment]);
    }
  };

  const removeEquipment = (index: number) => {
    const newEquipment = watchedEquipment.filter((_, i) => i !== index);
    setValue('equipmentRequired', newEquipment);
  };

  const addSkill = () => {
    const skill = prompt('Ingrese la habilidad requerida:');
    if (skill && !watchedSkills.includes(skill)) {
      setValue('skillsRequired', [...watchedSkills, skill]);
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = watchedSkills.filter((_, i) => i !== index);
    setValue('skillsRequired', newSkills);
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
              <Label htmlFor="name">Nombre del Servicio</Label>
              <Input
                id="name"
                {...register("name", { required: "El nombre es obligatorio" })}
                placeholder="Ej: Instalación de Transformador"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description", { required: "La descripción es obligatoria" })}
                placeholder="Descripción detallada del servicio..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select onValueChange={(value) => setValue("category", value as ServiceCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceCategory).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                {...register("estimatedHours", { 
                  required: "Las horas estimadas son obligatorias",
                  min: { value: 1, message: "Debe ser mayor a 0" }
                })}
                placeholder="8"
              />
              {errors.estimatedHours && (
                <p className="text-sm text-destructive mt-1">{errors.estimatedHours.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="basePrice">Precio Base ($)</Label>
              <Input
                id="basePrice"
                type="number"
                {...register("basePrice", { 
                  required: "El precio base es obligatorio",
                  min: { value: 0, message: "Debe ser mayor o igual a 0" }
                })}
                placeholder="150000"
              />
              {errors.basePrice && (
                <p className="text-sm text-destructive mt-1">{errors.basePrice.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Equipos Requeridos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEquipment}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedEquipment.map((equipment, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    <span>{equipment}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEquipment(index)}
                      className="h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Habilidades Requeridas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    <span>{skill}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
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
              {initialData ? 'Actualizar' : 'Crear'} Servicio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
