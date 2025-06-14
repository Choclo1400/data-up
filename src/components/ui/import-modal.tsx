
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDataImport, ImportResult } from '@/hooks/useDataImport';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  acceptedTypes?: string[];
  onImportComplete?: (result: ImportResult) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  title = "Importar Datos",
  acceptedTypes = ['.xlsx', '.xls', '.csv'],
  onImportComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { importing, progress, result, simulateImport, resetImport } = useDataImport();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedTypes.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert(`Tipo de archivo no soportado. Use: ${acceptedTypes.join(', ')}`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      const importResult = await simulateImport(selectedFile);
      onImportComplete?.(importResult);
    } catch (error) {
      console.error('Error durante la importación:', error);
    }
  };

  const handleClose = () => {
    resetImport();
    setSelectedFile(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Importe datos desde archivos Excel (.xlsx, .xls) o CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área de carga de archivos */}
          {!importing && !result && (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                selectedFile ? "border-green-500 bg-green-50" : ""
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cambiar archivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-muted rounded-full">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Formatos soportados: {acceptedTypes.join(', ')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Seleccionar archivo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* Barra de progreso */}
          {importing && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Importando datos...</h3>
                <p className="text-sm text-muted-foreground">{progress.message}</p>
              </div>
              <Progress value={progress.progress} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {progress.progress}% completado
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          {result && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-700">
                  Importación completada
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                    <div className="text-sm text-muted-foreground">Exitosos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                    <div className="text-sm text-muted-foreground">Errores</div>
                  </CardContent>
                </Card>
              </div>

              {result.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-5 h-5" />
                      Errores detectados ({result.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {result.errors.slice(0, 10).map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription className="text-sm">
                            <strong>Fila {error.row}</strong> - {error.field}: {error.message}
                            {error.value && (
                              <span className="ml-2 text-xs bg-red-100 px-2 py-1 rounded">
                                "{error.value}"
                              </span>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                      {result.errors.length > 10 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... y {result.errors.length - 10} errores más
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar reporte de errores
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              {result ? 'Cerrar' : 'Cancelar'}
            </Button>
            {selectedFile && !importing && !result && (
              <Button onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Importar datos
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
