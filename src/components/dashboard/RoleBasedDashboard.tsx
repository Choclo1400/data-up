
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  BarChart3, 
  Users, 
  Wrench, 
  ClipboardList, 
  Settings, 
  Building2,
  Calendar,
  FileText,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleBasedDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getRoleConfig = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return {
          title: 'Panel de Administración',
          description: 'Control total del sistema y gestión de usuarios',
          color: 'bg-red-50 border-red-200',
          badgeColor: 'bg-red-600',
          quickActions: [
            { label: 'Gestionar Usuarios', icon: Users, action: () => navigate('/users'), permission: 'manage_users' },
            { label: 'Configuración', icon: Settings, action: () => navigate('/settings'), permission: 'system_config' },
            { label: 'Auditoría', icon: FileText, action: () => navigate('/audit'), permission: 'view_audit' },
            { label: 'Respaldos', icon: Settings, action: () => navigate('/settings'), permission: 'system_config' }
          ],
          stats: [
            { label: 'Total Usuarios', value: '24', icon: Users },
            { label: 'Solicitudes Activas', value: '12', icon: ClipboardList },
            { label: 'Sistema', value: 'Operativo', icon: CheckCircle, color: 'text-green-600' }
          ]
        };

      case UserRole.SUPERVISOR:
        return {
          title: 'Panel de Supervisión',
          description: 'Supervisión de operaciones y aprobación de solicitudes',
          color: 'bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-600',
          quickActions: [
            { label: 'Aprobar Solicitudes', icon: CheckCircle, action: () => navigate('/requests/pending-supervisor'), permission: 'approve_requests' },
            { label: 'Gestionar Técnicos', icon: Wrench, action: () => navigate('/technicians'), permission: 'manage_technicians' },
            { label: 'Ver Reportes', icon: BarChart3, action: () => navigate('/reports'), permission: 'view_reports' },
            { label: 'Calendario', icon: Calendar, action: () => navigate('/calendar'), permission: 'view_calendar' }
          ],
          stats: [
            { label: 'Pendientes Aprobación', value: '5', icon: AlertTriangle, color: 'text-orange-600' },
            { label: 'Técnicos Activos', value: '8', icon: Wrench },
            { label: 'Solicitudes Hoy', value: '3', icon: ClipboardList }
          ]
        };

      case UserRole.MANAGER:
        return {
          title: 'Panel de Gestión',
          description: 'Gestión operativa y seguimiento de proyectos',
          color: 'bg-green-50 border-green-200',
          badgeColor: 'bg-green-600',
          quickActions: [
            { label: 'Revisar Solicitudes', icon: Eye, action: () => navigate('/requests/pending-manager'), permission: 'approve_manager' },
            { label: 'Ver Reportes', icon: BarChart3, action: () => navigate('/reports'), permission: 'view_reports' },
            { label: 'Gestionar Clientes', icon: Building2, action: () => navigate('/clients'), permission: 'manage_clients' },
            { label: 'Nueva Solicitud', icon: Plus, action: () => navigate('/requests/new'), permission: 'create_requests' }
          ],
          stats: [
            { label: 'Solicitudes Mes', value: '28', icon: ClipboardList },
            { label: 'Clientes Activos', value: '15', icon: Building2 },
            { label: 'Proyectos', value: '7', icon: FileText }
          ]
        };

      case UserRole.OPERATOR:
        return {
          title: 'Panel de Operador',
          description: 'Creación de solicitudes y seguimiento de trabajos',
          color: 'bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-600',
          quickActions: [
            { label: 'Nueva Solicitud', icon: Plus, action: () => navigate('/requests/new'), permission: 'create_requests' },
            { label: 'Mis Solicitudes', icon: ClipboardList, action: () => navigate('/requests'), permission: 'view_requests' },
            { label: 'Calendario', icon: Calendar, action: () => navigate('/calendar'), permission: 'view_calendar' },
            { label: 'Mi Perfil', icon: Users, action: () => navigate('/profile') }
          ],
          stats: [
            { label: 'Mis Solicitudes', value: '4', icon: ClipboardList },
            { label: 'En Proceso', value: '2', icon: AlertTriangle, color: 'text-blue-600' },
            { label: 'Completadas', value: '12', icon: CheckCircle, color: 'text-green-600' }
          ]
        };

      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className="space-y-6">
      {/* Header del rol */}
      <Card className={config.color}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </div>
            <Badge className={`${config.badgeColor} text-white`}>
              {user.role}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {config.stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color || 'text-muted-foreground'}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas disponibles para tu rol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {config.quickActions.map((action, index) => {
              const canAccess = !action.permission || hasPermission(action.permission);
              
              return (
                <Button
                  key={index}
                  variant={canAccess ? "outline" : "secondary"}
                  className={`h-20 flex-col gap-2 ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={canAccess ? action.action : undefined}
                  disabled={!canAccess}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleBasedDashboard;
