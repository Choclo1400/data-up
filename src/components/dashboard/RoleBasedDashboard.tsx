
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
import { StatsSkeleton } from '@/components/ui/enhanced-skeleton';
import { useState, useEffect } from 'react';

const RoleBasedDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  const getRoleConfig = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return {
          title: 'Panel de Administración',
          description: 'Control total del sistema y gestión de usuarios',
          color: 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-red-200/50 shadow-lg',
          badgeColor: 'bg-error-600 hover:bg-error-700',
          quickActions: [
            { label: 'Gestionar Usuarios', icon: Users, action: () => navigate('/users'), permission: 'manage_users' },
            { label: 'Configuración', icon: Settings, action: () => navigate('/settings'), permission: 'system_config' },
            { label: 'Auditoría', icon: FileText, action: () => navigate('/audit'), permission: 'view_audit' },
            { label: 'Respaldos', icon: Settings, action: () => navigate('/settings'), permission: 'system_config' }
          ],
          stats: [
            { label: 'Total Usuarios', value: '24', icon: Users, color: 'text-info-600', bgColor: 'bg-info-50' },
            { label: 'Solicitudes Activas', value: '12', icon: ClipboardList, color: 'text-warning-600', bgColor: 'bg-warning-50' },
            { label: 'Sistema', value: 'Operativo', icon: CheckCircle, color: 'text-success-600', bgColor: 'bg-success-50' }
          ]
        };

      case UserRole.SUPERVISOR:
        return {
          title: 'Panel de Supervisión',
          description: 'Supervisión de operaciones y aprobación de solicitudes',
          color: 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 border-blue-200/50 shadow-lg',
          badgeColor: 'bg-info-600 hover:bg-info-700',
          quickActions: [
            { label: 'Aprobar Solicitudes', icon: CheckCircle, action: () => navigate('/requests/pending-supervisor'), permission: 'approve_requests' },
            { label: 'Gestionar Técnicos', icon: Wrench, action: () => navigate('/technicians'), permission: 'manage_technicians' },
            { label: 'Ver Reportes', icon: BarChart3, action: () => navigate('/reports'), permission: 'view_reports' },
            { label: 'Calendario', icon: Calendar, action: () => navigate('/calendar'), permission: 'view_calendar' }
          ],
          stats: [
            { label: 'Pendientes Aprobación', value: '5', icon: AlertTriangle, color: 'text-warning-600', bgColor: 'bg-warning-50' },
            { label: 'Técnicos Activos', value: '8', icon: Wrench, color: 'text-info-600', bgColor: 'bg-info-50' },
            { label: 'Solicitudes Hoy', value: '3', icon: ClipboardList, color: 'text-success-600', bgColor: 'bg-success-50' }
          ]
        };

      case UserRole.MANAGER:
        return {
          title: 'Panel de Gestión',
          description: 'Gestión operativa y seguimiento de proyectos',
          color: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200/50 shadow-lg',
          badgeColor: 'bg-success-600 hover:bg-success-700',
          quickActions: [
            { label: 'Revisar Solicitudes', icon: Eye, action: () => navigate('/requests/pending-manager'), permission: 'approve_manager' },
            { label: 'Ver Reportes', icon: BarChart3, action: () => navigate('/reports'), permission: 'view_reports' },
            { label: 'Gestionar Clientes', icon: Building2, action: () => navigate('/clients'), permission: 'manage_clients' },
            { label: 'Nueva Solicitud', icon: Plus, action: () => navigate('/requests/new'), permission: 'create_requests' }
          ],
          stats: [
            { label: 'Solicitudes Mes', value: '28', icon: ClipboardList, color: 'text-info-600', bgColor: 'bg-info-50' },
            { label: 'Clientes Activos', value: '15', icon: Building2, color: 'text-success-600', bgColor: 'bg-success-50' },
            { label: 'Proyectos', value: '7', icon: FileText, color: 'text-warning-600', bgColor: 'bg-warning-50' }
          ]
        };

      case UserRole.OPERATOR:
        return {
          title: 'Panel de Operador',
          description: 'Creación de solicitudes y seguimiento de trabajos',
          color: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200/50 shadow-lg',
          badgeColor: 'bg-warning-600 hover:bg-warning-700',
          quickActions: [
            { label: 'Nueva Solicitud', icon: Plus, action: () => navigate('/requests/new'), permission: 'create_requests' },
            { label: 'Mis Solicitudes', icon: ClipboardList, action: () => navigate('/requests'), permission: 'view_requests' },
            { label: 'Calendario', icon: Calendar, action: () => navigate('/calendar'), permission: 'view_calendar' },
            { label: 'Mi Perfil', icon: Users, action: () => navigate('/profile') }
          ],
          stats: [
            { label: 'Mis Solicitudes', value: '4', icon: ClipboardList, color: 'text-info-600', bgColor: 'bg-info-50' },
            { label: 'En Proceso', value: '2', icon: AlertTriangle, color: 'text-warning-600', bgColor: 'bg-warning-50' },
            { label: 'Completadas', value: '12', icon: CheckCircle, color: 'text-success-600', bgColor: 'bg-success-50' }
          ]
        };

      default:
        return null;
    }
  };

  const config = getRoleConfig();
  if (!config) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header del rol */}
      <Card className={cn("transition-all duration-300 hover:shadow-xl", config.color)}>
        <CardHeader className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5">
            <div className="w-full h-full bg-white rounded-full transform -translate-x-4 translate-y-4"></div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{config.title}</CardTitle>
              <CardDescription className="text-base text-gray-700 font-medium">
                {config.description}
              </CardDescription>
            </div>
            <Badge className={cn(
              "text-white shadow-md transition-all duration-200 hover:scale-105 px-4 py-2 text-sm font-semibold",
              config.badgeColor
            )}>
              {user.role}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas con loading */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.stats.map((stat, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-2xl font-bold transition-colors", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Acciones rápidas */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Acciones Rápidas</CardTitle>
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
                  className={cn(
                    "h-24 flex-col gap-3 transition-all duration-300 relative group",
                    canAccess 
                      ? "hover:scale-105 hover:shadow-md hover:border-primary/50" 
                      : "opacity-50 cursor-not-allowed",
                    "animate-scale-in"
                  )}
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  onClick={canAccess ? action.action : undefined}
                  disabled={!canAccess}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    canAccess ? "bg-primary/10 group-hover:bg-primary/20" : "bg-muted"
                  )}>
                    <action.icon className={cn(
                      "h-5 w-5 transition-colors",
                      canAccess ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <span className="text-xs text-center font-medium leading-tight">{action.label}</span>
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
