
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from '@/types/employees';
import { Loader2, Plus, X } from 'lucide-react';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  initialData?: Partial<Employee>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  skills: string[];
  certifications: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nuevo Empleado"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
      department: initialData?.department || '',
      hireDate: initialData?.hireDate || '',
      salary: initialData?.salary || 0,
      skills: initialData?.skills || [],
      certifications: initialData?.certifications || [],
      emergencyContactName: initialData?.emergencyContact?.name || '',
      emergencyContactPhone: initialData?.emergencyContact?.phone || '',
      emergencyContactRelationship: initialData?.emergencyContact?.relationship || ''
    }
  });

  const watchedSkills = watch('skills') || [];
  const watchedCertifications = watch('certifications') || [];

  const handleFormSubmit = async (data: FormData) => {
    const employeeData = {
      ...data,
      emergencyContact: {
        name: data.emergencyContactName,
        phone: data.emergencyContactPhone,
        relationship: data.emergencyContactRelationship
      }
    };
    // Remove the individual emergency contact fields
    const { emergencyContactName, emergencyContactPhone, emergencyContactRelationship, ...cleanData } = employeeData;
    await onSubmit(cleanData);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addSkill = () => {
    const skill = prompt('Ingrese la habilidad:');
    if (skill && !watchedSkills.includes(skill)) {
      setValue('skills', [...watchedSkills, skill]);
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = watchedSkills.filter((_, i) => i !== index);
    setValue('skills', newSkills);
  };

  const addCertification = () => {
    const cert = prompt('Ingrese la certificación:');
    if (cert && !watchedCertifications.includes(cert)) {
      setValue('certifications', [...watchedCertifications, cert]);
    }
  };

  const removeCertification = (index: number) => {
    const newCerts = watchedCertifications.filter((_, i) => i !== index);
    setValue('certifications', newCerts);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                placeholder="Ej: Carlos Mendoza"
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
                placeholder="carlos.mendoza@inmel.cl"
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
                placeholder="+56 9 8765 4321"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                {...register("position", { required: "El cargo es obligatorio" })}
                placeholder="Técnico Senior"
              />
              {errors.position && (
                <p className="text-sm text-destructive mt-1">{errors.position.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                {...register("department", { required: "El departamento es obligatorio" })}
                placeholder="Técnico"
              />
              {errors.department && (
                <p className="text-sm text-destructive mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hireDate">Fecha de Contratación</Label>
              <Input
                id="hireDate"
                type="date"
                {...register("hireDate", { required: "La fecha de contratación es obligatoria" })}
              />
              {errors.hireDate && (
                <p className="text-sm text-destructive mt-1">{errors.hireDate.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="salary">Salario ($)</Label>
              <Input
                id="salary"
                type="number"
                {...register("salary", { 
                  required: "El salario es obligatorio",
                  min: { value: 0, message: "El salario debe ser mayor a 0" }
                })}
                placeholder="800000"
              />
              {errors.salary && (
                <p className="text-sm text-destructive mt-1">{errors.salary.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Habilidades</Label>
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

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Certificaciones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCertification}>
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedCertifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                    <span>{cert}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="h-auto p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyContactName">Nombre</Label>
                  <Input
                    id="emergencyContactName"
                    {...register("emergencyContactName", { required: "El nombre del contacto es obligatorio" })}
                    placeholder="María Mendoza"
                  />
                  {errors.emergencyContactName && (
                    <p className="text-sm text-destructive mt-1">{errors.emergencyContactName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                  <Input
                    id="emergencyContactPhone"
                    {...register("emergencyContactPhone", { required: "El teléfono del contacto es obligatorio" })}
                    placeholder="+56 9 7654 3210"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-sm text-destructive mt-1">{errors.emergencyContactPhone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactRelationship">Relación</Label>
                  <Input
                    id="emergencyContactRelationship"
                    {...register("emergencyContactRelationship", { required: "La relación es obligatoria" })}
                    placeholder="Esposa"
                  />
                  {errors.emergencyContactRelationship && (
                    <p className="text-sm text-destructive mt-1">{errors.emergencyContactRelationship.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Actualizar' : 'Crear'} Empleado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
