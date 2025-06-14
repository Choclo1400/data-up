import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/common/Badge";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RequestForm from "@/components/requests/RequestForm";
import RatingDialog from "@/components/ratings/RatingDialog";
import { Plus, Search, Filter, Eye, Edit, MapPin, ClipboardList, Home, Star } from 'lucide-react';
import { TechnicalRequest, RequestStatus, RequestType, Priority } from '@/types/requests';
import { useRequests } from '@/hooks/useRequests';
import { useRatings } from '@/hooks/useRatings';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

// Datos mock de solicitudes técnicas
const mockRequests: TechnicalRequest[] = [
  {
    id: "REQ-001",
    requestNumber: "SOL-2024-001",
    type: RequestType.INSTALLATION,
    status: RequestStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    title: "Instalación de medidor inteligente",
    description: "Instalación de medidor inteligente en sector residencial",
    clientId: "CLI-001",
    clientName: "Enel Distribución Chile",
    clientType: "ENEL" as any,
    location: "Las Condes, RM",
    requestedDate: "2024-06-10",
    scheduledDate: "2024-06-12",
    estimatedHours: 4,
    assignedTechnicianId: "TEC-001",
    assignedTechnicianName: "Juan Pérez",
    equipmentRequired: ["Medidor inteligente", "Herramientas básicas"],
    materials: ["Cable 2x10", "Conectores"],
    createdBy: "supervisor@inmel.cl",
    createdDate: "2024-06-10T08:00:00Z",
    updatedDate: "2024-06-11T14:30:00Z",
    attachments: []
  },
  {
    id: "REQ-002", 
    requestNumber: "SOL-2024-002",
    type: RequestType.MAINTENANCE,
    status: RequestStatus.NEW,
    priority: Priority.MEDIUM,
    title: "Mantenimiento preventivo transformador",
    description: "Revisión y mantenimiento de transformador de distribución",
    clientId: "CLI-002",
    clientName: "CGE Distribución",
    clientType: "CGE" as any,
    location: "Rancagua, VI Región",
    requestedDate: "2024-06-11",
    estimatedHours: 6,
    equipmentRequired: ["Equipo de medición", "Herramientas especializadas"],
    materials: ["Aceite dieléctrico", "Juntas"],
    createdBy: "operador@inmel.cl",
    createdDate: "2024-06-11T09:15:00Z",
    updatedDate: "2024-06-11T09:15:00Z",
    attachments: []
  },
  {
    id: "REQ-003",
    requestNumber: "SOL-2024-003", 
    type: RequestType.EMERGENCY,
    status: RequestStatus.ASSIGNED,
    priority: Priority.CRITICAL,
    title: "Reparación de falla eléctrica",
    description: "Falla en línea de distribución que afecta a 150 clientes",
    clientId: "CLI-001",
    clientName: "Enel Distribución Chile", 
    clientType: "ENEL" as any,
    location: "Puente Alto, RM",
    requestedDate: "2024-06-11",
    scheduledDate: "2024-06-11",
    estimatedHours: 8,
    assignedTechnicianId: "TEC-002",
    assignedTechnicianName: "María González",
    equipmentRequired: ["Grúa", "Equipo de emergencia"],
    materials: ["Conductor", "Aisladores", "Herrajes"],
    createdBy: "emergencias@inmel.cl",
    createdDate: "2024-06-11T15:45:00Z", 
    updatedDate: "2024-06-11T16:00:00Z",
    attachments: []
  }
];

const getStatusBadgeVariant = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.NEW: return 'info';
    case RequestStatus.VALIDATING: return 'warning';
    case RequestStatus.ASSIGNED: return 'info';
    case RequestStatus.IN_PROGRESS: return 'success';
    case RequestStatus.COMPLETED: return 'success';
    case RequestStatus.CLOSED: return 'neutral';
    case RequestStatus.CANCELLED: return 'danger';
    default: return 'neutral';
  }
};

const getPriorityBadgeVariant = (priority: Priority) => {
  switch (priority) {
    case Priority.LOW: return 'neutral';
    case Priority.MEDIUM: return 'info';
    case Priority.HIGH: return 'warning';
    case Priority.CRITICAL: return 'danger';
    default: return 'neutral';
  }
};

const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<TechnicalRequest[]>(mockRequests);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<TechnicalRequest | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [requestToRate, setRequestToRate] = useState<TechnicalRequest | null>(null);
  
  const { createRequest, updateRequest, loading } = useRequests();
  const { createRating, loading: ratingLoading } = useRatings();
  const { toast } = useToast();

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRequest = async (requestData: Partial<TechnicalRequest>) => {
    try {
      const newRequest = await createRequest(requestData);
      // Assuming createRequest returns the full new request object or we fetch it
      // For mock data, we'll construct something plausible
      const createdRequestWithId = { 
        ...requestData, 
        id: `REQ-${Date.now()}`, // Simple unique ID for mock
        requestNumber: `SOL-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, '0')}`,
        status: RequestStatus.NEW, // Default status
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      } as TechnicalRequest; // Cast to ensure type compatibility
      setRequests(prev => [createdRequestWithId, ...prev]);
      toast({
        title: "Solicitud creada",
        description: "La solicitud técnica ha sido creada exitosamente.",
      });
      closeForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditRequest = async (requestData: Partial<TechnicalRequest>) => {
    if (!editingRequest) return;
    
    try {
      await updateRequest(editingRequest.id, requestData);
      setRequests(prev => 
        prev.map(req => 
          req.id === editingRequest.id 
            ? { ...req, ...requestData, updatedDate: new Date().toISOString() }
            : req
        )
      );
      setEditingRequest(null);
      toast({
        title: "Solicitud actualizada",
        description: "La solicitud técnica ha sido actualizada exitosamente.",
      });
      closeForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleRateRequest = (request: TechnicalRequest) => {
    setRequestToRate(request);
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = async (ratingData: any) => {
    if (!requestToRate) return;
    
    try {
      await createRating(ratingData);
      
      // Marcar la solicitud como calificada
      setRequests(prev => 
        prev.map(req => 
          req.id === requestToRate.id 
            ? { ...req, hasRating: true }
            : req
        )
      );
      
      setRatingDialogOpen(false);
      setRequestToRate(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleViewRequest = (request: TechnicalRequest) => {
    console.log('Ver detalles de solicitud:', request);
    toast({
      title: "Vista de solicitud",
      description: `Abriendo detalles de ${request.requestNumber}`,
    });
    // Example navigation: navigate(`/requests/${request.id}`);
  };

  const openCreateForm = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const openEditForm = (request: TechnicalRequest) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRequest(null);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Solicitudes Técnicas", icon: ClipboardList }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:pl-64">
        <Navbar title="Solicitudes Técnicas" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <Breadcrumbs items={breadcrumbItems} className="mb-4" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Listado de Solicitudes</CardTitle>
                    <CardDescription>
                      Gestión y seguimiento de solicitudes técnicas de clientes
                    </CardDescription>
                  </div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/requests/new')}
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Solicitud
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por número, título o cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Técnico</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.requestNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {request.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.clientName}</TableCell>
                          <TableCell>
                            <Badge variant="info">{request.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(request.priority)}>
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.assignedTechnicianName || (
                              <span className="text-muted-foreground">Sin asignar</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(request.requestedDate).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditForm(request)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {(request.status === RequestStatus.COMPLETED || request.status === RequestStatus.APPROVED) && 
                               !request.hasRating && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRateRequest(request)}
                                  className="text-yellow-600 hover:text-yellow-700"
                                  title="Calificar servicio"
                                >
                                  <Star className="w-4 h-4" />
                                </Button>
                              )}
                              {request.hasRating && (
                                <div className="flex items-center text-green-600" title="Servicio calificado">
                                  <Star className="w-4 h-4 fill-current" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <RequestForm
            isOpen={isFormOpen}
            onClose={closeForm}
            onSubmit={editingRequest ? handleEditRequest : handleCreateRequest}
            initialData={editingRequest || undefined}
            loading={loading}
            title={editingRequest ? "Editar Solicitud" : "Crear Nueva Solicitud"}
          />

          {requestToRate && (
            <RatingDialog
              isOpen={ratingDialogOpen}
              onClose={() => {
                setRatingDialogOpen(false);
                setRequestToRate(null);
              }}
              onSubmit={handleSubmitRating}
              requestId={requestToRate.id}
              requestTitle={requestToRate.title}
              technicianName={requestToRate.assignedTechnicianName || "Técnico asignado"}
              loading={ratingLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default RequestsPage;
