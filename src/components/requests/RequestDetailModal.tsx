
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Clock, 
  MessageSquare, 
  Paperclip,
  Download,
  User,
  Calendar,
  MapPin,
  Tag
} from 'lucide-react';

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any; // TODO: Replace with proper type
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  onClose,
  request
}) => {
  if (!request) return null;

  // Mock data for demonstration
  const mockHistory = [
    {
      id: 1,
      action: 'Solicitud creada',
      user: 'María González',
      date: '2024-01-15T10:30:00Z',
      status: 'PENDING'
    },
    {
      id: 2,
      action: 'Asignada a técnico',
      user: 'Juan Supervisor',
      date: '2024-01-15T14:20:00Z',
      status: 'ASSIGNED'
    },
    {
      id: 3,
      action: 'En progreso',
      user: 'Carlos Técnico',
      date: '2024-01-16T09:15:00Z',
      status: 'IN_PROGRESS'
    }
  ];

  const mockComments = [
    {
      id: 1,
      author: 'María González',
      content: 'La grúa presenta problemas en el sistema hidráulico.',
      date: '2024-01-15T10:35:00Z',
      type: 'comment'
    },
    {
      id: 2,
      author: 'Carlos Técnico',
      content: 'He revisado el sistema, necesito repuestos adicionales.',
      date: '2024-01-16T11:20:00Z',
      type: 'update'
    }
  ];

  const mockAttachments = [
    {
      id: 1,
      name: 'foto_grua_01.jpg',
      size: '2.4 MB',
      type: 'image',
      url: '#'
    },
    {
      id: 2,
      name: 'manual_tecnico.pdf',
      size: '8.1 MB',
      type: 'pdf',
      url: '#'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Solicitud #{request.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Datos Generales</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="comments">Comentarios</TabsTrigger>
            <TabsTrigger value="attachments">Adjuntos</TabsTrigger>
          </TabsList>

          {/* Datos Generales */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">ID:</span>
                    <span>{request.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Título:</span>
                    <span>{request.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Fecha:</span>
                    <span>{new Date(request.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Ubicación:</span>
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado:</span>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {request.description || 'Sin descripción disponible'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Historial de Cambios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        {index < mockHistory.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.action}</p>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Por {item.user} • {new Date(item.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comentarios */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comentarios y Actualizaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.type === 'comment' ? 'Comentario' : 'Actualización'}
                          </Badge>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adjuntos */}
          <TabsContent value="attachments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Archivos Adjuntos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAttachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailModal;
