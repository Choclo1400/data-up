import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Calendar, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { RequestForm } from '@/components/requests/RequestForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServiceRequest {
  id: string;
  client_id: string;
  service_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  assigned_technician_id?: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  created_at: string;
  clients?: {
    name: string;
    type: string;
  };
  assigned_technician?: {
    name: string;
    email: string;
  };
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  approved: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['service-requests', searchTerm, statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          clients (name, type),
          assigned_technician:users!assigned_technician_id (name, email)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,service_type.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ServiceRequest[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getRequestsByStatus = (status: string) => {
    return requests.filter(request => request.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes de Servicio</h1>
          <p className="text-muted-foreground">
            Gestiona todas las solicitudes de servicio del sistema
          </p>
        </div>
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
                Completa los datos para crear una nueva solicitud de servicio
              </DialogDescription>
            </DialogHeader>
            <RequestForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descripción o tipo de servicio..."
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
                <SelectItem value="approved">Aprobado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
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

      {/* Tabs por estado */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({getRequestsByStatus('pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas ({getRequestsByStatus('approved').length})</TabsTrigger>
          <TabsTrigger value="in_progress">En Progreso ({getRequestsByStatus('in_progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({getRequestsByStatus('completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <RequestGrid requests={filteredRequests} onStatusChange={handleStatusChange} />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <RequestGrid requests={getRequestsByStatus('pending')} onStatusChange={handleStatusChange} />
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          <RequestGrid requests={getRequestsByStatus('approved')} onStatusChange={handleStatusChange} />
        </TabsContent>
        
        <TabsContent value="in_progress" className="space-y-4">
          <RequestGrid requests={getRequestsByStatus('in_progress')} onStatusChange={handleStatusChange} />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <RequestGrid requests={getRequestsByStatus('completed')} onStatusChange={handleStatusChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestGrid({ 
  requests, 
  onStatusChange 
}: { 
  requests: ServiceRequest[]; 
  onStatusChange: (id: string, status: string) => void;
}) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No hay solicitudes</p>
          <p className="text-sm text-muted-foreground">No se encontraron solicitudes con los filtros aplicados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{request.service_type}</CardTitle>
                <CardDescription className="text-sm">
                  Cliente: {request.clients?.name || 'Sin asignar'}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className={priorityColors[request.priority]}>
                  {request.priority.toUpperCase()}
                </Badge>
                <Badge className={statusColors[request.status]}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {request.description}
            </p>
            
            <div className="space-y-2 text-sm">
              {request.assigned_technician && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{request.assigned_technician.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Creado: {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
              
              {request.scheduled_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Programado: {format(new Date(request.scheduled_date), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
              )}
              
              {request.estimated_cost && (
                <div className="text-sm font-medium">
                  Costo estimado: ${request.estimated_cost.toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                value={request.status}
                onValueChange={(value) => onStatusChange(request.id, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}