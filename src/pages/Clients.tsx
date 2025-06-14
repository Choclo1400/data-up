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
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useConfirmation } from '@/hooks/useConfirmation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

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
  const { confirmation, showConfirmation, hideConfirmation, confirm } = useConfirmation();
  const [dataState, setDataState] = useState<'loading' | 'error' | 'success' | 'empty'>('success');

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.region && client.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !filters.type || client.type === filters.type;
      const matchesRegion = !filters.region || client.region === filters.region;
      const matchesStatus = filters.isActive === undefined || client.isActive === filters.isActive;
      
      const clientCreatedDate = client.createdDate ? new Date(client.createdDate) : null;
      const matchesDate = (!filters.dateFrom && !filters.dateTo) || 
        (clientCreatedDate && 
         (!filters.dateFrom || clientCreatedDate >= new Date(filters.dateFrom)) &&
         (!filters.dateTo || clientCreatedDate <= new Date(filters.dateTo)));

      return matchesSearch && matchesType && matchesRegion && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdDate':
          const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
          const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'type':
          comparison = (a.type || "").localeCompare(b.type || "");
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clients, searchTerm, filters, sortBy, sortOrder]);

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      const newClient = await createClient(clientData);
      // Mocking the return of a full client object for UI update
      const createdClient = {
        ...mockClients[0], // Use a base mock structure
        ...clientData,
        id: `CLI-${Date.now()}`,
        createdDate: new Date().toISOString(),
        isActive: clientData.isActive !== undefined ? clientData.isActive : true,
      } as Client;
      setClients(prev => [...prev, createdClient]);
      toast({
        title: "Cliente creado",
        description: `${createdClient.name} ha sido creado exitosamente.`,
      });
      setShowClientForm(false);
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
      const updatedClientData = await updateClient(editingClient.id, clientData);
       // Mocking the return of a full client object for UI update
      const updatedClient = { ...editingClient, ...clientData, ...updatedClientData };
      setClients(prev => prev.map(c => c.id === editingClient.id ? updatedClient : c));
      setEditingClient(null);
      setShowClientForm(false);
      toast({
        title: "Cliente actualizado",
        description: `${updatedClient.name} ha sido actualizado exitosamente.`,
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
    showConfirmation({
      title: 'Eliminar Cliente',
      description: `¿Estás seguro de que quieres eliminar a ${client.name}? Esta acción no se puede deshacer.`,
      type: 'delete',
      variant: 'danger',
      onConfirm: async () => {
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
      }
    });
  };

  const handleToggleStatus = async (client: Client) => {
    const newStatus = !client.isActive;
    showConfirmation({
      title: `${newStatus ? 'Activar' : 'Desactivar'} Cliente`,
      description: `¿Estás seguro de que quieres ${newStatus ? 'activar' : 'desactivar'} a ${client.name}?`,
      type: 'disable',
      variant: 'warning',
      confirmText: newStatus ? 'Activar' : 'Desactivar',
      onConfirm: async () => {
        try {
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
      }
    });
  };

  const handleArchiveClient = async (client: Client) => {
    showConfirmation({
      title: 'Archivar Cliente',
      description: `¿Estás seguro de que quieres archivar a ${client.name}? Podrás restaurarlo más tarde desde el archivo.`,
      type: 'archive',
      variant: 'warning',
      onConfirm: async () => {
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
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Building2 }, // Corrected icon if needed
    { label: "Clientes", icon: Building2 }
  ];

  const renderContent = () => {
    if (loading && dataState === 'loading') {
      return <LoadingState type="table" rows={6} />;
    }

    if (dataState === 'error') {
      return (
        <ErrorState
          type="generic"
          onRetry={() => {
            setDataState('loading');
            // Simulate reload
            setTimeout(() => setDataState('success'), 1000);
          }}
        />
      );
    }

    if (filteredAndSortedClients.length === 0 && searchTerm) {
      return (
        <EmptyState
          icon={Search}
          title="No se encontraron resultados"
          description={`No hay clientes que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`}
          action={{
            label: "Limpiar búsqueda",
            onClick: () => setSearchTerm('')
          }}
        />
      );
    }

    if (filteredAndSortedClients.length === 0) {
      return (
        <EmptyState
          icon={Building2}
          title="No hay clientes registrados"
          description="Comienza agregando tu primer cliente para gestionar tus relaciones comerciales."
          action={{
            label: "Agregar Cliente",
            onClick: () => {
              setEditingClient(null);
              setShowClientForm(true);
            }
          }}
        />
      );
    }

    return (
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
                      {client.type || 'N/A'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.contactPerson || 'N/A'}</div>
                    {client.email && <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {client.email}
                    </div>}
                    {client.phone && <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.comuna || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{client.region || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-mono">
                    {client.contractNumber || 'N/A'}
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
                      title={client.isActive ? "Desactivar" : "Activar"}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleArchiveClient(client)}
                      title="Archivar"
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteClient(client)}
                      className="text-destructive hover:text-destructive"
                      title="Eliminar"
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
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:pl-64">
        <Navbar title="Gestión de Clientes" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="container mx-auto">
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />
            
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Listado de Clientes</CardTitle>
                    <CardDescription>
                      Administración de empresas distribuidoras y clientes corporativos
                    </CardDescription>
                  </div>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => { setEditingClient(null); setShowClientForm(true); }}
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                  </Button>
                </div>
                
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
                    {/* Button to toggle ClientFilters visibility */}
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                      {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
                    </Button>
                  </div>
                  
                  {/* Conditionally render ClientFilters */}
                  {showFilters && (
                    <ClientFilters
                      isOpen={showFilters} // This prop might be redundant if visibility is controlled here
                      onToggle={() => setShowFilters(!showFilters)} // Could be used by ClientFilters to close itself
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={() => setFilters({})}
                    />
                  )}
                </div>

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
                      className="text-sm border rounded px-2 py-1 bg-background text-foreground"
                    >
                      <option value="name-asc">Nombre A-Z</option>
                      <option value="name-desc">Nombre Z-A</option>
                      <option value="createdDate-desc">Más reciente</option>
                      <option value="createdDate-asc">Más antiguo</option>
                      <option value="type-asc">Tipo A-Z</option>
                      <option value="type-desc">Tipo Z-A</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {renderContent()}
              </CardContent>
            </Card>
          </div>

          <ClientForm
            isOpen={showClientForm}
            onClose={() => {
              setShowClientForm(false);
              setEditingClient(null);
            }}
            onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
            initialData={editingClient || undefined}
            loading={loading} // Pass loading state from useClients hook
            title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
          />

          <ClientDialog
            client={selectedClient}
            isOpen={showClientDialog}
            onClose={() => {
              setShowClientDialog(false);
              setSelectedClient(null);
            }}
          />

          <ConfirmationDialog
            isOpen={confirmation.isOpen}
            onClose={hideConfirmation}
            onConfirm={confirm}
            title={confirmation.title}
            description={confirmation.description}
            type={confirmation.type}
            variant={confirmation.variant}
            confirmText={confirmation.confirmText}
            cancelText={confirmation.cancelText}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default ClientsPage;
