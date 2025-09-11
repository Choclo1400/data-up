import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Wrench,
  FileText
} from 'lucide-react';
import { getServiceRequests, getUsers } from '@/services/requestService';
import { format, isAfter, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: getServiceRequests,
  });

  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => getUsers().then(users => users.filter(u => u.role === 'technician')),
  });

  // Calcular métricas
  const metrics = React.useMemo(() => {
    const now = new Date();
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => r.status === 'in_progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;
    const overdue = requests.filter(r => 
      r.scheduled_date && 
      isAfter(now, parseISO(r.scheduled_date)) && 
      !['completed', 'cancelled'].includes(r.status)
    ).length;

    const totalRequests = requests.length;
    const completionRate = totalRequests > 0 ? (completed / totalRequests) * 100 : 0;

    // Calcular tiempo promedio de resolución
    const completedRequests = requests.filter(r => r.status === 'completed' && r.completed_date && r.created_at);
    const avgResolutionTime = completedRequests.length > 0 
      ? completedRequests.reduce((acc, req) => {
          const created = new Date(req.created_at);
          const completed = new Date(req.completed_date!);
          return acc + (completed.getTime() - created.getTime());
        }, 0) / completedRequests.length / (1000 * 60 * 60 * 24) // días
      : 0;

    return {
      pending,
      inProgress,
      completed,
      overdue,
      completionRate,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    };
  }, [requests]);

  // Calcular carga de trabajo por técnico
  const technicianWorkload = React.useMemo(() => {
    return technicians.map(tech => {
      const assignedRequests = requests.filter(r => 
        r.assigned_technician_id === tech.id && 
        ['approved', 'in_progress'].includes(r.status)
      );
      
      return {
        ...tech,
        activeRequests: assignedRequests.length,
        urgentRequests: assignedRequests.filter(r => r.priority === 'urgent').length,
        workloadPercentage: Math.min((assignedRequests.length / 5) * 100, 100), // Máximo 5 solicitudes
      };
    });
  }, [technicians, requests]);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    approved: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (requestsLoading || techniciansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Panel de control en tiempo real del sistema de gestión de servicios
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pending}</div>
            <p className="text-xs text-muted-foreground">
              Esperando aprobación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Siendo ejecutadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completed}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completionRate.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="critical">Críticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Tasa de Completación</span>
                    <span>{metrics.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.completionRate} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Tiempo Promedio de Resolución</span>
                    <span>{metrics.avgResolutionTime} días</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Total de Solicitudes</span>
                    <span>{requests.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Solicitudes Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requests
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((request) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {request.service_type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(request.created_at), 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
                            {request.priority}
                          </Badge>
                          <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Carga de Trabajo por Técnico
              </CardTitle>
              <CardDescription>
                Estado actual de asignaciones y disponibilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicianWorkload.map((tech) => (
                  <div key={tech.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tech.activeRequests} solicitudes activas
                          {tech.urgentRequests > 0 && (
                            <span className="text-red-600 ml-2">
                              ({tech.urgentRequests} urgentes)
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge variant={tech.workloadPercentage > 80 ? "destructive" : tech.workloadPercentage > 60 ? "secondary" : "default"}>
                        {tech.workloadPercentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={tech.workloadPercentage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Solicitudes Críticas
              </CardTitle>
              <CardDescription>
                Solicitudes vencidas y de alta prioridad que requieren atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests
                  .filter(r => 
                    r.priority === 'urgent' || 
                    (r.scheduled_date && isAfter(new Date(), parseISO(r.scheduled_date)) && !['completed', 'cancelled'].includes(r.status))
                  )
                  .sort((a, b) => {
                    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
                    if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                  })
                  .map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{request.service_type.replace('_', ' ')}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {request.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cliente: {request.clients?.name}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
                            {request.priority}
                          </Badge>
                          <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      {request.scheduled_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Programada: {format(new Date(request.scheduled_date), 'dd MMM yyyy HH:mm', { locale: es })}
                          </span>
                          {isAfter(new Date(), parseISO(request.scheduled_date)) && (
                            <Badge variant="destructive" className="ml-2">Vencida</Badge>
                          )}
                        </div>
                      )}
                      {request.assigned_technician && (
                        <div className="text-sm text-muted-foreground">
                          Asignado a: {request.assigned_technician.name}
                        </div>
                      )}
                    </div>
                  ))}
                {requests.filter(r => 
                  r.priority === 'urgent' || 
                  (r.scheduled_date && isAfter(new Date(), parseISO(r.scheduled_date)) && !['completed', 'cancelled'].includes(r.status))
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No hay solicitudes críticas en este momento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;