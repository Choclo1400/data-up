import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Wrench, Calendar, MapPin, Phone, Mail, MoreHorizontal, Edit, UserCheck, UserX, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { TechnicianForm } from '@/components/technicians/TechnicianForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Technician {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  phone?: string;
  specialization?: string;
  experience_years?: number;
  certification_level?: string;
}

interface TechnicianStats {
  id: string;
  name: string;
  total_requests: number;
  completed_requests: number;
  in_progress_requests: number;
  avg_completion_time: number;
  customer_rating: number;
}

export default function TechniciansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const queryClient = useQueryClient();

  // Obtener técnicos
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['technicians', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'technician')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        query = query.eq('is_active', isActive);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Technician[];
    }
  });

  // Obtener estadísticas de técnicos
  const { data: technicianStats = [] } = useQuery({
    queryKey: ['technician-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          assigned_technician_id,
          status,
          created_at,
          completed_date,
          users!assigned_technician_id (name)
        `)
        .not('assigned_technician_id', 'is', null);

      if (error) throw error;

      // Procesar estadísticas
      const statsMap = new Map<string, TechnicianStats>();
      
      data.forEach((request: any) => {
        const techId = request.assigned_technician_id;
        if (!statsMap.has(techId)) {
          statsMap.set(techId, {
            id: techId,
            name: request.users?.name || 'Sin nombre',
            total_requests: 0,
            completed_requests: 0,
            in_progress_requests: 0,
            avg_completion_time: 0,
            customer_rating: 4.2 // Simulado por ahora
          });
        }

        const stats = statsMap.get(techId)!;
        stats.total_requests++;

        if (request.status === 'completed') {
          stats.completed_requests++;
        } else if (request.status === 'in_progress') {
          stats.in_progress_requests++;
        }
      });

      return Array.from(statsMap.values());
    }
  });

  const toggleTechnicianStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('users')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast.success('Estado del técnico actualizado');
    },
    onError: (error) => {
      toast.error('Error al actualizar el estado del técnico');
      console.error(error);
    }
  });

  const handleToggleStatus = (technician: Technician) => {
    toggleTechnicianStatusMutation.mutate({ id: technician.id, is_active: !technician.is_active });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionRate = (stats: TechnicianStats) => {
    if (stats.total_requests === 0) return 0;
    return Math.round((stats.completed_requests / stats.total_requests) * 100);
  };

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = !searchTerm || 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && tech.is_active) ||
      (statusFilter === 'inactive' && !tech.is_active);
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Técnicos</h1>
          <p className="text-muted-foreground">
            Gestiona el equipo de técnicos y su rendimiento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Técnico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Técnico</DialogTitle>
              <DialogDescription>
                Completa los datos para agregar un nuevo técnico al equipo
              </DialogDescription>
            </DialogHeader>
            <TechnicianForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Técnicos</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Técnicos Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.filter(t => t.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Activas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {technicianStats.reduce((sum, stats) => sum + stats.in_progress_requests, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Completadas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {technicianStats.length > 0 
                ? Math.round(technicianStats.reduce((sum, stats) => sum + getCompletionRate(stats), 0) / technicianStats.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Buscar técnicos por nombre o email..."
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Técnicos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTechnicians.map((technician) => {
              const stats = technicianStats.find(s => s.id === technician.id);
              return (
                <Card key={technician.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10">
                            {getInitials(technician.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{technician.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {technician.email}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant={technician.is_active ? "default" : "secondary"}>
                          {technician.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingTechnician(technician)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(technician)}>
                              {technician.is_active ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {technician.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{technician.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Desde: {format(new Date(technician.created_at), 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>

                    {technician.last_login && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Último acceso: {format(new Date(technician.last_login), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </span>
                      </div>
                    )}

                    {stats && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Solicitudes completadas</span>
                          <span className="font-medium">{stats.completed_requests}/{stats.total_requests}</span>
                        </div>
                        <Progress value={getCompletionRate(stats)} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {getCompletionRate(stats)}% de tasa de completación
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            {technicianStats.map((stats) => (
              <Card key={stats.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(stats.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{stats.name}</CardTitle>
                        <CardDescription>Estadísticas de rendimiento</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {getCompletionRate(stats)}% completación
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.total_requests}</div>
                      <div className="text-sm text-muted-foreground">Total Solicitudes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.completed_requests}</div>
                      <div className="text-sm text-muted-foreground">Completadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.in_progress_requests}</div>
                      <div className="text-sm text-muted-foreground">En Progreso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.customer_rating.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Calificación</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso de completación</span>
                      <span>{getCompletionRate(stats)}%</span>
                    </div>
                    <Progress value={getCompletionRate(stats)} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar técnico */}
      <Dialog open={!!editingTechnician} onOpenChange={() => setEditingTechnician(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>
              Modifica los datos del técnico seleccionado
            </DialogDescription>
          </DialogHeader>
          {editingTechnician && (
            <TechnicianForm 
              technician={editingTechnician} 
              onSuccess={() => setEditingTechnician(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}