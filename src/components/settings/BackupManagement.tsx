
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar,
  User,
  HardDrive
} from 'lucide-react';
import { useBackups, BackupRecord } from '@/hooks/useBackups';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const BackupManagement: React.FC = () => {
  const { backupHistory, loading, createBackup, restoreBackup, deleteBackup } = useBackups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [backupDescription, setBackupDescription] = useState('');

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: BackupRecord['status']) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      'in-progress': 'secondary'
    };
    
    const labels = {
      completed: 'Completado',
      failed: 'Fallido',
      'in-progress': 'En progreso'
    };

    return (
      <Badge variant={variants[status] as any} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {labels[status]}
      </Badge>
    );
  };

  const handleCreateBackup = async () => {
    await createBackup(backupDescription);
    setShowCreateDialog(false);
    setBackupDescription('');
  };

  const handleRestoreBackup = async () => {
    if (selectedBackup) {
      await restoreBackup(selectedBackup.id);
      setShowRestoreDialog(false);
      setSelectedBackup(null);
    }
  };

  const handleDeleteBackup = async () => {
    if (selectedBackup) {
      await deleteBackup(selectedBackup.id);
      setShowDeleteDialog(false);
      setSelectedBackup(null);
    }
  };

  const failedBackups = backupHistory.filter(backup => backup.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Alert para respaldos fallidos */}
      {failedBackups.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {failedBackups.length === 1 
              ? 'Hay 1 respaldo que falló. '
              : `Hay ${failedBackups.length} respaldos que fallaron. `}
            Revisa el historial para más detalles.
          </AlertDescription>
        </Alert>
      )}

      {/* Panel de control de respaldos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Gestión de Respaldos
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Administra los respaldos del sistema y restauraciones
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              disabled={loading}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {loading ? 'Creando...' : 'Crear Respaldo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Historial de respaldos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Historial de Respaldos</h3>
            
            {backupHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay respaldos disponibles</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Creado por</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        {getStatusBadge(backup.status)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p>{backup.fileName}</p>
                          {backup.description && (
                            <p className="text-xs text-muted-foreground">
                              {backup.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">
                              {new Date(backup.createdDate).toLocaleDateString('es-CL')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(backup.createdDate), { 
                                addSuffix: true, 
                                locale: es 
                              })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{backup.createdBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'manual' ? 'outline' : 'secondary'}>
                          {backup.type === 'manual' ? 'Manual' : 'Automático'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowRestoreDialog(true);
                            }}
                            disabled={backup.status !== 'completed' || loading}
                            className="gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Restaurar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowDeleteDialog(true);
                            }}
                            disabled={loading}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para crear respaldo */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Respaldo</DialogTitle>
            <DialogDescription>
              Se creará un respaldo completo del sistema con todos los datos actuales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Ej: Respaldo antes de actualización..."
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBackup} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Respaldo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para restaurar respaldo */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar Respaldo</DialogTitle>
            <DialogDescription>
              Esta es una simulación. En un entorno real, esta acción reemplazaría todos los datos actuales.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Advertencia:</strong> Esta operación es irreversible y reemplazará todos los datos actuales.
                </AlertDescription>
              </Alert>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Archivo:</strong> {selectedBackup.fileName}</p>
                <p><strong>Fecha:</strong> {new Date(selectedBackup.createdDate).toLocaleString('es-CL')}</p>
                <p><strong>Tamaño:</strong> {selectedBackup.size}</p>
                <p><strong>Creado por:</strong> {selectedBackup.createdBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRestoreBackup} 
              disabled={loading}
            >
              {loading ? 'Restaurando...' : 'Confirmar Restauración'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteBackup}
        title="Eliminar Respaldo"
        description={`¿Estás seguro de que quieres eliminar el respaldo "${selectedBackup?.fileName}"? Esta acción no se puede deshacer.`}
        type="delete"
        loading={loading}
      />
    </div>
  );
};

export default BackupManagement;
