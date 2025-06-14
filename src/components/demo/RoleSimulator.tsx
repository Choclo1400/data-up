
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Shield, 
  Settings, 
  Crown,
  Eye,
  ArrowRight,
  Info
} from 'lucide-react';

const RoleSimulator: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || UserRole.OPERATOR);

  const roleConfigs = {
    [UserRole.ADMIN]: {
      icon: <Crown className="w-5 h-5" />,
      color: 'bg-red-100 text-red-800',
      description: 'Acceso completo al sistema',
      permissions: [
        'Gestión completa de usuarios',
        'Configuración del sistema',
        'Acceso a auditoría',
        'Gestión de backups',
        'Todas las funcionalidades'
      ],
      navigation: [
        'Dashboard',
        'Solicitudes',
        'Usuarios',
        'Técnicos',
        'Clientes',
        'Reportes',
        'Auditoría',
        'Configuración'
      ],
      restrictions: []
    },
    [UserRole.SUPERVISOR]: {
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800',
      description: 'Supervisión y aprobación de operaciones',
      permissions: [
        'Aprobar/rechazar solicitudes',
        'Asignar técnicos',
        'Ver reportes de desempeño',
        'Gestionar operaciones'
      ],
      navigation: [
        'Dashboard',
        'Solicitudes',
        'Pendientes de Aprobación',
        'Técnicos',
        'Operaciones',
        'Reportes'
      ],
      restrictions: [
        'No puede gestionar usuarios',
        'No accede a configuración del sistema',
        'No puede ver auditoría completa'
      ]
    },
    [UserRole.MANAGER]: {
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800',
      description: 'Gestión de clientes y reportes',
      permissions: [
        'Gestionar clientes',
        'Ver reportes completos',
        'Revisar rendimiento',
        'Aprobar presupuestos'
      ],
      navigation: [
        'Dashboard',
        'Clientes',
        'Reportes',
        'Analytics',
        'Servicios'
      ],
      restrictions: [
        'No puede gestionar usuarios',
        'No accede a configuración técnica',
        'No puede asignar técnicos directamente'
      ]
    },
    [UserRole.OPERATOR]: {
      icon: <User className="w-5 h-5" />,
      color: 'bg-gray-100 text-gray-800',
      description: 'Operaciones básicas y consultas',
      permissions: [
        'Crear solicitudes',
        'Ver sus solicitudes',
        'Actualizar información básica',
        'Recibir notificaciones'
      ],
      navigation: [
        'Dashboard',
        'Mis Solicitudes',
        'Nueva Solicitud',
        'Perfil'
      ],
      restrictions: [
        'No puede aprobar solicitudes',
        'No accede a gestión de usuarios',
        'No puede ver información de otros operadores',
        'No accede a reportes avanzados'
      ]
    }
  };

  const currentConfig = roleConfigs[selectedRole];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Simulador de Vistas por Rol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(roleConfigs).map(([role, config]) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                onClick={() => setSelectedRole(role as UserRole)}
                className="flex items-center gap-2 h-auto p-4"
              >
                {config.icon}
                <div className="text-left">
                  <div className="font-medium">{role}</div>
                  <div className="text-xs opacity-70">{config.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {user?.role !== selectedRole && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Estás simulando la vista del rol <strong>{selectedRole}</strong>. 
                Tu rol actual es <strong>{user?.role}</strong>.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Navegación disponible */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegación Disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentConfig.navigation.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Permisos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permisos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentConfig.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{permission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Restricciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Restricciones</CardTitle>
              </CardHeader>
              <CardContent>
                {currentConfig.restrictions.length > 0 ? (
                  <ul className="space-y-2">
                    {currentConfig.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin restricciones específicas</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Badge del rol actual */}
          <div className="mt-6 text-center">
            <Badge className={`${currentConfig.color} text-lg px-4 py-2`}>
              {currentConfig.icon}
              <span className="ml-2">{selectedRole}</span>
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              {currentConfig.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSimulator;
