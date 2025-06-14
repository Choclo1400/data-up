
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAudit } from './useAudit';
import { AuditEventType, AuditSeverity } from '@/types/audit';

export interface BackupRecord {
  id: string;
  fileName: string;
  createdDate: string;
  createdBy: string;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
  type: 'manual' | 'scheduled';
  description?: string;
}

export const useBackups = () => {
  const [loading, setLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([
    {
      id: 'BK-001',
      fileName: 'backup_2024_06_14_15_30.zip',
      createdDate: '2024-06-14T15:30:00Z',
      createdBy: 'Admin Principal',
      size: '245.8 MB',
      status: 'completed',
      type: 'manual',
      description: 'Respaldo manual antes de actualización'
    },
    {
      id: 'BK-002',
      fileName: 'backup_2024_06_13_02_00.zip',
      createdDate: '2024-06-13T02:00:00Z',
      createdBy: 'Sistema (Automático)',
      size: '240.2 MB',
      status: 'completed',
      type: 'scheduled',
      description: 'Respaldo automático diario'
    },
    {
      id: 'BK-003',
      fileName: 'backup_2024_06_12_14_15.zip',
      createdDate: '2024-06-12T14:15:00Z',
      createdBy: 'Juan Pérez',
      size: '0 MB',
      status: 'failed',
      type: 'manual',
      description: 'Falló por falta de espacio en disco'
    }
  ]);
  
  const { toast } = useToast();
  const { logAuditEvent } = useAudit();

  const createBackup = async (description?: string) => {
    setLoading(true);
    
    try {
      // Simular creación de backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup: BackupRecord = {
        id: `BK-${Date.now()}`,
        fileName: `backup_${new Date().toISOString().replace(/[:.]/g, '_').slice(0, -5)}.zip`,
        createdDate: new Date().toISOString(),
        createdBy: 'Usuario Actual',
        size: '248.5 MB',
        status: 'completed',
        type: 'manual',
        description: description || 'Respaldo manual'
      };
      
      setBackupHistory(prev => [newBackup, ...prev]);
      
      // Log audit event
      await logAuditEvent({
        type: AuditEventType.BACKUP_CREATED,
        severity: AuditSeverity.MEDIUM,
        title: 'Respaldo creado',
        description: `Se creó un nuevo respaldo: ${newBackup.fileName}`,
        userId: 'current-user-id',
        userName: 'Usuario Actual',
        userRole: 'ADMIN',
        entityType: 'backup',
        entityId: newBackup.id,
        metadata: { 
          fileName: newBackup.fileName,
          size: newBackup.size,
          type: newBackup.type
        }
      });
      
      toast({
        title: "Respaldo creado exitosamente",
        description: `El archivo ${newBackup.fileName} ha sido generado correctamente.`,
      });
      
    } catch (error) {
      const failedBackup: BackupRecord = {
        id: `BK-${Date.now()}`,
        fileName: `backup_${new Date().toISOString().replace(/[:.]/g, '_').slice(0, -5)}.zip`,
        createdDate: new Date().toISOString(),
        createdBy: 'Usuario Actual',
        size: '0 MB',
        status: 'failed',
        type: 'manual',
        description: 'Error durante la creación del respaldo'
      };
      
      setBackupHistory(prev => [failedBackup, ...prev]);
      
      // Log audit event for failed backup
      await logAuditEvent({
        type: AuditEventType.BACKUP_FAILED,
        severity: AuditSeverity.HIGH,
        title: 'Fallo en respaldo',
        description: `Error al crear respaldo: ${failedBackup.fileName}`,
        userId: 'current-user-id',
        userName: 'Usuario Actual',
        userRole: 'ADMIN',
        entityType: 'backup',
        entityId: failedBackup.id,
        metadata: { 
          fileName: failedBackup.fileName,
          error: 'Simulación de error'
        }
      });
      
      toast({
        title: "Error al crear respaldo",
        description: "No se pudo completar la operación de respaldo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backup = backupHistory.find(b => b.id === backupId);
      
      toast({
        title: "Restauración simulada",
        description: `En un entorno real, se restauraría desde: ${backup?.fileName}`,
      });
      
    } catch (error) {
      toast({
        title: "Error en restauración",
        description: "No se pudo completar la restauración.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (backupId: string) => {
    setBackupHistory(prev => prev.filter(backup => backup.id !== backupId));
    
    toast({
      title: "Respaldo eliminado",
      description: "El archivo de respaldo ha sido eliminado.",
    });
  };

  return {
    backupHistory,
    loading,
    createBackup,
    restoreBackup,
    deleteBackup
  };
};
