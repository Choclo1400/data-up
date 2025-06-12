
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TechnicianForm from '@/components/technicians/TechnicianForm';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Technician, RequestType } from '@/types/requests';
import { UserCheck, Plus, Search, Edit, Trash2, UserX, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Datos de muestra
const sampleTechnicians: Technician[] = [
  {
    id: 'TECH-001',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@inmel.cl',
    phone: '+56 9 8765 4321',
    specialties: [RequestType.INSTALLATION, RequestType.MAINTENANCE],
    region: 'Región Metropolitana',
    isActive: true,
    currentRequests: 3,
    maxConcurrentRequests: 5,
    certificationDate: '2023-01-15',
    certificationExpiry: '2024-01-15',
    rating: 4.8,
    completedRequests: 127
  },
  {
    id: 'TECH-002',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@inmel.cl',
    phone: '+56 9 7654 3210',
    specialties: [RequestType.REPAIR, RequestType.EMERGENCY],
    region: 'Región de Valparaíso',
    isActive: true,
    currentRequests: 2,
    maxConcurrentRequests: 4,
    certificationDate: '2023-03-20',
    certificationExpiry: '2024-03-20',
    rating: 4.9,
    completedRequests: 89
  }
];

const TechniciansPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { createTechnician, updateTechnician, deleteTechnician, toggleTechnicianStatus, loading } = useTechnicians();
  
  const [technicians, setTechnicians] = useState<Technician[]>(sampleTechnicians);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTechnician = async (data: Partial<Technician>) => {
    try {
      const newTechnician = await createTechnician(data);
      setTechnicians(prev => [...prev, newTechnician]);
      toast({
        title: "Técnico creado",
        description: "El técnico ha sido creado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el técnico.",
        variant: "destructive",
      });
    }
  };

  const handleEditTechnician = async (data: Partial<Technician>) => {
    if (!editingTechnician) return;
    
    try {
      await updateTechnician(editingTechnician.id, data);
      setTechnicians(prev => 
        prev.map(tech => 
          tech.id === editingTechnician.id ? { ...tech, ...data } : tech
        )
      );
      setEditingTechnician(null);
      toast({
        title: "Técnico actualizado",
        description: "Los datos del técnico han sido actualizados.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el técnico.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este técnico?')) return;
    
    try {
      await deleteTechnician(id);
      setTechnicians(prev => prev.filter(tech => tech.id !== id));
      toast({
        title: "Técnico eliminado",
        description: "El técnico ha sido eliminado del sistema.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el técnico.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleTechnicianStatus(id, isActive);
      setTechnicians(prev => 
        prev.map(tech => 
          tech.id === id ? { ...tech, isActive } : tech
        )
      );
      toast({
        title: "Estado actualizado",
        description: `El técnico ha sido ${isActive ? 'activado' : 'desactivado'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del técnico.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (technician: Technician) => {
    setEditingTechnician(technician);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTechnician(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Gestión de Técnicos" 
          subtitle="Administra el equipo técnico y sus especialidades"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Técnicos</h1>
                <p className="text-muted-foreground">Gestiona el equipo técnico</p>
              </div>
            </div>
            
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Técnico
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Lista de Técnicos</CardTitle>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar técnicos..."
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
                      <TableHead>Email</TableHead>
                      <TableHead>Región</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead>Solicitudes Activas</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechnicians.map((technician) => (
                      <TableRow key={technician.id}>
                        <TableCell className="font-medium">{technician.name}</TableCell>
                        <TableCell>{technician.email}</TableCell>
                        <TableCell>{technician.region}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {technician.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={technician.currentRequests > 0 ? "default" : "outline"}>
                            {technician.currentRequests}/{technician.maxConcurrentRequests}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>⭐ {technician.rating}</span>
                            <span className="text-muted-foreground">({technician.completedRequests})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={technician.isActive ? "default" : "secondary"}>
                            {technician.isActive ? (
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
                              onClick={() => openEditForm(technician)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(technician.id, !technician.isActive)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTechnician(technician.id)}
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

      <TechnicianForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingTechnician ? handleEditTechnician : handleCreateTechnician}
        initialData={editingTechnician || undefined}
        loading={loading}
        title={editingTechnician ? "Editar Técnico" : "Nuevo Técnico"}
      />
    </div>
  );
};

export default TechniciansPage;
