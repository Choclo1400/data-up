
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RequestCard from '@/components/requests/RequestCard';
import RequestDialog from '@/components/requests/RequestDialog';
import { TechnicalRequest, RequestStatus, RequestType, Priority } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';

// Mock data for technical requests
const mockRequests: TechnicalRequest[] = [
  {
    id: 'REQ001',
    title: 'Mantenimiento preventivo subestación Norte',
    description: 'Realizar mantenimiento preventivo programado en la subestación Norte según protocolo Enel',
    type: RequestType.MAINTENANCE,
    status: RequestStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    clientCode: 'ENEL-001',
    requestedBy: 'Carlos Mendoza',
    assignedTo: 'Juan Pérez',
    createdDate: '2024-01-15T08:00:00Z',
    dueDate: '2024-01-20T18:00:00Z',
    estimatedHours: 8,
    actualHours: 6,
    location: 'Subestación Norte - Santiago',
    equipment: 'Transformador 220kV',
    notes: 'Coordinar corte programado con centro de control',
    attachments: [],
    history: []
  },
  {
    id: 'REQ002',
    title: 'Inspección línea de transmisión Sector Sur',
    description: 'Inspección visual y termográfica de línea de transmisión en sector sur',
    type: RequestType.INSPECTION,
    status: RequestStatus.PENDING,
    priority: Priority.MEDIUM,
    clientCode: 'ENEL-002',
    requestedBy: 'María González',
    createdDate: '2024-01-16T10:30:00Z',
    dueDate: '2024-01-25T16:00:00Z',
    estimatedHours: 4,
    location: 'Línea 220kV Sur',
    equipment: 'Torres 150-180',
    history: []
  },
  {
    id: 'REQ003',
    title: 'Reparación urgente sistema SCADA',
    description: 'Falla en comunicación del sistema SCADA con equipos de campo',
    type: RequestType.EMERGENCY,
    status: RequestStatus.APPROVED,
    priority: Priority.CRITICAL,
    clientCode: 'ENEL-001',
    requestedBy: 'Roberto Silva',
    assignedTo: 'Ana Torres',
    createdDate: '2024-01-17T14:00:00Z',
    dueDate: '2024-01-18T08:00:00Z',
    estimatedHours: 12,
    location: 'Centro de Control',
    equipment: 'Servidor SCADA Principal',
    notes: 'Requiere acceso 24/7 hasta resolución',
    history: []
  }
];

const RequestsPage = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [requests, setRequests] = useState<TechnicalRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<TechnicalRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<TechnicalRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('es-ES', options);
    setCurrentDate(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
  }, []);

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleRequestClick = (request: TechnicalRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setIsDialogOpen(true);
  };

  const handleSaveRequest = (request: TechnicalRequest) => {
    if (selectedRequest) {
      // Update existing request
      setRequests(prev => prev.map(r => r.id === request.id ? request : r));
    } else {
      // Add new request
      setRequests(prev => [...prev, request]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Solicitudes Técnicas" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header with actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Gestión de Solicitudes Técnicas</h1>
              <p className="text-muted-foreground">Sistema de gestión Inmel Chile - Enel</p>
            </div>
            
            <Button
              onClick={handleNewRequest}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva Solicitud
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar solicitudes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.values(RequestStatus).map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.values(RequestType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las prioridades</SelectItem>
                    {Object.values(Priority).map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <Filter size={16} />
                  Limpiar
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Total Solicitudes</div>
              <div className="text-2xl font-bold">{requests.length}</div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Pendientes</div>
              <div className="text-2xl font-bold text-orange-600">
                {requests.filter(r => r.status === RequestStatus.PENDING).length}
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">En Progreso</div>
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === RequestStatus.IN_PROGRESS).length}
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="text-sm text-muted-foreground">Completadas</div>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === RequestStatus.COMPLETED).length}
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => handleRequestClick(request)}
              />
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron solicitudes con los filtros aplicados.</p>
            </div>
          )}
        </main>
      </div>

      <RequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        request={selectedRequest}
        onSave={handleSaveRequest}
      />
    </div>
  );
};

export default RequestsPage;
