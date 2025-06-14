
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download
} from 'lucide-react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportResult>;
  title?: string;
  acceptedTypes?: string;
}

interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  errorRows: ImportError[];
  warnings: string[];
}

interface ImportError {
  row: number;
  error: string;
  data?: any;
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({
  isOpen,
  onClose,
  onImport,
  title = "Importar Datos",
  acceptedTypes = ".csv,.xlsx,.xls"
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setImporting(true);
    setProgress(0);
    
    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 100);

      const importResult = await onImport(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(importResult);
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        totalRows: 0,
        successfulRows: 0,
        errorRows: [{ row: 0, error: 'Error al procesar el archivo' }],
        warnings: []
      });
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setImporting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const downloadErrorReport = () => {
    if (!result?.errorRows.length) return;
    
    const csvContent = [
      'Fila,Error,Datos',
      ...result.errorRows.map(error => 
        `${error.row},"${error.error}","${JSON.stringify(error.data || {})}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'errores_importacion.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!result && (
            <div>
              {/* Zona de arrastre */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Formatos soportados: {acceptedTypes}
                </p>
                
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button variant="outline">
                    Seleccionar archivo
                  </Button>
                </Label>
              </div>

              {/* Archivo seleccionado */}
              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedFile(null)}
                    variant="ghost"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Progreso de importación */}
              {importing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Procesando archivo...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          )}

          {/* Resultados de importación */}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{result.totalRows}</p>
                  <p className="text-sm text-blue-600">Total de filas</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{result.successfulRows}</p>
                  <p className="text-sm text-green-600">Exitosas</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{result.errorRows.length}</p>
                  <p className="text-sm text-red-600">Con errores</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{result.warnings.length}</p>
                  <p className="text-sm text-yellow-600">Advertencias</p>
                </div>
              </div>

              {result.warnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Advertencias:</strong>
                    <ul className="mt-2 space-y-1">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result.errorRows.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Errores Encontrados</h3>
                    <Button onClick={downloadErrorReport} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar reporte
                    </Button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fila</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.errorRows.slice(0, 10).map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="destructive">{error.row}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{error.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {result.errorRows.length > 10 && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Y {result.errorRows.length - 10} errores más...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              {result ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!result && selectedFile && (
              <Button onClick={handleImport} disabled={importing}>
                {importing ? 'Importando...' : 'Iniciar Importación'}
              </Button>
            )}
            {result && (
              <Button onClick={resetModal}>
                Importar otro archivo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataModal;
