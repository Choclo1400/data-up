import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { useServiceRequests } from '@/hooks/data/useServiceRequests';
import { Search, Filter, Eye, Edit, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServiceRequestsListProps {
  onViewRequest?: (id: string) => void;
  onEditRequest?: (id: string) => void;
}

export function ServiceRequestsList({ onViewRequest, onEditRequest }: ServiceRequestsListProps) {
  const { data: requests, isLoading, error } = useServiceRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter requests based on search and filters
  const filteredRequests = requests?.filter(request => {
    const clientName = (request as any).clients?.name || '';
    const matchesSearch = 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Nueva': return 'outline';
      case 'En Validación': return 'secondary';
      case 'Pendiente Gestor': return 'default';
      case 'Pendiente Supervisor': return 'default';
      case 'Asignada': return 'default';
      case 'En Proceso': return 'default';
      case 'Completada': return 'default';
      case 'Aprobada': return 'default';
      case 'Rechazada': return 'destructive';
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-red-600 bg-red-50';
      case 'Alta': return 'text-orange-600 bg-orange-50';
      case 'Media': return 'text-yellow-600 bg-yellow-50';
      case 'Baja': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = (scheduledDate: string | null, status: string) => {
    if (!scheduledDate) return false;
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    return scheduled < now && !['Completada', 'Aprobada', 'Cerrada', 'Cancelada'].includes(status);
  };

  if (isLoading) return <LoadingState isLoading={true} children={null} />;

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error al cargar las solicitudes. Por favor, intenta de nuevo.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descripción, cliente o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Nueva">Nueva</SelectItem>
                <SelectItem value="En Validación">En Validación</SelectItem>
                <SelectItem value="Pendiente Gestor">Pendiente Gestor</SelectItem>
                <SelectItem value="Pendiente Supervisor">Pendiente Supervisor</SelectItem>
                <SelectItem value="Asignada">Asignada</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredRequests.length} de {requests?.length || 0} solicitudes
      </div>

      {/* Requests Grid */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                No se encontraron solicitudes que coincidan con los filtros aplicados.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={`${getPriorityColor(request.priority)} border-0`}>
                        {request.priority}
                      </Badge>
                      {isOverdue(request.scheduled_date, request.status) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Vencida
                        </Badge>
                      )}
                    </div>

                    {/* Main Info */}
                    <div>
                      <h3 className="font-semibold text-lg">{request.service_type}</h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Cliente:</span>
                        <span>{(request as any).clients?.name || 'No asignado'}</span>
                      </div>
                      {(request as any).assigned_technician && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Técnico:</span>
                          <span>{(request as any).assigned_technician.name}</span>
                        </div>
                      )}
                      {request.scheduled_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(request.scheduled_date), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Creada: {format(new Date(request.created_at!), 'dd/MM/yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>

                    {/* Cost Info */}
                    {(request.estimated_cost || request.actual_cost) && (
                      <div className="flex gap-4 text-sm">
                        {request.estimated_cost && (
                          <span>
                            <strong>Estimado:</strong> ${request.estimated_cost.toLocaleString()} CLP
                          </span>
                        )}
                        {request.actual_cost && (
                          <span>
                            <strong>Costo Real:</strong> ${request.actual_cost.toLocaleString()} CLP
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewRequest?.(request.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditRequest?.(request.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}