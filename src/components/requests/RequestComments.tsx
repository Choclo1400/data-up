
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Lock,
  Globe,
  Edit2,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

interface RequestCommentsProps {
  requestId: string;
}

const RequestComments: React.FC<RequestCommentsProps> = ({ requestId }) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  
  // Mock data - en una aplicación real vendría de la API
  const comments: RequestComment[] = [
    {
      id: "1",
      authorName: "Juan Pérez",
      authorRole: "Empleado",
      content: "Solicito priorizar esta instalación ya que el cliente ha manifestado urgencia debido a problemas con el medidor actual.",
      createdAt: "2024-06-10T08:30:00Z",
      isInternal: false
    },
    {
      id: "2",
      authorName: "María González", 
      authorRole: "Gestor",
      content: "Revisé la documentación y todo está en orden. El cliente tiene contrato vigente y la zona está disponible para el técnico.",
      createdAt: "2024-06-12T14:15:00Z",
      isInternal: true
    },
    {
      id: "3",
      authorName: "Carlos Rodríguez",
      authorRole: "Supervisor", 
      content: "Confirmo disponibilidad de técnico especializado para el día programado. Se asigna a Roberto Silva.",
      createdAt: "2024-06-13T09:00:00Z",
      isInternal: true
    }
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // Aquí se enviaría el comentario a la API
    console.log('Nuevo comentario:', {
      content: newComment,
      isInternal,
      requestId
    });
    
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Nuevo Comentario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Agregar Comentario
          </CardTitle>
          <CardDescription>
            Agregue comentarios o notas sobre esta solicitud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escriba su comentario aquí..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="internal-comment"
                checked={isInternal}
                onCheckedChange={setIsInternal}
              />
              <Label htmlFor="internal-comment" className="flex items-center gap-2">
                {isInternal ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Comentario interno
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    Visible para el cliente
                  </>
                )}
              </Label>
            </div>
            
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Comentarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comentarios ({comments.length})
          </CardTitle>
          <CardDescription>
            Historial de comentarios y comunicaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay comentarios aún</p>
              <p className="text-sm">Sea el primero en agregar un comentario</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.isInternal 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{comment.authorName}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.authorRole}
                      </Badge>
                      {comment.isInternal ? (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Interno
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Público
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-2">{comment.content}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(comment.createdAt).toLocaleString('es-CL')}
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

export default RequestComments;
