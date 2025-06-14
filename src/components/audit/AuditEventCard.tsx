
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuditEvent, AuditEventType, AuditSeverity } from '@/types/audit';
import { 
  User, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Shield,
  FileText,
  Clock
} from 'lucide-react';

interface AuditEventCardProps {
  event: AuditEvent;
}

const getEventIcon = (type: AuditEventType) => {
  switch (type) {
    case AuditEventType.LOGIN:
    case AuditEventType.LOGOUT:
      return User;
    case AuditEventType.USER_CREATED:
    case AuditEventType.USER_UPDATED:
      return User;
    case AuditEventType.USER_DELETED:
      return XCircle;
    case AuditEventType.ROLE_CHANGED:
    case AuditEventType.PERMISSION_CHANGED:
      return Shield;
    case AuditEventType.REQUEST_APPROVED:
      return CheckCircle;
    case AuditEventType.REQUEST_REJECTED:
      return XCircle;
    case AuditEventType.SYSTEM_ERROR:
      return AlertTriangle;
    case AuditEventType.CONFIG_CHANGED:
      return Settings;
    default:
      return FileText;
  }
};

const getSeverityColor = (severity: AuditSeverity) => {
  switch (severity) {
    case AuditSeverity.LOW:
      return 'secondary';
    case AuditSeverity.MEDIUM:
      return 'outline';
    case AuditSeverity.HIGH:
      return 'default';
    case AuditSeverity.CRITICAL:
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getSeverityLabel = (severity: AuditSeverity) => {
  switch (severity) {
    case AuditSeverity.LOW:
      return 'Baja';
    case AuditSeverity.MEDIUM:
      return 'Media';
    case AuditSeverity.HIGH:
      return 'Alta';
    case AuditSeverity.CRITICAL:
      return 'Crítica';
    default:
      return severity;
  }
};

const getEventTypeLabel = (type: AuditEventType) => {
  const labels = {
    [AuditEventType.LOGIN]: 'Inicio de sesión',
    [AuditEventType.LOGOUT]: 'Cierre de sesión',
    [AuditEventType.USER_CREATED]: 'Usuario creado',
    [AuditEventType.USER_UPDATED]: 'Usuario actualizado',
    [AuditEventType.USER_DELETED]: 'Usuario eliminado',
    [AuditEventType.ROLE_CHANGED]: 'Cambio de rol',
    [AuditEventType.PERMISSION_CHANGED]: 'Cambio de permisos',
    [AuditEventType.REQUEST_CREATED]: 'Solicitud creada',
    [AuditEventType.REQUEST_APPROVED]: 'Solicitud aprobada',
    [AuditEventType.REQUEST_REJECTED]: 'Solicitud rechazada',
    [AuditEventType.CLIENT_CREATED]: 'Cliente creado',
    [AuditEventType.CLIENT_UPDATED]: 'Cliente actualizado',
    [AuditEventType.CLIENT_DELETED]: 'Cliente eliminado',
    [AuditEventType.SYSTEM_ERROR]: 'Error del sistema',
    [AuditEventType.BACKUP_CREATED]: 'Backup creado',
    [AuditEventType.BACKUP_FAILED]: 'Backup falló',
    [AuditEventType.CONFIG_CHANGED]: 'Configuración cambiada'
  };
  return labels[type] || type;
};

const AuditEventCard: React.FC<AuditEventCardProps> = ({ event }) => {
  const IconComponent = getEventIcon(event.type);
  const severityColor = getSeverityColor(event.severity);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            event.severity === AuditSeverity.CRITICAL ? 'bg-red-100 text-red-600' :
            event.severity === AuditSeverity.HIGH ? 'bg-orange-100 text-orange-600' :
            event.severity === AuditSeverity.MEDIUM ? 'bg-yellow-100 text-yellow-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant={severityColor} className="text-xs">
                  {getSeverityLabel(event.severity)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {event.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {event.userName} ({event.userRole})
                </span>
                {event.ipAddress && (
                  <span>IP: {event.ipAddress}</span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(event.timestamp).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
            
            {(event.changes || event.metadata) && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                {event.changes && (
                  <div>
                    <span className="font-medium">Cambios:</span>
                    {Object.entries(event.changes).map(([key, change]) => (
                      <div key={key} className="ml-2">
                        {key}: <span className="text-red-600">{change.old}</span> → <span className="text-green-600">{change.new}</span>
                      </div>
                    ))}
                  </div>
                )}
                {event.metadata && (
                  <div>
                    <span className="font-medium">Metadatos:</span>
                    <div className="ml-2">
                      {JSON.stringify(event.metadata, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditEventCard;
