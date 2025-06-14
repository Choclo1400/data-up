
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Paperclip, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  FileText,
  Image,
  File,
  FileImage,
  FileSpreadsheet,
  Calendar,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedByName: string;
  uploadedAt: string;
  description?: string;
}

interface RequestAttachmentsProps {
  requestId: string;
}

const RequestAttachments: React.FC<RequestAttachmentsProps> = ({ requestId }) => {
  const [dragOver, setDragOver] = useState(false);
  
  // Mock data - en una aplicación real vendría de la API
  const attachments: RequestAttachment[] = [
    {
      id: "1",
      fileName: "plano_instalacion.pdf",
      fileSize: 2458000,
      fileType: "application/pdf",
      uploadedByName: "Juan Pérez",
      uploadedAt: "2024-06-10T08:30:00Z",
      description: "Plano técnico de la instalación solicitada"
    },
    {
      id: "2",
      fileName: "foto_medidor_actual.jpg",
      fileSize: 1240000,
      fileType: "image/jpeg", 
      uploadedByName: "Juan Pérez",
      uploadedAt: "2024-06-10T08:35:00Z",
      description: "Fotografía del medidor actual que necesita reemplazo"
    },
    {
      id: "3",
      fileName: "especificaciones_tecnicas.xlsx",
      fileSize: 856000,
      fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadedByName: "María González",
      uploadedAt: "2024-06-12T14:20:00Z",
      description: "Especificaciones técnicas del equipo a instalar"
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="w-8 h-8 text-green-600" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-8 h-8 text-green-700" />;
    } else {
      return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    // Aquí se manejaría la subida de archivos
    console.log('Archivos a subir:', files);
  };

  return (
    <div className="space-y-6">
      {/* Zona de subida de archivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Archivos
          </CardTitle>
          <CardDescription>
            Adjunte documentos, imágenes o archivos relacionados con esta solicitud
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Soporta: PDF, imágenes, Excel, Word (máx. 10MB por archivo)
            </p>
            <Button variant="outline">
              <Paperclip className="w-4 h-4 mr-2" />
              Seleccionar Archivos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de archivos adjuntos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            Archivos Adjuntos ({attachments.length})
          </CardTitle>
          <CardDescription>
            Documentos y archivos relacionados con esta solicitud
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attachments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Paperclip className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay archivos adjuntos</p>
              <p className="text-sm">Suba archivos usando la zona de arriba</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {attachment.fileName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(attachment.fileSize)}
                      </Badge>
                    </div>
                    
                    {attachment.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {attachment.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {attachment.uploadedByName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(attachment.uploadedAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestAttachments;
