import { useState } from 'react';
import { TechnicalRequest, RequestType, RequestStatus, Priority, ApprovalAction } from '@/types/requests';
import { toast } from 'sonner';

// Simulamos llamadas a la API REST con MongoDB
export const useRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (requestData: Partial<TechnicalRequest>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulamos llamada a API REST
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: TechnicalRequest = {
        id: `REQ-${Date.now()}`,
        requestNumber: `SOL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        type: requestData.type || RequestType.MAINTENANCE,
        status: RequestStatus.PENDING_MANAGER,
        priority: requestData.priority || Priority.MEDIUM,
        title: requestData.title || '',
        description: requestData.description || '',
        clientId: requestData.clientId || '',
        clientName: requestData.clientName || '',
        clientType: requestData.clientType || 'OTHER' as any,
        location: requestData.location || '',
        requestedDate: requestData.requestedDate || new Date().toISOString().split('T')[0],
        scheduledDate: requestData.scheduledDate,
        estimatedHours: requestData.estimatedHours || 4,
        equipmentRequired: requestData.equipmentRequired || [],
        materials: requestData.materials || [],
        createdBy: 'empleado@inmel.cl',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        attachments: []
      };
      
      console.log('Solicitud creada:', newRequest);
      
      // Notificación de éxito
      toast.success('Solicitud Creada', {
        description: `Solicitud ${newRequest.requestNumber} enviada para revisión del Gestor`
      });
      
      return newRequest;
    } catch (err) {
      setError('Error al crear la solicitud');
      toast.error('Error', {
        description: 'No se pudo crear la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingManager = async (): Promise<TechnicalRequest[]> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos solicitudes pendientes para el gestor
      const mockPendingRequests: TechnicalRequest[] = [
        {
          id: "REQ-MGR-001",
          requestNumber: "SOL-2024-001",
          type: RequestType.INSTALLATION,
          status: RequestStatus.PENDING_MANAGER,
          priority: Priority.HIGH,
          title: "Instalación de medidor inteligente - Sector Las Condes",
          description: "Instalación de medidor inteligente en sector residencial según especificaciones técnicas de Enel",
          clientId: "CLI-001",
          clientName: "Enel Distribución Chile",
          clientType: "ENEL" as any,
          location: "Las Condes, RM",
          requestedDate: "2024-06-12",
          scheduledDate: "2024-06-15",
          estimatedHours: 4,
          equipmentRequired: ["Medidor inteligente", "Herramientas básicas"],
          materials: ["Cable 2x10", "Conectores"],
          createdBy: "empleado@inmel.cl",
          createdDate: "2024-06-10T08:00:00Z",
          updatedDate: "2024-06-10T08:00:00Z",
          attachments: []
        },
        {
          id: "REQ-MGR-002",
          requestNumber: "SOL-2024-002",
          type: RequestType.EMERGENCY,
          status: RequestStatus.PENDING_MANAGER,
          priority: Priority.CRITICAL,
          title: "Reparación urgente de falla eléctrica",
          description: "Falla en línea de distribución que afecta a 200 clientes en sector industrial",
          clientId: "CLI-002",
          clientName: "CGE Distribución",
          clientType: "CGE" as any,
          location: "Rancagua, VI Región",
          requestedDate: "2024-06-11",
          estimatedHours: 8,
          equipmentRequired: ["Grúa", "Equipo de emergencia"],
          materials: ["Conductor", "Aisladores"],
          createdBy: "empleado2@inmel.cl",
          createdDate: "2024-06-11T15:45:00Z",
          updatedDate: "2024-06-11T15:45:00Z",
          attachments: []
        }
      ];
      
      return mockPendingRequests;
    } catch (err) {
      setError('Error al cargar solicitudes pendientes del gestor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSupervisor = async (): Promise<TechnicalRequest[]> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos solicitudes pendientes para el supervisor
      const mockPendingRequests: TechnicalRequest[] = [
        {
          id: "REQ-SUP-001",
          requestNumber: "SOL-2024-003",
          type: RequestType.MAINTENANCE,
          status: RequestStatus.PENDING_SUPERVISOR,
          priority: Priority.MEDIUM,
          title: "Mantenimiento preventivo transformador 500kVA",
          description: "Revisión y mantenimiento preventivo de transformador de distribución según cronograma anual",
          clientId: "CLI-003",
          clientName: "Saesa",
          clientType: "SAESA" as any,
          location: "Temuco, IX Región",
          requestedDate: "2024-06-13",
          scheduledDate: "2024-06-18",
          estimatedHours: 6,
          equipmentRequired: ["Equipo de medición", "Herramientas especializadas"],
          materials: ["Aceite dieléctrico", "Juntas"],
          createdBy: "empleado@inmel.cl",
          createdDate: "2024-06-12T10:00:00Z",
          updatedDate: "2024-06-12T14:30:00Z",
          approvedByManager: "gestor@inmel.cl",
          managerApprovalDate: "2024-06-12T14:30:00Z",
          attachments: []
        }
      ];
      
      return mockPendingRequests;
    } catch (err) {
      setError('Error al cargar solicitudes pendientes del supervisor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveManager = async (requestId: string, comments?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Solicitud aprobada por gestor:', requestId, 'Comentarios:', comments);
      
      toast.success('Solicitud Aprobada por Gestor', {
        description: 'La solicitud ha sido enviada para revisión del Supervisor'
      });
      
    } catch (err) {
      setError('Error al aprobar la solicitud');
      toast.error('Error', {
        description: 'No se pudo aprobar la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveSupervisor = async (requestId: string, comments?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Solicitud aprobada por supervisor:', requestId, 'Comentarios:', comments);
      
      toast.success('Proceso Completado', {
        description: 'La solicitud ha sido aprobada completamente y está lista para asignación'
      });
      
    } catch (err) {
      setError('Error al aprobar la solicitud');
      toast.error('Error', {
        description: 'No se pudo aprobar la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (requestId: string, reason: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Solicitud rechazada:', requestId, 'Motivo:', reason);
      
      toast.error('Solicitud Rechazada', {
        description: `Motivo: ${reason}`
      });
      
    } catch (err) {
      setError('Error al rechazar la solicitud');
      toast.error('Error', {
        description: 'No se pudo rechazar la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateScheduleConflict = async (requestedDate: string, estimatedHours: number): Promise<boolean> => {
    // Simulamos validación de conflictos de fechas
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulamos que hay conflicto en fechas específicas
    const conflictDates = ['2024-06-15', '2024-06-20'];
    const hasConflict = conflictDates.includes(requestedDate);
    
    if (hasConflict) {
      toast.warning('Conflicto de Fechas', {
        description: 'Ya existe una solicitud programada para esta fecha. Seleccione otra fecha.'
      });
    }
    
    return hasConflict;
  };

  const updateRequest = async (id: string, requestData: Partial<TechnicalRequest>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Solicitud actualizada:', id, requestData);
      
      toast.success('Solicitud Actualizada', {
        description: 'Los cambios han sido guardados exitosamente'
      });
      
      return { ...requestData, id, updatedDate: new Date().toISOString() };
    } catch (err) {
      setError('Error al actualizar la solicitud');
      toast.error('Error', {
        description: 'No se pudo actualizar la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Solicitud eliminada:', id);
      
      toast.success('Solicitud Eliminada', {
        description: 'La solicitud ha sido eliminada correctamente'
      });
      
      return true;
    } catch (err) {
      setError('Error al eliminar la solicitud');
      toast.error('Error', {
        description: 'No se pudo eliminar la solicitud. Intente nuevamente.'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    updateRequest,
    deleteRequest,
    fetchPendingManager,
    fetchPendingSupervisor,
    approveManager,
    approveSupervisor,
    rejectRequest,
    validateScheduleConflict,
    loading,
    error
  };
};
