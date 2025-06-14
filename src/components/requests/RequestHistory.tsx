
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  User, 
  Edit, 
  CheckCircle, 
  XCircle, 
  UserPlus, 
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestHistoryEntry {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  performedByRole: string;
  performedAt: string;
  oldValue?: string;
  newValue?: string;
}

interface RequestHistoryProps {
  requestId: string;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ requestId }) => {
  // Mock data - en una aplicación real vendría de la API
  const historyEntries: RequestHistoryEntry[] = [
    {
      id: "1",
      action: "created",
      description: "Solicitud creada",
      performedBy: "Juan Pérez",
      performedByRole: "Empleado",
      performedAt: "2024-06-10T08:00:00Z"
    },
    {
      id: "2", 
      action: "status_changed",
      description: "Estado cambiado de 'Nueva' a 'Pendiente Gestor'",
      performedBy: "Sistema",
      performedByRole: "Automático",
      performedAt: "2024-06-10T08:01:00Z",
      oldValue: "Nueva",
      newValue: "Pendiente Gestor"
    },
    {
      id: "3",
      action: "approved_manager",
      description: "Aprobada por Gestor con comentarios",
      performedBy: "María González",
      performedByRole: "Gestor",
      performedAt: "2024-06-12T14:30:00Z"
    },
    {
      id: "4",
      action: "status_changed",
      description: "Estado cambiado de 'Pendiente Gestor' a 'Pendiente Supervisor'",
      performedBy: "Sistema",
      performedByRole: "Automático", 
      performedAt: "2024-06-12T14:31:00Z",
      oldValue: "Pendiente Gestor",
      newValue: "Pendiente Supervisor"
    },
    {
      id: "5",
      action: "assigned",
      description: "Técnico asignado",
      performedBy: "Carlos Rodríguez",
      performedByRole: "Supervisor",
      performedAt: "2024-06-13T09:15:00Z",
      newValue: "Roberto Silva"
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'status_changed':
        return <Settings className="w-4 h-4 text-orange-600" />;
      case 'approved_manager':
      case 'approved_supervisor':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'assigned':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-blue-50 border-blue-200';
      case 'approved_manager':
      case 'approved_supervisor':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'assigned':
        return 'bg-purple-50 border-purple-200';
      case 'status_changed':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historial de Cambios
        </CardTitle>
        <CardDescription>
          Registro cronológico de todas las acciones realizadas en esta solicitud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Línea vertical del timeline */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-4">
            {historyEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`relative flex items-start gap-4 p-4 rounded-lg border ${getActionColor(entry.action)}`}
              >
                {/* Icono del timeline */}
                <div className="flex-shrink-0 z-10 bg-background border-2 border-current rounded-full p-2">
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{entry.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.performedAt), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{entry.performedBy}</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.performedByRole}
                    </Badge>
                  </div>
                  
                  {(entry.oldValue || entry.newValue) && (
                    <div className="text-xs text-muted-foreground">
                      {entry.oldValue && entry.newValue ? (
                        <>
                          <span className="line-through text-red-600">{entry.oldValue}</span>
                          {' → '}
                          <span className="text-green-600 font-medium">{entry.newValue}</span>
                        </>
                      ) : entry.newValue ? (
                        <span className="text-green-600 font-medium">{entry.newValue}</span>
                      ) : null}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.performedAt).toLocaleString('es-CL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestHistory;
