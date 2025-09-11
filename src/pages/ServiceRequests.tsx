import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Wrench
} from 'lucide-react';
import { getServiceRequests, createServiceRequest, updateServiceRequest, getUsers, getClients } from '@/services/requestService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface ServiceRequestForm {
  client_id: string;
  service_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date?: string;
  estimated_cost?: number;
  materials?: Array<{ item: string; quantity: number; cost?: number; unit?: string }>;
  notes?: string;
}

const ServiceRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: getServiceRequests,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => getUsers().then(users => users.filter(u => u.role === 'technician')),
  });

  const createMutation = useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      setIsCreateDialogOpen(false);
      toast.success('Solicitud creada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear la solicitud');
      console.error('Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      setIsEditDialogOpen(false);
      toast.success('Solicitud actualizada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar la solicitud');
      console.error('Error:', error);
    },
  });

  // Filtrar solicitudes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.clients?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateRequest = (formData: ServiceRequestForm) => {
    createMutation.mutate(formData);
  };

  const handleUpdateRequest = (data: any) => {
    if (selectedRequest) {
      updateMutation.mutate({ id: selectedRequest.id, data });
    }
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    
    if (newStatus === 'completed') {
      updates.completed_date = new Date().toISOString();
    }
    
    updateMutation.mutate({ id: requestId, data: updates });
  };

  const handleAssignTechnician = (requestId: string, technicianId: string) => {
    updateMutation.mutate({ 
      id: requestId, 
      data: { 
        assigned_technician_id: technicianId,
        status: 'approved'
      }
    });
  };

  const canCreateRequest = user?.role && ['admin', 'manager', 'supervisor'].includes(user.role);
  const canApproveRequest = user?.role && ['admin', 'manager'].includes(user.role);
  const canAssignTechnician = user?.role && ['admin', 'manager', 'supervisor'].includes(user.role);
  const canUpdateRequest = user?.role && ['admin', 'manager', 'supervisor', 'technician'].includes(user.role);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    approved: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    in_progress: Wrench,
    completed: CheckCircle,
    cancelled: XCircle,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes de Servicio</h1>
          <p className="text-muted-foreground">
            Gestión completa del ciclo de vida de solicitudes técnicas
          </p>
        </div>
        {canCreateRequest && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Solicitud</DialogTitle>
                <DialogDescription>
                  Complete los detalles de la nueva solicitud de servicio
                </DialogDescription>
              </DialogHeader>
              <ServiceRequestForm
                clients={clients}
                onSubmit={handleCreateRequest}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="in_progress">En Proceso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de solicitudes */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => {
          const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
          
          return (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {request.service_type.replace('_', ' ').toUpperCase()}
                      </h3>
                      <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
                        {request.priority}
                      </Badge>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {request.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.clients?.name}
                      </div>
                      {request.scheduled_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(request.scheduled_date), 'dd MMM yyyy HH:mm', { locale: es })}
                        </div>
                      )}
                      {request.assigned_technician && (
                        <div className="flex items-center gap-1">
                          <Wrench className="h-4 w-4" />
                          {request.assigned_technician.name}
                        </div>
                      )}
                      {request.estimated_cost && (
                        <div className="flex items-center gap-1">
                          €{request.estimated_cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canUpdateRequest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Acciones rápidas según el rol */}
                <div className="flex gap-2 flex-wrap">
                  {canApproveRequest && request.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                  )}
                  
                  {canAssignTechnician && request.status === 'approved' && !request.assigned_technician_id && (
                    <Select onValueChange={(value) => handleAssignTechnician(request.id, value)}>
                      <SelectTrigger className="w-[200px] h-8">
                        <SelectValue placeholder="Asignar técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {user?.id === request.assigned_technician_id && request.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(request.id, 'in_progress')}
                      disabled={updateMutation.isPending}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Iniciar Trabajo
                    </Button>
                  )}
                  
                  {user?.id === request.assigned_technician_id && request.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.id, 'completed')}
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron solicitudes</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay solicitudes de servicio creadas'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogos */}
      <RequestViewDialog
        request={selectedRequest}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
      
      <RequestEditDialog
        request={selectedRequest}
        clients={clients}
        technicians={technicians}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateRequest}
        isLoading={updateMutation.isPending}
        userRole={user?.role}
      />
    </div>
  );
};

// Componente para el formulario de creación
const ServiceRequestForm: React.FC<{
  clients: any[];
  onSubmit: (data: ServiceRequestForm) => void;
  isLoading: boolean;
}> = ({ clients, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ServiceRequestForm>({
    client_id: '',
    service_type: '',
    description: '',
    priority: 'medium',
    materials: [],
  });

  const [newMaterial, setNewMaterial] = useState({ item: '', quantity: 1, cost: 0 });

  const serviceTypes = [
    'network_installation',
    'network_maintenance', 
    'hardware_repair',
    'software_installation',
    'security_audit',
    'equipment_maintenance',
    'data_recovery',
    'virus_removal',
    'printer_repair',
    'backup_setup',
    'system_upgrade',
    'emergency_support'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addMaterial = () => {
    if (newMaterial.item) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), newMaterial]
      }));
      setNewMaterial({ item: '', quantity: 1, cost: 0 });
    }
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client">Cliente *</Label>
          <Select value={formData.client_id} onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="service_type">Tipo de Servicio *</Label>
          <Select value={formData.service_type} onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe detalladamente el servicio requerido..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimated_cost">Costo Estimado (€)</Label>
          <Input
            id="estimated_cost"
            type="number"
            step="0.01"
            value={formData.estimated_cost || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: parseFloat(e.target.value) || undefined }))}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="scheduled_date">Fecha Programada</Label>
        <Input
          id="scheduled_date"
          type="datetime-local"
          value={formData.scheduled_date || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
        />
      </div>

      {/* Materiales */}
      <div>
        <Label>Materiales</Label>
        <div className="space-y-2">
          {formData.materials?.map((material, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <span className="flex-1">{material.item}</span>
              <span>Cant: {material.quantity}</span>
              {material.cost && <span>€{material.cost}</span>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeMaterial(index)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="Material/Herramienta"
              value={newMaterial.item}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, item: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Cantidad"
              value={newMaterial.quantity}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="w-24"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Costo"
              value={newMaterial.cost}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
              className="w-24"
            />
            <Button type="button" onClick={addMaterial} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Información adicional, instrucciones especiales..."
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Solicitud'}
        </Button>
      </div>
    </form>
  );
};

// Componente para ver detalles de la solicitud
const RequestViewDialog: React.FC<{
  request: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ request, isOpen, onClose }) => {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de la Solicitud</DialogTitle>
          <DialogDescription>
            Información completa de la solicitud de servicio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Servicio</Label>
              <p className="font-medium">{request.service_type.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div>
              <Label>Cliente</Label>
              <p className="font-medium">{request.clients?.name}</p>
            </div>
            <div>
              <Label>Prioridad</Label>
              <Badge className={`inline-flex ${
                request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.priority}
              </Badge>
            </div>
            <div>
              <Label>Estado</Label>
              <Badge className={`inline-flex ${
                request.status === 'completed' ? 'bg-green-100 text-green-800' :
                request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status}
              </Badge>
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <p className="mt-1 text-sm">{request.description}</p>
          </div>

          {request.assigned_technician && (
            <div>
              <Label>Técnico Asignado</Label>
              <p className="font-medium">{request.assigned_technician.name}</p>
            </div>
          )}

          {request.scheduled_date && (
            <div>
              <Label>Fecha Programada</Label>
              <p className="font-medium">
                {format(new Date(request.scheduled_date), 'dd MMM yyyy HH:mm', { locale: es })}
              </p>
            </div>
          )}

          {request.estimated_cost && (
            <div>
              <Label>Costo Estimado</Label>
              <p className="font-medium">€{request.estimated_cost.toFixed(2)}</p>
            </div>
          )}

          {request.actual_cost && (
            <div>
              <Label>Costo Real</Label>
              <p className="font-medium">€{request.actual_cost.toFixed(2)}</p>
            </div>
          )}

          {request.materials && request.materials.length > 0 && (
            <div>
              <Label>Materiales</Label>
              <div className="mt-2 space-y-2">
                {request.materials.map((material: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{material.item}</span>
                    <div className="text-sm text-muted-foreground">
                      Cantidad: {material.quantity}
                      {material.unit && ` ${material.unit}`}
                      {material.cost && ` - €${material.cost}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request.notes && (
            <div>
              <Label>Notas</Label>
              <p className="mt-1 text-sm">{request.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <Label>Creada</Label>
              <p>{format(new Date(request.created_at), 'dd MMM yyyy HH:mm', { locale: es })}</p>
            </div>
            {request.completed_date && (
              <div>
                <Label>Completada</Label>
                <p>{format(new Date(request.completed_date), 'dd MMM yyyy HH:mm', { locale: es })}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para editar solicitud
const RequestEditDialog: React.FC<{
  request: any;
  clients: any[];
  technicians: any[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  userRole?: string;
}> = ({ request, clients, technicians, isOpen, onClose, onSubmit, isLoading, userRole }) => {
  const [formData, setFormData] = useState<any>({});

  React.useEffect(() => {
    if (request) {
      setFormData({
        client_id: request.client_id,
        service_type: request.service_type,
        description: request.description,
        priority: request.priority,
        status: request.status,
        assigned_technician_id: request.assigned_technician_id,
        scheduled_date: request.scheduled_date ? request.scheduled_date.slice(0, 16) : '',
        estimated_cost: request.estimated_cost,
        actual_cost: request.actual_cost,
        materials: request.materials || [],
        notes: request.notes || '',
      });
    }
  }, [request]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!request) return null;

  const canEditBasicInfo = userRole && ['admin', 'manager', 'supervisor'].includes(userRole);
  const canAssignTechnician = userRole && ['admin', 'manager', 'supervisor'].includes(userRole);
  const canUpdateStatus = userRole && ['admin', 'manager', 'supervisor', 'technician'].includes(userRole);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Solicitud</DialogTitle>
          <DialogDescription>
            Actualizar información de la solicitud de servicio
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {canEditBasicInfo && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Cliente</Label>
                  <Select value={formData.client_id} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, client_id: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}

          {canAssignTechnician && (
            <div>
              <Label htmlFor="technician">Técnico Asignado</Label>
              <Select value={formData.assigned_technician_id || ''} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, assigned_technician_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {canUpdateStatus && (
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobada</SelectItem>
                  <SelectItem value="in_progress">En Proceso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_cost">Costo Estimado (€)</Label>
              <Input
                id="estimated_cost"
                type="number"
                step="0.01"
                value={formData.estimated_cost || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, estimated_cost: parseFloat(e.target.value) || undefined }))}
                disabled={!canEditBasicInfo}
              />
            </div>
            <div>
              <Label htmlFor="actual_cost">Costo Real (€)</Label>
              <Input
                id="actual_cost"
                type="number"
                step="0.01"
                value={formData.actual_cost || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, actual_cost: parseFloat(e.target.value) || undefined }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scheduled_date">Fecha Programada</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date || ''}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, scheduled_date: e.target.value }))}
              disabled={!canEditBasicInfo}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Agregar observaciones, actualizaciones del progreso..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequests;