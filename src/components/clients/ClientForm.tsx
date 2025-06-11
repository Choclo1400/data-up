
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, ClientType } from '@/types/requests';
import { Loader2 } from 'lucide-react';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Client>) => Promise<void>;
  initialData?: Partial<Client>;
  loading?: boolean;
  title?: string;
}

interface FormData {
  name: string;
  type: ClientType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  comuna: string;
}

const regiones = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana",
  "Región del Libertador",
  "Región del Maule",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén",
  "Región de Magallanes"
];

const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  title = "Nuevo Cliente"
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || ClientType.OTHER,
      contactPerson: initialData?.contactPerson || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      region: initialData?.region || '',
      comuna: initialData?.comuna || ''
    }
  });

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
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
              <Label htmlFor="name">Nombre de la Empresa</Label>
              <Input
                id="name"
                {...register("name", { required: "El nombre es obligatorio" })}
                placeholder="Ej: Enel Distribución Chile"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Tipo de Cliente</Label>
              <Select onValueChange={(value) => setValue("type", value as ClientType)}>
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
              <Label htmlFor="contactPerson">Persona de Contacto</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson", { required: "La persona de contacto es obligatoria" })}
                placeholder="Nombre del contacto"
              />
              {errors.contactPerson && (
                <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido"
                  }
                })}
                placeholder="contacto@empresa.cl"
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
                placeholder="+56 2 2345 6789"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...register("address", { required: "La dirección es obligatoria" })}
                placeholder="Av. Santa Rosa 76"
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Región</Label>
              <Select onValueChange={(value) => setValue("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región" />
                </SelectTrigger>
                <SelectContent>
                  {regiones.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comuna">Comuna</Label>
              <Input
                id="comuna"
                {...register("comuna", { required: "La comuna es obligatoria" })}
                placeholder="Santiago"
              />
              {errors.comuna && (
                <p className="text-sm text-destructive mt-1">{errors.comuna.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {initialData ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
