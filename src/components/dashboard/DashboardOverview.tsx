
import React from 'react';
import StatusCard from './StatusCard';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Building2,
  Wrench,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();

  // Mock data que simula datos reales del sistema
  const stats = {
    totalRequests: 145,
    newRequests: 12,
    inProgressRequests: 28,
    completedRequests: 105,
    overdueRequests: 3,
    totalClients: 25,
    activeTechnicians: 18,
    avgCompletionTime: 4.2
  };

  return (
    <div className="space-y-6 slide-enter">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Resumen del Sistema</h2>
          <p className="text-muted-foreground">
            Vista general de solicitudes técnicas y recursos
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Última actualización: {new Date().toLocaleTimeString('es-CL')}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Total Solicitudes"
          value={stats.totalRequests}
          icon={ClipboardList}
          status="info"
          change={{ value: 8, trend: "up" }}
        />
        
        <StatusCard
          title="Nuevas"
          value={stats.newRequests}
          icon={Clock}
          status="warning"
          change={{ value: 3, trend: "up" }}
        />
        
        <StatusCard
          title="En Progreso"
          value={stats.inProgressRequests}
          icon={Wrench}
          status="neutral"
          change={{ value: 2, trend: "down" }}
        />
        
        <StatusCard
          title="Completadas"
          value={stats.completedRequests}
          icon={CheckCircle}
          status="success"
          change={{ value: 15, trend: "up" }}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Vencidas"
          value={stats.overdueRequests}
          icon={AlertTriangle}
          status="danger"
        />
        
        <StatusCard
          title="Clientes Activos"
          value={stats.totalClients}
          icon={Building2}
          status="info"
        />
        
        <StatusCard
          title="Técnicos Disponibles"
          value={stats.activeTechnicians}
          icon={Users}
          status="success"
        />
        
        <StatusCard
          title="Tiempo Promedio (días)"
          value={stats.avgCompletionTime}
          icon={TrendingUp}
          status="neutral"
        />
      </div>

      {/* Información contextual según el rol */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Bienvenido, {user.name}
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {user.role === 'Administrador' && 'Tienes acceso completo al sistema. Puedes gestionar usuarios, servicios y todas las configuraciones.'}
            {user.role === 'Supervisor' && 'Puedes revisar y aprobar solicitudes técnicas en tu área de responsabilidad.'}
            {user.role === 'Gestor' && 'Puedes aprobar solicitudes y generar reportes del sistema.'}
            {user.role === 'Operador' && 'Puedes crear nuevas solicitudes técnicas y consultar el estado de las existentes.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
