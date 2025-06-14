
import { useState } from 'react';
import { AuditEvent, AuditEventType, AuditSeverity, AuditFilters } from '@/types/audit';

// Datos de muestra para eventos de auditoría
const sampleAuditEvents: AuditEvent[] = [
  {
    id: 'AUDIT-001',
    type: AuditEventType.LOGIN,
    severity: AuditSeverity.LOW,
    title: 'Inicio de sesión exitoso',
    description: 'Usuario ingresó al sistema correctamente',
    userId: 'user-1',
    userName: 'Admin Sistema',
    userRole: 'ADMIN',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    ipAddress: '192.168.1.100'
  },
  {
    id: 'AUDIT-002',
    type: AuditEventType.USER_CREATED,
    severity: AuditSeverity.MEDIUM,
    title: 'Usuario creado',
    description: 'Se creó un nuevo usuario en el sistema',
    userId: 'user-1',
    userName: 'Admin Sistema',
    userRole: 'ADMIN',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    entityType: 'user',
    entityId: 'user-5',
    metadata: { newUserEmail: 'nuevo@inmel.cl', newUserRole: 'OPERATOR' }
  },
  {
    id: 'AUDIT-003',
    type: AuditEventType.ROLE_CHANGED,
    severity: AuditSeverity.HIGH,
    title: 'Cambio de rol de usuario',
    description: 'Se modificó el rol de un usuario',
    userId: 'user-1',
    userName: 'Admin Sistema',
    userRole: 'ADMIN',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    entityType: 'user',
    entityId: 'user-2',
    changes: {
      role: { old: 'OPERATOR', new: 'SUPERVISOR' }
    }
  },
  {
    id: 'AUDIT-004',
    type: AuditEventType.SYSTEM_ERROR,
    severity: AuditSeverity.CRITICAL,
    title: 'Error crítico del sistema',
    description: 'Fallo en la conexión con la base de datos',
    userId: 'system',
    userName: 'Sistema',
    userRole: 'SYSTEM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    metadata: { errorCode: 'DB_CONNECTION_FAILED', component: 'DatabaseService' }
  },
  {
    id: 'AUDIT-005',
    type: AuditEventType.REQUEST_APPROVED,
    severity: AuditSeverity.MEDIUM,
    title: 'Solicitud aprobada',
    description: 'Se aprobó una solicitud técnica',
    userId: 'user-2',
    userName: 'Juan Supervisor',
    userRole: 'SUPERVISOR',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    entityType: 'request',
    entityId: 'REQ-2024-001',
    metadata: { requestTitle: 'Mantenimiento preventivo grúa horquilla' }
  }
];

export const useAudit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuditEvents = async (filters?: AuditFilters): Promise<AuditEvent[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredEvents = [...sampleAuditEvents];
      
      if (filters) {
        if (filters.dateFrom) {
          filteredEvents = filteredEvents.filter(event => 
            new Date(event.timestamp) >= filters.dateFrom!
          );
        }
        
        if (filters.dateTo) {
          filteredEvents = filteredEvents.filter(event => 
            new Date(event.timestamp) <= filters.dateTo!
          );
        }
        
        if (filters.userId) {
          filteredEvents = filteredEvents.filter(event => 
            event.userId === filters.userId
          );
        }
        
        if (filters.eventType) {
          filteredEvents = filteredEvents.filter(event => 
            event.type === filters.eventType
          );
        }
        
        if (filters.severity) {
          filteredEvents = filteredEvents.filter(event => 
            event.severity === filters.severity
          );
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.userName.toLowerCase().includes(searchLower)
          );
        }
      }
      
      // Ordenar por fecha descendente
      filteredEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return filteredEvents;
    } catch (err) {
      setError('Error al cargar eventos de auditoría');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logAuditEvent = async (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEvent: AuditEvent = {
        ...event,
        id: `AUDIT-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      console.log('Evento de auditoría registrado:', newEvent);
      return newEvent;
    } catch (err) {
      setError('Error al registrar evento de auditoría');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAuditEvents,
    logAuditEvent,
    loading,
    error
  };
};
