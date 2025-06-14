
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RequestForm from "@/components/requests/RequestForm";
import { useRequests } from "@/hooks/useRequests";
import { TechnicalRequest } from '@/types/requests';
import { ClipboardPlus, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRequest, validateScheduleConflict, loading } = useRequests();
  const [isFormOpen, setIsFormOpen] = useState(true); // Form is open by default on this page

  const handleCreateRequest = async (requestData: Partial<TechnicalRequest>) => {
    try {
      // Validar conflictos de fechas antes de crear la solicitud
      if (requestData.requestedDate && requestData.estimatedHours) {
        const hasConflict = await validateScheduleConflict(
          requestData.requestedDate, 
          requestData.estimatedHours
        );
        
        if (hasConflict) {
          // The validateScheduleConflict hook should show a toast, so we just return
          return; 
        }
      }

      await createRequest(requestData);
      // The createRequest hook should show a success toast
      
      // Redirigir al dashboard después de crear la solicitud
      setTimeout(() => {
        navigate('/requests'); // Navigate to requests list
      }, 1500); // Shorter delay
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      // The createRequest hook should handle showing an error toast
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    navigate('/requests'); // Navigate back to requests list if form is closed
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Solicitudes", href: "/requests", icon: ClipboardPlus },
    { label: "Nueva Solicitud" }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Nueva Solicitud Técnica" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <Breadcrumbs items={breadcrumbItems} className="mb-4" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <ClipboardPlus className="w-6 h-6" />
                      Crear Nueva Solicitud Técnica
                    </CardTitle>
                    <CardDescription>
                      Complete el formulario para crear una nueva solicitud de servicio técnico.
                    </CardDescription>
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/requests')} // Navigate to requests list
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Solicitudes
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="max-w-4xl">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Proceso de Aprobación
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Su solicitud será enviada automáticamente al <strong>Gestor</strong> para revisión inicial. 
                      Una vez aprobada, será derivada al <strong>Supervisor</strong> para aprobación final antes de su asignación.
                    </p>
                  </div>

                  {isFormOpen && ( // This check might be redundant if form is always open, but good for consistency
                    <RequestForm
                      isOpen={isFormOpen} // Pass true as it's always open on this page initially
                      onClose={handleFormClose} // Handle programmatic close or cancel
                      onSubmit={handleCreateRequest}
                      loading={loading}
                      title="Datos de la Nueva Solicitud"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewRequestPage;

