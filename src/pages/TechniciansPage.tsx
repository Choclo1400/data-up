import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Users, 
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  UserPlus,
  Activity
} from 'lucide-react';
import { getUsers, createUser, updateUser, getServiceRequests } from '@/services/requestService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface TechnicianForm {
  name: string;
  email: string;
  password?: string;
  role: 'technician';
  specialties: string[];
  is_active: boolean;
}

const TechniciansPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: getServiceRequests,
  });

  const technicians = allUsers.filter(u => u.role === 'technician');

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateDialogOpen(false);
      toast.success('Técnico creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el técnico');
      console.error('Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      toast.success('Técnico actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el técnico');
      console.error('Error:', error);
    },
  });

  // Calcular métricas por técnico
  const techniciansWithMetrics = React.useMemo(() => {
    return technicians.map(tech => {
      const techRequests = requests.filter(r => r.assigned_technician_id === tech.id);
      const activeRequests = techRequests.filter(r => ['approved', 'in_progress'].includes(r.status));
      const completedRequests = techRequests.filter(r => r.status === 'completed');
      const urgentRequests = activeRequests.filter(r => r.priority === 'urgent');
      
      // Calcular tiempo promedio de resolución
      const completedWithDates = completedRequests.filter(r => r.completed_date && r.created_at);
      const avgResolutionTime = completedWithDates.length > 0 
        ? completedWithDates.reduce((acc, req) => {
            const created = new Date(req.created_at);
            const completed = new Date(req.completed_date!);
            return acc + (completed.getTime() - created.getTime());
          }, 0) / completedWithDates.length / (1000 * 60 * 60 * 24) // días
        : 0;

      // Calcular carga de trabajo (máximo 5 solicitudes activas = 100%)
      const workloadPercentage = Math.min((activeRequests.length / 5) * 100, 100);
      
      // Determinar disponibilidad
      const availability = workloadPercentage < 60 ? 'available' : 
                          workloadPercentage < 90 ? 'busy' : 'overloaded';

      return {
        ...tech,
        activeRequests: activeRequests.length,
        completedRequests: completedRequests.length,
        urgentRequests: urgentRequests.length,
        totalRequests: techRequests.length,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        workloadPercentage,
        availability,
        lastActivity: techRequests.length > 0 
          ? Math.max(...techRequests.map(r => new Date(r.updated_at).getTime()))
          : new Date(tech.created_at).getTime(),
      };
    });
  }, [technicians, requests]);

  // Filtrar técnicos
  const filteredTechnicians = techniciansWithMetrics.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tech.is_active) ||
                         (statusFilter === 'inactive' && !tech.is_active) ||
                         (statusFilter === 'available' && tech.availability === 'available') ||
                         (statusFilter === 'busy' && tech.availability === 'busy') ||
                         (statusFilter === 'overloaded' && tech.availability === 'overloaded');
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTechnician = (formData: TechnicianForm) => {
    createMutation.mutate({
      ...formData,
      password_hash: formData.password || 'temp_password_' + Date.now(),
    });
  };

  const handleUpdateTechnician = (data: any) => {
    if (selectedTechnician) {
      updateMutation.mutate({ id: selectedTechnician.id, data });
    }
  };

  const canManageTechnicians = user?.role && ['admin', 'manager', 'supervisor'].includes(user.role);

  const availabilityColors = {
    available: 'bg-green-100 text-green-800',
    busy: 'bg-yellow-100 text-yellow-800',
    overloaded: 'bg-red-100 text-red-800',
  };

  const availabilityLabels = {
    available: 'Disponible',
    busy: 'Ocupado',
    overloaded: 'Sobrecargado',
  };

  if (usersLoading || requestsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Técnicos</h1>
          <p className="text-muted-foreground">
            Administración de técnicos, especialidades y asignación inteligente
          </p>
        </div>
        {canManageTechnicians && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Técnico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Técnico</DialogTitle>
                <DialogDescription>
                  Agregar un nuevo técnico al equipo
                </DialogDescription>
              </DialogHeader>
              <TechnicianForm
                onSubmit={handleCreateTechnician}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Métricas generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Técnicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.length}</div>
            <p className="text-xs text-muted-foreground">
              {technicians.filter(t => t.is_active).length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {techniciansWithMetrics.filter(t => t.availability === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Listos para asignación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {techniciansWithMetrics.filter(t => t.availability === 'busy').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con carga moderada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sobrecargados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {techniciansWithMetrics.filter(t => t.availability === 'overloaded').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren redistribución
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar técnicos..."
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="busy">Ocupados</SelectItem>
                <SelectItem value="overloaded">Sobrecargados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de técnicos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTechnicians.map((technician) => (
          <Card key={technician.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${technician.name}`} />
                    <AvatarFallback>
                      {technician.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{technician.name}</h3>
                    <p className="text-sm text-muted-foreground">{technician.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTechnician(technician);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canManageTechnicians && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTechnician(technician);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Disponibilidad</span>
                  <Badge className={availabilityColors[technician.availability as keyof typeof availabilityColors]}>
                    {availabilityLabels[technician.availability as keyof typeof availabilityLabels]}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carga de trabajo</span>
                    <span>{technician.workloadPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={technician.workloadPercentage} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{technician.activeRequests}</div>
                    <div className="text-xs text-muted-foreground">Activas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{technician.completedRequests}</div>
                    <div className="text-xs text-muted-foreground">Completadas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{technician.urgentRequests}</div>
                    <div className="text-xs text-muted-foreground">Urgentes</div>
                  </div>
                </div>

                {technician.avgResolutionTime > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Tiempo promedio: {technician.avgResolutionTime} días
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>
                    Última actividad: {format(new Date(technician.lastActivity), 'dd MMM', { locale: es })}
                  </span>
                </div>

                {!technician.is_active && (
                  <Badge variant="secondary" className="w-full justify-center">
                    Inactivo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTechnicians.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron técnicos</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay técnicos registrados en el sistema'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Diálogos */}
      <TechnicianViewDialog
        technician={selectedTechnician}
        requests={requests.filter(r => r.assigned_technician_id === selectedTechnician?.id)}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
      
      <TechnicianEditDialog
        technician={selectedTechnician}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateTechnician}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};

// Componente para el formulario de creación
const TechnicianForm: React.FC<{
  onSubmit: (data: TechnicianForm) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TechnicianForm>({
    name: '',
    email: '',
    password: '',
    role: 'technician',
    specialties: [],
    is_active: true,
  });

  const availableSpecialties = [
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

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del técnico"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@empresa.com"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Contraseña Temporal</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          placeholder="Contraseña inicial (opcional)"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Si no se especifica, se generará una contraseña temporal
        </p>
      </div>

      <div>
        <Label>Especialidades</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availableSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={formData.specialties.includes(specialty)}
                onCheckedChange={() => toggleSpecialty(specialty)}
              />
              <Label htmlFor={specialty} className="text-sm">
                {specialty.replace('_', ' ').toUpperCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
        />
        <Label htmlFor="is_active">Técnico activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Técnico'}
        </Button>
      </div>
    </form>
  );
};

// Componente para ver detalles del técnico
const TechnicianViewDialog: React.FC<{
  technician: any;
  requests: any[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ technician, requests, isOpen, onClose }) => {
  if (!technician) return null;

  const activeRequests = requests.filter(r => ['approved', 'in_progress'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'completed');
  const recentRequests = requests
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${technician.name}`} />
              <AvatarFallback>
                {technician.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {technician.name}
          </DialogTitle>
          <DialogDescription>
            Información detallada del técnico y su historial de trabajo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Información Personal</h4>
              <div className="space-y-2">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{technician.email}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Badge variant={technician.is_active ? "default" : "secondary"}>
                    {technician.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div>
                  <Label>Fecha de ingreso</Label>
                  <p className="text-sm">
                    {format(new Date(technician.created_at), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Métricas de Rendimiento</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{activeRequests.length}</div>
                    <div className="text-xs text-muted-foreground">Activas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
                    <div className="text-xs text-muted-foreground">Completadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{requests.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carga de trabajo actual</span>
                    <span>{technician.workloadPercentage?.toFixed(0) || 0}%</span>
                  </div>
                  <Progress value={technician.workloadPercentage || 0} />
                </div>
              </div>
            </div>
          </div>

          {technician.specialties && technician.specialties.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {technician.specialties.map((specialty: string) => (
                  <Badge key={specialty} variant="outline">
                    {specialty.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">Solicitudes Recientes</h4>
            <div className="space-y-2">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{request.service_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">{request.clients?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={
                        request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {request.priority}
                      </Badge>
                      <Badge className={
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No hay solicitudes asignadas
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para editar técnico
const TechnicianEditDialog: React.FC<{
  technician: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ technician, isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<any>({});

  React.useEffect(() => {
    if (technician) {
      setFormData({
        name: technician.name,
        email: technician.email,
        specialties: technician.specialties || [],
        is_active: technician.is_active,
      });
    }
  }, [technician]);

  const availableSpecialties = [
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

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s: string) => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  if (!technician) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Técnico</DialogTitle>
          <DialogDescription>
            Actualizar información del técnico
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Especialidades</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={formData.specialties?.includes(specialty) || false}
                    onCheckedChange={() => toggleSpecialty(specialty)}
                  />
                  <Label htmlFor={specialty} className="text-sm">
                    {specialty.replace('_', ' ').toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active || false}
              onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, is_active: !!checked }))}
            />
            <Label htmlFor="is_active">Técnico activo</Label>
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

export default TechniciansPage;