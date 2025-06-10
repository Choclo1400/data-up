
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TechnicalRequest, RequestType, RequestStatus, Priority } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface RequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: TechnicalRequest;
  onSave: (request: TechnicalRequest) => void;
}

const RequestDialog = ({ 
  open, 
  onOpenChange, 
  request, 
  onSave
}: RequestDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!request;
  
  const [formData, setFormData] = useState<Partial<TechnicalRequest>>({
    title: '',
    description: '',
    type: RequestType.MAINTENANCE,
    status: RequestStatus.PENDING,
    priority: Priority.MEDIUM,
    clientCode: 'ENEL-001',
    requestedBy: '',
    location: '',
    equipment: '',
    estimatedHours: 1,
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    if (request) {
      setFormData({
        ...request,
        dueDate: new Date(request.dueDate).toISOString().slice(0, 10)
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData({
        title: '',
        description: '',
        type: RequestType.MAINTENANCE,
        status: RequestStatus.PENDING,
        priority: Priority.MEDIUM,
        clientCode: 'ENEL-001',
        requestedBy: '',
        location: '',
        equipment: '',
        estimatedHours: 1,
        dueDate: tomorrow.toISOString().slice(0, 10),
        notes: ''
      });
    }
  }, [request, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.requestedBy || !formData.location) {
      toast({
        title: "Error de validación",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const requestData: TechnicalRequest = {
      id: request?.id || `REQ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      title: formData.title!,
      description: formData.description!,
      type: formData.type!,
      status: formData.status!,
      priority: formData.priority!,
      clientCode: formData.clientCode!,
      requestedBy: formData.requestedBy!,
      assignedTo: formData.assignedTo,
      createdDate: request?.createdDate || now.toISOString(),
      dueDate: new Date(formData.dueDate!).toISOString(),
      completedDate: formData.status === RequestStatus.COMPLETED ? now.toISOString() : undefined,
      estimatedHours: formData.estimatedHours!,
      actualHours: formData.actualHours,
      location: formData.location!,
      equipment: formData.equipment,
      notes: formData.notes,
      attachments: [],
      history: request?.history || [{
        id: 'HIST001',
        requestId: 'REQ001',
        action: 'Solicitud creada',
        description: 'Nueva solicitud técnica registrada en el sistema',
        performedBy: formData.requestedBy!,
        timestamp: now.toISOString(),
        newStatus: RequestStatus.PENDING
      }]
    };

    onSave(requestData);
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Solicitud actualizada" : "Solicitud creada",
      description: `La solicitud ${requestData.title} ha sido ${isEditing ? 'actualizada' : 'creada'} correctamente.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Solicitud Técnica' : 'Nueva Solicitud Técnica'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Resumen de la solicitud"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Solicitud</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as RequestType }))}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RequestType).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe detalladamente la solicitud técnica"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as RequestStatus }))}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RequestStatus).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCode">Código Cliente</Label>
              <Input
                id="clientCode"
                name="clientCode"
                value={formData.clientCode}
                onChange={handleChange}
                placeholder="ENEL-001"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestedBy">Solicitado por *</Label>
              <Input
                id="requestedBy"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                placeholder="Nombre del solicitante"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Asignado a</Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo || ''}
                onChange={handleChange}
                placeholder="Técnico asignado"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ubicación del trabajo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipo</Label>
              <Input
                id="equipment"
                name="equipment"
                value={formData.equipment || ''}
                onChange={handleChange}
                placeholder="Equipo involucrado"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha Límite *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="actualHours">Horas Reales</Label>
              <Input
                id="actualHours"
                name="actualHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.actualHours || ''}
                onChange={handleChange}
                placeholder="Horas trabajadas"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Información adicional relevante"
              rows={2}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Guardar Cambios' : 'Crear Solicitud'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
