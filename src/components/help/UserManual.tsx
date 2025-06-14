
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  FileText, 
  Settings, 
  Shield, 
  Wrench, 
  Eye,
  ListChecks
} from 'lucide-react';

const UserManual: React.FC = () => {
  const { user } = useAuth();

  const getManualContent = () => {
    if (!user) return [];

    const commonSections = [
      {
        title: 'Primeros Pasos',
        icon: User,
        content: [
          'Accede al sistema con tu usuario y contraseña',
          'Completa tu perfil en la sección "Perfil"',
          'Configura tu autenticación de dos factores (recomendado)',
          'Familiarízate con la navegación principal'
        ]
      },
      {
        title: 'Navegación',
        icon: ListChecks,
        content: [
          'Utiliza el menú lateral para acceder a las diferentes secciones',
          'El dashboard muestra un resumen de tu actividad',
          'Usa el buscador en la barra superior para encontrar información rápidamente',
          'Las notificaciones aparecen en el icono de campana'
        ]
      }
    ];

    const roleSections: Record<string, any[]> = {
      ADMIN: [
        {
          title: 'Gestión de Usuarios',
          icon: Shield,
          content: [
            'Crear nuevos usuarios y asignar roles',
            'Modificar permisos y accesos',
            'Desactivar o eliminar usuarios',
            'Revisar logs de actividad de usuarios'
          ]
        },
        {
          title: 'Configuración del Sistema',
          icon: Settings,
          content: [
            'Configurar parámetros generales',
            'Gestionar copias de seguridad',
            'Configurar notificaciones del sistema',
            'Administrar integraciones externas'
          ]
        }
      ],
      OPERATOR: [
        {
          title: 'Gestión de Solicitudes',
          icon: FileText,
          content: [
            'Crear nuevas solicitudes de servicio',
            'Seguir el estado de tus solicitudes',
            'Adjuntar documentos y comentarios',
            'Recibir notificaciones de actualizaciones'
          ]
        }
      ],
      TECHNICIAN: [
        {
          title: 'Trabajo en Campo',
          icon: Wrench,
          content: [
            'Ver solicitudes asignadas',
            'Actualizar el progreso de trabajos',
            'Subir evidencias fotográficas',
            'Registrar tiempo y materiales utilizados'
          ]
        }
      ],
      SUPERVISOR: [
        {
          title: 'Supervisión de Operaciones',
          icon: Eye,
          content: [
            'Aprobar o rechazar solicitudes',
            'Asignar técnicos a trabajos',
            'Supervisar el progreso de proyectos',
            'Generar reportes de desempeño'
          ]
        }
      ]
    };

    return [...commonSections, ...(roleSections[user.role] || [])];
  };

  const sections = getManualContent();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Manual de Usuario</h2>
          <p className="text-muted-foreground">
            Guía completa para usar el sistema según tu rol
          </p>
        </div>
        {user && (
          <Badge variant="outline" className="ml-auto">
            {user.role}
          </Badge>
        )}
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManual;
