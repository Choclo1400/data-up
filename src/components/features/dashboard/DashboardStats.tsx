import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { useRequestStatistics, useOverdueRequests } from '@/hooks/data/useServiceRequests';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';

export function DashboardStats() {
  const { data: statusCounts, isLoading: loadingStats } = useRequestStatistics();
  const { data: overdueRequests, isLoading: loadingOverdue } = useOverdueRequests();

  if (loadingStats || loadingOverdue) {
    return <LoadingState isLoading={true} children={null} />;
  }

  const totalRequests = statusCounts ? Object.values(statusCounts).reduce((sum, count) => sum + count, 0) : 0;
  const newRequests = statusCounts?.['Nueva'] || 0;
  const inProgress = statusCounts?.['En Proceso'] || 0;
  const completed = statusCounts?.['Completada'] || 0;
  const pendingManager = statusCounts?.['Pendiente Gestor'] || 0;
  const pendingSupervisor = statusCounts?.['Pendiente Supervisor'] || 0;
  const overdueCount = overdueRequests?.length || 0;

  const statsCards = [
    {
      title: 'Total de Solicitudes',
      value: totalRequests,
      icon: FileText,
      description: 'Solicitudes totales en el sistema',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Solicitudes Nuevas',
      value: newRequests,
      icon: Zap,
      description: 'Esperando validación',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'En Proceso',
      value: inProgress,
      icon: Clock,
      description: 'Siendo trabajadas actualmente',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completadas',
      value: completed,
      icon: CheckCircle,
      description: 'Solicitudes finalizadas',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pendiente Gestor',
      value: pendingManager,
      icon: Users,
      description: 'Esperando aprobación del gestor',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pendiente Supervisor',
      value: pendingSupervisor,
      icon: TrendingUp,
      description: 'Esperando asignación de técnico',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Solicitudes Vencidas',
      value: overdueCount,
      icon: AlertTriangle,
      description: 'Pasaron la fecha programada',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estado de Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusCounts && Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      status === 'Completada' ? 'default' :
                      status === 'Nueva' ? 'secondary' :
                      status.includes('Pendiente') ? 'outline' :
                      status === 'En Proceso' ? 'default' : 'outline'
                    }
                  >
                    {status}
                  </Badge>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overdue Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Solicitudes Vencidas ({overdueCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueRequests && overdueRequests.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {overdueRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{request.service_type}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(request as any).clients?.name || 'Cliente no asignado'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">
                            Programada: {new Date(request.scheduled_date!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {overdueCount > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Y {overdueCount - 5} solicitudes más...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No hay solicitudes vencidas</p>
                <p className="text-xs">¡Excelente trabajo!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}