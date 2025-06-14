import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  BarChart,
  Building2,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  ListChecks,
  Settings,
  User,
  Users,
  File,
  Shield
} from "lucide-react";
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

const Sidebar: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Solicitudes',
      href: '/requests',
      icon: ListChecks,
      permission: 'view_requests'
    },
    {
      name: 'Clientes',
      href: '/clients',
      icon: Building2,
      permission: 'manage_clients'
    },
    {
      name: 'Técnicos',
      href: '/technicians',
      icon: User,
      permission: 'manage_technicians'
    },
    {
      name: 'Servicios',
      href: '/services',
      icon: CheckSquare,
      permission: 'manage_services'
    },
    {
      name: 'Empleados',
      href: '/employees',
      icon: Users,
      permission: 'manage_employees'
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: BarChart,
      permission: 'view_reports'
    },
    {
      name: 'Calendario',
      href: '/calendar',
      icon: Calendar,
      permission: 'view_calendar'
    },
    {
      name: 'Documentos',
      href: '/documents',
      icon: File,
      permission: 'view_documents'
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: Users,
      permission: 'manage_users'
    },
    {
      name: 'Ajustes',
      href: '/settings',
      icon: Settings,
      permission: 'system_config'
    },
    {
      name: 'Auditoría',
      href: '/audit',
      icon: Shield,
      permission: 'view_audit'
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Inmel</h1>
        <p className="text-sm text-muted-foreground">
          Sistema de gestión
        </p>
      </div>
      <div className="flex-1 space-y-1">
        {navigation.map((item) => {
          if (item.permission && !hasPermission(item.permission)) {
            return null;
          }

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          {user?.name} ({user?.role})
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Abrir menú
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-20 h-full w-64 flex-col bg-background border-r flex">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;
