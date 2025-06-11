
import React from 'react';
import StatusCard from './StatusCard';
import { 
  ClipboardList, Users, AlertTriangle, CheckCircle, 
  Clock, UserCheck, Settings, Calendar, Building2, BarChart3
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Datos mock para solicitudes técnicas
const initialStats: DashboardStats = {
  // Métricas de solicitudes técnicas
  totalRequests: 156,
  newRequests: 23,
  inProgressRequests: 45,
  completedRequests: 88,
  overdueRequests: 8,
  
  // Métricas de técnicos
  totalTechnicians: 28,
  availableTechnicians: 15,
  busyTechnicians: 13,
  techniciansWithValidCertificates: 24,
  techniciansWithWarningCertificates: 3,
  techniciansWithExpiredCertificates: 1,
  
  // Métricas de clientes
  totalClients: 12,
  activeClients: 10,
  
  // Métricas operacionales
  averageCompletionTime: 4.2,
  pendingValidations: 6
};

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = initialStats 
}) => {
  return (
    <section className="space-y-6">
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">Estado de Solicitudes Técnicas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Solicitudes" 
            value={stats.totalRequests} 
            icon={ClipboardList} 
            status="info" 
          />
          <StatusCard 
            title="En Proceso" 
            value={stats.inProgressRequests} 
            icon={Settings} 
            status="success"
            change={{ value: 12, trend: 'up' }}
          />
          <StatusCard 
            title="Nuevas" 
            value={stats.newRequests} 
            icon={Clock} 
            status="warning" 
          />
          <StatusCard 
            title="Vencidas" 
            value={stats.overdueRequests} 
            icon={AlertTriangle} 
            status="danger" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Estado de Técnicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Técnicos" 
            value={stats.totalTechnicians} 
            icon={UserCheck} 
            status="info" 
          />
          <StatusCard 
            title="Disponibles" 
            value={stats.availableTechnicians} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Ocupados" 
            value={stats.busyTechnicians} 
            icon={Users} 
            status="warning" 
          />
          <StatusCard 
            title="Cert. Por Vencer" 
            value={stats.techniciansWithWarningCertificates} 
            icon={AlertTriangle} 
            status="warning" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-2xl font-semibold mb-4">Métricas Operacionales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Tiempo Promedio (días)" 
            value={stats.averageCompletionTime} 
            icon={BarChart3} 
            status="info"
            change={{ value: 8, trend: 'down' }}
          />
          <StatusCard 
            title="Pendientes Validación" 
            value={stats.pendingValidations} 
            icon={ClipboardList} 
            status="warning" 
          />
          <StatusCard 
            title="Clientes Activos" 
            value={stats.activeClients} 
            icon={Building2} 
            status="success" 
          />
          <StatusCard 
            title="Completadas Hoy" 
            value={12} 
            icon={CheckCircle} 
            status="success"
            change={{ value: 15, trend: 'up' }}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
