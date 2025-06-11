
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/common/Badge";
import { Plus, Search, Filter, Eye, Edit, Building2, Phone, Mail } from 'lucide-react';
import { Client, ClientType } from '@/types/requests';

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
  const [clients] = useState<Client[]>(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
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
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                  </Button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, contacto o región..."
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
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
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
                            <Badge variant={getClientTypeBadgeVariant(client.type)}>
                              {client.type}
                            </Badge>
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
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
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
    </div>
  );
};

export default ClientsPage;
