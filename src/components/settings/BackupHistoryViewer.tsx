
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Download, 
  RotateCcw,
  Clock,
  HardDrive,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface BackupRecord {
  id: string;
  filename: string;
  createdAt: string;
  size: string;
  type: 'automatic' | 'manual';
  status: 'success' | 'failed' | 'in_progress';
  duration?: string;
  error?: string;
}

const BackupHistoryViewer: React.FC = () => {
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data
  const backupHistory: BackupRecord[] = [
    {
      id: 'backup-001',
      filename: 'inmel_backup_2024-01-15_14-30.sql',
      createdAt: '2024-01-15T14:30:00Z',
      size: '2.4 GB',
      type: 'automatic',
      status: 'success',
      duration: '8m 32s'
    },
    {
      id: 'backup-002',
      filename: 'inmel_backup_2024-01-14_02-00.sql',
      createdAt: '2024-01-14T02:00:00Z',
      size: '2.3 GB',
      type: 'automatic',
      status: 'success',
      duration: '7m 45s'
    },
    {
      id: 'backup-003',
      filename: 'inmel_backup_2024-01-13_15-45.sql',
      createdAt: '2024-01-13T15:45:00Z',
      size: '1.8 GB',
      type: 'manual',
      status: 'success',
      duration: '6m 12s'
    },
    {
      id: 'backup-004',
      filename: 'inmel_backup_2024-01-12_02-00.sql',
      createdAt: '2024-01-12T02:00:00Z',
      size: '0 KB',
      type: 'automatic',
      status: 'failed',
      error: 'Error de conexión con la base de datos'
    },
    {
      id: 'backup-005',
      filename: 'inmel_backup_2024-01-11_02-00.sql',
      createdAt: '2024-01-11T02:00:00Z',
      size: '2.2 GB',
      type: 'automatic',
      status: 'success',
      duration: '8m 01s'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Exitoso
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Fallido
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            En progreso
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'automatic' ? (
      <Badge variant="outline">Automático</Badge>
    ) : (
      <Badge variant="secondary">Manual</Badge>
    );
  };

  const handleRestore = (backup: BackupRecord) => {
    if (confirm(`¿Estás seguro de que quieres restaurar el backup "${backup.filename}"? Esta acción no se puede deshacer.`)) {
      console.log('Restoring backup:', backup.id);
      // Aquí iría la lógica de restauración
    }
  };

  const handleDownload = (backup: BackupRecord) => {
    console.log('Downloading backup:', backup.id);
    // Aquí iría la lógica de descarga
  };

  const showBackupDetails = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Historial de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">
                      {backup.filename}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {new Date(backup.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(backup.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4 text-muted-foreground" />
                        {backup.size}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(backup.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(backup.status)}
                    </TableCell>
                    <TableCell>
                      {backup.duration || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showBackupDetails(backup)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {backup.status === 'success' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(backup)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(backup)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Detalles del Backup
            </DialogTitle>
          </DialogHeader>

          {selectedBackup && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Archivo
                  </label>
                  <p className="font-medium">{selectedBackup.filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedBackup.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de creación
                  </label>
                  <p>{new Date(selectedBackup.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo
                  </label>
                  <div className="mt-1">
                    {getTypeBadge(selectedBackup.type)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tamaño
                  </label>
                  <p>{selectedBackup.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Duración
                  </label>
                  <p>{selectedBackup.duration || 'N/A'}</p>
                </div>
              </div>

              {selectedBackup.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {selectedBackup.error}
                  </AlertDescription>
                </Alert>
              )}

              {selectedBackup.status === 'success' && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleDownload(selectedBackup)}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleRestore(selectedBackup)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restaurar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupHistoryViewer;
