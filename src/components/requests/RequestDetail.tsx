
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TechnicalRequest } from '@/types/requests';
import { getStatusBadgeVariant, getPriorityBadgeVariant } from './RequestBadges';
import RequestHistory from './RequestHistory';
import RequestComments from './RequestComments';
import RequestAttachments from './RequestAttachments';
import DecisionHistory from './DecisionHistory';
import {
  MapPin,
  Clock,
  User,
  Calendar,
  Wrench,
  Package,
  FileText,
  Star,
  Building2,
  Timer,
  X
} from 'lucide-react';

interface RequestDetailProps {
  request: TechnicalRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

// Map custom variants to shadcn variants
const mapToShadcnVariant = (customVariant: string) => {
  switch (customVariant) {
    case 'info':
      return 'default';
    case 'warning':
      return 'outline';
    case 'success':
      return 'default';
    case 'danger':
      return 'destructive';
    case 'neutral':
      return 'secondary';
    default:
      return 'default';
  }
};

const RequestDetail: React.FC<RequestDetailProps> = ({
  request,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!request) return null;

  const statusVariant = mapToShadcnVariant(getStatusBadgeVariant(request.status));
  const priorityVariant = mapToShadcnVariant(getPriorityBadgeVariant(request.priority));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {request.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Solicitud {request.requestNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={statusVariant}>
                {request.status}
              </Badge>
              <Badge variant={priorityVariant}>
                {request.priority}
              </Badge>
              {request.hasRating && (
                <div className="flex items-center text-green-600" title="Servicio calificado">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="decisions">Decisiones</TabsTrigger>
            <TabsTrigger value="comments">Comentarios</TabsTrigger>
            <TabsTrigger value="attachments">Archivos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Descripción
                    </label>
                    <p className="mt-1">{request.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Tipo de Solicitud
                      </label>
                      <p className="mt-1 font-medium">{request.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Prioridad
                      </label>
                      <p className="mt-1 font-medium">{request.priority}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Observaciones
                    </label>
                    <p className="mt-1">{request.observations || 'Sin observaciones'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información del Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Empresa
                    </label>
                    <p className="mt-1 font-medium">{request.clientName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tipo de Cliente
                    </label>
                    <p className="mt-1">{request.clientType}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Ubicación
                      </label>
                      <p className="mt-1">{request.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas y Tiempos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Fechas y Tiempos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha Solicitada
                      </label>
                      <p className="mt-1">{new Date(request.requestedDate).toLocaleDateString('es-CL')}</p>
                    </div>
                    {request.scheduledDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Fecha Programada
                        </label>
                        <p className="mt-1">{new Date(request.scheduledDate).toLocaleDateString('es-CL')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Horas Estimadas
                        </label>
                        <p className="mt-1">{request.estimatedHours}h</p>
                      </div>
                    </div>
                    {request.actualHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Horas Reales
                          </label>
                          <p className="mt-1">{request.actualHours}h</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {request.completedDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha de Finalización
                      </label>
                      <p className="mt-1">{new Date(request.completedDate).toLocaleDateString('es-CL')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Asignación y Recursos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Asignación y Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.assignedTechnicianName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Técnico Asignado
                      </label>
                      <p className="mt-1 font-medium">{request.assignedTechnicianName}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Equipos Requeridos
                    </label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {request.equipmentRequired.map((equipment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Wrench className="w-3 h-3 mr-1" />
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Materiales
                    </label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {request.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Package className="w-3 h-3 mr-1" />
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <RequestHistory requestId={request.id} />
          </TabsContent>

          <TabsContent value="decisions">
            <DecisionHistory 
              decisions={[]} // Se pasarían las decisiones reales aquí
            />
          </TabsContent>

          <TabsContent value="comments">
            <RequestComments requestId={request.id} />
          </TabsContent>

          <TabsContent value="attachments">
            <RequestAttachments requestId={request.id} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetail;
