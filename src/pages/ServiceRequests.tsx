import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ServiceRequestForm } from '@/components/features/requests/ServiceRequestForm';
import { ServiceRequestsList } from '@/components/features/requests/ServiceRequestsList';
import { Plus, FileText } from 'lucide-react';

const ServiceRequests = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleViewRequest = (id: string) => {
    // TODO: Implement view request details
    console.log('View request:', id);
  };

  const handleEditRequest = (id: string) => {
    setSelectedRequestId(id);
    setShowEditDialog(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setSelectedRequestId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Servicio</h1>
          <p className="text-muted-foreground">
            Gestión completa de solicitudes técnicas
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Main Content */}
      <ServiceRequestsList
        onViewRequest={handleViewRequest}
        onEditRequest={handleEditRequest}
      />

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nueva Solicitud de Servicio
            </DialogTitle>
          </DialogHeader>
          <ServiceRequestForm 
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Editar Solicitud de Servicio
            </DialogTitle>
          </DialogHeader>
          {selectedRequestId && (
            <ServiceRequestForm 
              isEditing={true}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceRequests;