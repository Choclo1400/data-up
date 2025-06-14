
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
  // Removed isFormOpen state as the form is always intended to be open on this page.
  // The RequestForm's internal open/close might be controlled by its 'isOpen' prop if it's a dialog,
  // but for an embedded form, it's always visible.

  const handleCreateRequest = async (requestData: Partial<TechnicalRequest>) => {
    try {
      if (requestData.requestedDate && requestData.estimatedHours) {
        const hasConflict = await validateScheduleConflict(
          requestData.requestedDate, 
          requestData.estimatedHours
        );
        
        if (hasConflict) {
          return; 
        }
      }

      await createRequest(requestData);
      // createRequest hook should show success toast
      
      setTimeout(() => {
        navigate('/requests');
      }, 1500);
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      // createRequest hook should handle error toast
    }
  };

  const handleFormCloseOrCancel = () => {
    // If the form had a cancel button that should navigate away
    navigate('/requests');
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Solicitudes", href: "/requests", icon: ClipboardPlus },
    { label: "Nueva Solicitud" }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:pl-64"> {/* Added md:pl-64 */}
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
                    onClick={() => navigate('/requests')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Solicitudes
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="max-w-4xl"> {/* Container for form content */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Proceso de Aprobación
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Su solicitud será enviada automáticamente al <strong>Gestor</strong> para revisión inicial. 
                      Una vez aprobada, será derivada al <strong>Supervisor</strong> para aprobación final antes de su asignación.
                    </p>
                  </div>

                  {/* RequestForm is always "open" or visible on this page */}
                  <RequestForm
                    isOpen={true} // Prop indicates it's active, though not necessarily a dialog
                    onClose={handleFormCloseOrCancel} // For cancel/programmatic close
                    onSubmit={handleCreateRequest}
                    loading={loading}
                    title="Datos de la Nueva Solicitud"
                    // initialData can be an empty object or specific defaults
                    initialData={{}} 
                  />
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
