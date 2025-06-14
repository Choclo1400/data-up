
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ServiceForm from '@/components/services/ServiceForm';
import { useServices } from '@/hooks/useServices';
import { ServiceType, ServiceCategory } from '@/types/services';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ServicesPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const { getAllServices, createService, updateService, deleteService, loading } = useServices();
  
  const [services, setServices] = useState<ServiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const servicesData = await getAllServices();
      setServices(servicesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios.",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = async (data: Partial<ServiceType>) => {
    try {
      const newService = await createService(data);
      setServices(prev => [...prev, newService]);
      toast({
        title: "Servicio creado",
        description: "El servicio ha sido creado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el servicio.",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async (data: Partial<ServiceType>) => {
    if (!editingService) return;
    
    try {
      await updateService(editingService.id, data);
      setServices(prev => 
        prev.map(service => 
          service.id === editingService.id ? { ...service, ...data } : service
        )
      );
      setEditingService(null);
      toast({
        title: "Servicio actualizado",
        description: "Los datos del servicio han sido actualizados.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el servicio.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;
    
    try {
      await deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado del sistema.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (service: ServiceType) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const getCategoryBadgeVariant = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.ELECTRICAL: return "default";
      case ServiceCategory.MECHANICAL: return "secondary";
      case ServiceCategory.CIVIL: return "outline";
      case ServiceCategory.TELECOMMUNICATIONS: return "destructive";
      case ServiceCategory.EMERGENCY: return "destructive";
      default: return "outline";
    }
  };

  if (!hasPermission('manage_services')) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
          <Navbar title="Acceso Denegado" />
          <main className="flex-1 px-6 py-6 flex items-center justify-center">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
        <Navbar 
          title="Catálogo de Servicios" 
          subtitle="Gestiona los tipos de servicios disponibles"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Servicios</h1>
                <p className="text-muted-foreground">Gestiona el catálogo de servicios</p>
              </div>
            </div>
            
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Servicio
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Lista de Servicios</CardTitle>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Horas Est.</TableHead>
                      <TableHead>Precio Base</TableHead>
                      <TableHead>Equipos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(service.category)}>
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.estimatedHours}h</TableCell>
                        <TableCell>${service.basePrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {service.equipmentRequired.slice(0, 2).map((equipment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {equipment}
                              </Badge>
                            ))}
                            {service.equipmentRequired.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{service.equipmentRequired.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Activo</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Inactivo</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
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
        </main>
      </div>

      <ServiceForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingService ? handleEditService : handleCreateService}
        initialData={editingService || undefined}
        loading={loading}
        title={editingService ? "Editar Servicio" : "Nuevo Servicio"}
      />
    </div>
  );
};

export default ServicesPage;
