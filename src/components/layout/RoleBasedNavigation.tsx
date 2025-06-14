
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListChecks,
  Building2,
  User,
  CheckSquare,
  Users,
  BarChart,
  Calendar,
  File,
  Settings,
  Shield,
  Plus,
  Eye,
  Wrench,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
  roles?: UserRole[];
  description?: string;
}

const RoleBasedNavigation: React.FC = () => {
  const { user, hasPermission } = useAuth();

  if (!user) return null;

  // Configuración de navegación por rol
  const getNavigationItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        description: 'Panel principal'
      }
    ];

    const roleSpecificItems: Record<UserRole, NavItem[]> = {
      [UserRole.ADMIN]: [
        { name: 'Usuarios', href: '/users', icon: Users, permission: 'manage_users', description: 'Gestión de usuarios' },
        { name: 'Auditoría', href: '/audit', icon: Shield, permission: 'view_audit', description: 'Registro de auditoría' },
        { name: 'Configuración', href: '/settings', icon: Settings, permission: 'system_config', description: 'Configuración del sistema' },
        { name: 'Empleados', href: '/employees', icon: Users, permission: 'manage_employees', description: 'Gestión de empleados' },
        { name: 'Servicios', href: '/services', icon: CheckSquare, permission: 'manage_services', description: 'Gestión de servicios' },
        { name: 'Reportes', href: '/reports', icon: BarChart, permission: 'view_reports', description: 'Reportes del sistema' }
      ],
      
      [UserRole.TECHNICIAN]: [
        { name: 'Mis Asignaciones', href: '/requests', icon: Wrench, permission: 'view_requests', description: 'Solicitudes asignadas' },
        { name: 'Calendario', href: '/calendar', icon: Calendar, permission: 'view_calendar', description: 'Mi programación' },
        { name: 'Reportes', href: '/reports', icon: BarChart, permission: 'view_reports', description: 'Reportes de trabajo' }
      ],
      
      [UserRole.SUPERVISOR]: [
        { name: 'Aprobar Solicitudes', href: '/requests/pending-supervisor', icon: CheckSquare, permission: 'approve_requests', description: 'Solicitudes pendientes' },
        { name: 'Técnicos', href: '/technicians', icon: Wrench, permission: 'manage_technicians', description: 'Gestión de técnicos' },
        { name: 'Reportes', href: '/reports', icon: BarChart, permission: 'view_reports', description: 'Reportes operativos' },
        { name: 'Calendario', href: '/calendar', icon: Calendar, permission: 'view_calendar', description: 'Programación' }
      ],
      
      [UserRole.MANAGER]: [
        { name: 'Revisar Solicitudes', href: '/requests/pending-manager', icon: Eye, permission: 'approve_manager', description: 'Revisión gerencial' },
        { name: 'Clientes', href: '/clients', icon: Building2, permission: 'manage_clients', description: 'Gestión de clientes' },
        { name: 'Reportes', href: '/reports', icon: BarChart, permission: 'view_reports', description: 'Reportes gerenciales' },
        { name: 'Nueva Solicitud', href: '/requests/new', icon: Plus, permission: 'create_requests', description: 'Crear solicitud' }
      ],
      
      [UserRole.OPERATOR]: [
        { name: 'Mis Solicitudes', href: '/requests', icon: ListChecks, permission: 'view_requests', description: 'Ver mis solicitudes' },
        { name: 'Nueva Solicitud', href: '/requests/new', icon: Plus, permission: 'create_requests', description: 'Crear solicitud' },
        { name: 'Calendario', href: '/calendar', icon: Calendar, permission: 'view_calendar', description: 'Mi calendario' }
      ]
    };

    // Items comunes para todos los roles
    const commonItems: NavItem[] = [
      {
        name: 'Ayuda',
        href: '/help',
        icon: HelpCircle,
        description: 'Centro de ayuda y documentación'
      }
    ];

    // Combinar items base con items específicos del rol y items comunes
    const allItems = [...baseItems, ...roleSpecificItems[user.role], ...commonItems];

    // Filtrar por permisos
    return allItems.filter(item => !item.permission || hasPermission(item.permission));
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="space-y-1" data-tour="navigation">
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground"
            )
          }
          title={item.description}
        >
          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </NavLink>
      ))}
      
      {/* Indicador de rol */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Rol Actual
          </p>
          <p className="text-sm font-medium text-foreground mt-1">
            {user.role}
          </p>
          <p className="text-xs text-muted-foreground">
            {user.name}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;
