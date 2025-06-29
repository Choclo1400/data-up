import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Users, 
  UserCheck, 
  ClipboardList, 
  Settings, 
  FileText,
  Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Solicitudes', href: '/requests', icon: ClipboardList },
  { name: 'Clientes', href: '/clients', icon: Building2 },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Técnicos', href: '/technicians', icon: UserCheck },
  { name: 'Reportes', href: '/reports', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Sistema de Gestión</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar