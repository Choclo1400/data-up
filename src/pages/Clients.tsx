import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/common/Badge";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ClientForm from "@/components/clients/ClientForm";
import ClientDialog from "@/components/clients/ClientDialog";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientTypeIcon from "@/components/clients/ClientTypeIcon";
import { useClients } from "@/hooks/useClients";
import { Plus, Search, Eye, Edit, Trash2, Power, Archive, Building2, Phone, Mail } from 'lucide-react';
import { Client, ClientType } from '@/types/requests';
import { useToast } from "@/hooks/use-toast";

// Datos mock de clientes
const mockClients: Client[] = [
  {
    id: "CLI-001",
    name: "Enel Distribución Chile",
    type: ClientType.ENEL,
    contactPerson: "Carlos Martínez",
    email: "carlos.martinez@enel.cl",
    phone: "+56 2 2345 6789",
    address: "Av. Santa Rosa 76",
    region: "Región Metropolitana",
    comuna: "Santiago",
    contractNumber: "CONT-ENEL-2024-001",
    isActive: true,
    createdDate: "2024-01-15T00:00:00Z"
  },
  {
    id: "CLI-002", 
    name: "CGE Distribución",
    type: ClientType.CGE,
    contactPerson: "Ana López",
    email: "ana.lopez@cge.cl",
    phone: "+56 72 234 5678",
    address: "Av. Brasil 1020",
    region: "Región del Libertador",
    comuna: "Rancagua",
    contractNumber: "CONT-CGE-2024-002",
    isActive: true,
    createdDate: "2024-02-10T00:00:00Z"
  },
  {
    id: "CLI-003",
    name: "Saesa",
    type: ClientType.SAESA,
    contactPerson: "Pedro Silva", 
    email: "pedro.silva@saesa.cl",
    phone: "+56 63 345 6789",
    address: "Calle Los Carrera 850",
    region: "Región de Los Ríos",
    comuna: "Valdivia",
    contractNumber: "CONT-SAESA-2024-003",
    isActive: true,
    createdDate: "2024-03-05T00:00:00Z"
  },
  {
    id: "CLI-004",
    name: "Frontel",
    type: ClientType.FRONTEL,
    contactPerson: "María Fernández",
    email: "maria.fernandez@frontel.cl", 
    phone: "+56 45 456 7890",
    address: "Av. Alemania 0671",
    region: "Región de La Araucanía",
    comuna: "Temuco",
    contractNumber: "CONT-FRONTEL-2024-004",
    isActive: true,
    createdDate: "2024-04-12T00:00:00Z"
  }
];

const getClientTypeBadgeVariant = (type: ClientType) => {
  switch (type) {
    case ClientType.ENEL: return 'success';
    case ClientType.CGE: return 'info';
    case ClientType.SAESA: return 'warning';
    case ClientType.FRONTEL: return 'neutral';
    default: return 'neutral';
  }
};

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'createdDate' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<{
    type?: ClientType;
    region?: string;
    isActive?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const { createClient, updateClient, deleteClient, toggleClientStatus, archiveClient, loading } = useClients();
  const { toast } = useToast();

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.type || client.type === filters.type;
      const matchesRegion = !filters.region || client.region === filters.region;
      const matchesStatus = filters.isActive === undefined || client.isActive === filters.isActive;
      
      const matchesDate = (!filters.dateFrom && !filters.dateTo) || 
        ((!filters.dateFrom || new Date(client.createdDate) >= new Date(filters.dateFrom)) &&
         (!filters.dateTo || new Date(client.createdDate) <= new Date(filters.dateTo)));

      return matchesSearch && matchesType && matchesRegion && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdDate':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clients, searchTerm, filters, sortBy, sortOrder]);

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      const newClient = await createClient(clientData);
      setClients(prev => [...prev, newClient]);
      toast({
        title: "Cliente creado",
        description: `${newClient.name} ha sido creado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el cliente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!editingClient) return;
    
    try {
      const updatedClient = await updateClient(editingClient.id, clientData);
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...updatedClient } : c));
      setEditingClient(null);
      toast({
        title: "Cliente actualizado",
        description: `${clientData.name} ha sido actualizado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) return;
    
    try {
      await deleteClient(client.id);
      setClients(prev => prev.filter(c => c.id !== client.id));
      toast({
        title: "Cliente eliminado",
        description: `${client.name} ha sido eliminado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (client: Client) => {
    try {
      const newStatus = !client.isActive;
      await toggleClientStatus(client.id, newStatus);
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, isActive: newStatus } : c));
      toast({
        title: "Estado actualizado",
        description: `${client.name} ha sido ${newStatus ? 'activado' : 'desactivado'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del cliente.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveClient = async (client: Client) => {
    if (!confirm(`¿Estás seguro de que quieres archivar a ${client.name}?`)) return;
    
    try {
      await archiveClient(client.id);
      setClients(prev => prev.filter(c => c.id !== client.id));
      toast({
        title: "Cliente archivado",
        description: `${client.name} ha sido archivado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo archivar el cliente.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const breadcrumbItems = [
    { label: "Clientes", icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Gestión de Clientes</CardTitle>
                    <CardDescription>
                      Administración de empresas distribuidoras y clientes corporativos
                    </CardDescription>
                  </div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => setShowClientForm(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                  </Button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar por nombre, contacto, email o región..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <ClientFilters
                      isOpen={showFilters}
                      onToggle={() => setShowFilters(!showFilters)}
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={() => setFilters({})}
                    />
                  </div>
                  
                  {showFilters && (
                    <ClientFilters
                      isOpen={showFilters}
                      onToggle={() => setShowFilters(!showFilters)}
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={() => setFilters({})}
                    />
                  )}
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <span>
                    Mostrando {filteredAndSortedClients.length} de {clients.length} clientes
                  </span>
                  <div className="flex items-center gap-2">
                    <span>Ordenar por:</span>
                    <select 
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field as 'name' | 'createdDate' | 'type');
                        setSortOrder(order as 'asc' | 'desc');
                      }}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="name-asc">Nombre A-Z</option>
                      <option value="name-desc">Nombre Z-A</option>
                      <option value="createdDate-desc">Más reciente</option>
                      <option value="createdDate-asc">Más antiguo</option>
                      <option value="type-asc">Tipo A-Z</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Creación</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">{client.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ClientTypeIcon type={client.type} />
                              <Badge variant={getClientTypeBadgeVariant(client.type)}>
                                {client.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{client.contactPerson}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {client.email}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{client.comuna}</div>
                              <div className="text-sm text-muted-foreground">{client.region}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-mono">
                              {client.contractNumber}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={client.isActive ? 'success' : 'danger'}>
                              {client.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(client.createdDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setShowClientDialog(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingClient(client);
                                  setShowClientForm(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleToggleStatus(client)}
                              >
                                <Power className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleArchiveClient(client)}
                              >
                                <Archive className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteClient(client)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
        </div>
      </div>

      {/* Formulario de Cliente */}
      <ClientForm
        isOpen={showClientForm}
        onClose={() => {
          setShowClientForm(false);
          setEditingClient(null);
        }}
        onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
        initialData={editingClient || undefined}
        loading={loading}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
      />

      {/* Modal de Detalles */}
      <ClientDialog
        client={selectedClient}
        isOpen={showClientDialog}
        onClose={() => {
          setShowClientDialog(false);
          setSelectedClient(null);
        }}
      />
    </div>
  );
};

export default ClientsPage;
