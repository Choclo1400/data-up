
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Badge from "@/components/common/Badge";
import { Client, ClientType } from '@/types/requests';
import { Building2, Phone, Mail, MapPin, Calendar, FileText, User } from 'lucide-react';
import ClientTypeIcon from './ClientTypeIcon';

interface ClientDialogProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

const getClientTypeBadgeVariant = (type: ClientType) => {
  switch (type) {
    case ClientType.ENEL: return 'success';
    case ClientType.CGE: return 'info';
    case ClientType.SAESA: return 'warning';
    case ClientType.FRONTEL: return 'neutral';
    default: return 'neutral';
  }
};

const ClientDialog: React.FC<ClientDialogProps> = ({ client, isOpen, onClose }) => {
  if (!client) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xl font-semibold">{client.name}</div>
              <div className="text-sm text-muted-foreground">{client.id}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Información General</h3>
              
              <div className="flex items-center gap-3">
                <ClientTypeIcon type={client.type} />
                <div>
                  <div className="text-sm text-muted-foreground">Tipo</div>
                  <Badge variant={getClientTypeBadgeVariant(client.type)}>
                    {client.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Contacto</div>
                  <div className="font-medium">{client.contactPerson}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Fecha de Creación</div>
                  <div className="font-medium">{formatDate(client.createdDate)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-lg">Contacto</h3>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{client.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Teléfono</div>
                  <div className="font-medium">{client.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Ubicación</div>
                  <div className="font-medium">{client.comuna}, {client.region}</div>
                  <div className="text-sm text-muted-foreground">{client.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Contrato */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-3">Información del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Número de Contrato</div>
                  <div className="font-mono font-medium">{client.contractNumber}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estado</div>
                <Badge variant={client.isActive ? 'success' : 'danger'}>
                  {client.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Historial Simulado */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-3">Actividad Reciente</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Última solicitud técnica</span>
                <span className="text-muted-foreground">Hace 5 días</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Actualización de contrato</span>
                <span className="text-muted-foreground">Hace 2 semanas</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Registro en sistema</span>
                <span className="text-muted-foreground">{formatDate(client.createdDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;
