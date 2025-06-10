
import React from 'react';
import StatusCard from './StatusCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { DashboardStats, RequestStatus, RequestType, Priority } from '@/types';

// Mock dashboard statistics
const mockStats: DashboardStats = {
  totalRequests: 45,
  pendingRequests: 12,
  inProgressRequests: 18,
  completedRequests: 15,
  overdueRequests: 3,
  activeUsers: 8,
  avgCompletionTime: 4.2,
  requestsByType: {
    [RequestType.MAINTENANCE]: 20,
    [RequestType.INSPECTION]: 12,
    [RequestType.INSTALLATION]: 8,
    [RequestType.REPAIR]: 4,
    [RequestType.EMERGENCY]: 1
  },
  requestsByPriority: {
    [Priority.CRITICAL]: 2,
    [Priority.HIGH]: 8,
    [Priority.MEDIUM]: 25,
    [Priority.LOW]: 10
  }
};

const RequestsDashboardOverview = () => {
  const completionRate = Math.round((mockStats.completedRequests / mockStats.totalRequests) * 100);
  
  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total Solicitudes"
          value={mockStats.totalRequests}
          icon={ClipboardList}
          status="info"
          change={{
            value: 12,
            trend: "up"
          }}
        />
        
        <StatusCard
          title="Pendientes"
          value={mockStats.pendingRequests}
          icon={Clock}
          status="warning"
          change={{
            value: 2,
            trend: "down"
          }}
        />
        
        <StatusCard
          title="En Progreso"
          value={mockStats.inProgressRequests}
          icon={TrendingUp}
          status="info"
          change={{
            value: 5,
            trend: "up"
          }}
        />
        
        <StatusCard
          title="Completadas"
          value={mockStats.completedRequests}
          icon={CheckCircle}
          status="success"
          change={{
            value: 8,
            trend: "up"
          }}
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard
          title="Solicitudes Vencidas"
          value={mockStats.overdueRequests}
          icon={AlertCircle}
          status="danger"
        />
        
        <StatusCard
          title="Usuarios Activos"
          value={mockStats.activeUsers}
          icon={Users}
          status="neutral"
        />
        
        <StatusCard
          title="Tiempo Promedio (días)"
          value={mockStats.avgCompletionTime}
          icon={Calendar}
          status="neutral"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockStats.requestsByType).map(([type, count]) => {
                const percentage = Math.round((count / mockStats.totalRequests) * 100);
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Requests by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes por Prioridad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockStats.requestsByPriority).map(([priority, count]) => {
                const percentage = Math.round((count / mockStats.totalRequests) * 100);
                const getColor = (p: string) => {
                  switch (p) {
                    case Priority.CRITICAL: return 'bg-red-500';
                    case Priority.HIGH: return 'bg-orange-500';
                    case Priority.MEDIUM: return 'bg-blue-500';
                    case Priority.LOW: return 'bg-green-500';
                    default: return 'bg-gray-500';
                  }
                };
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{priority}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getColor(priority)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Tasa de Completación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{mockStats.avgCompletionTime}</div>
              <div className="text-sm text-muted-foreground">Días Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{mockStats.overdueRequests}</div>
              <div className="text-sm text-muted-foreground">Solicitudes Vencidas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsDashboardOverview;
