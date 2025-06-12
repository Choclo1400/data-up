
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RequestForm from "@/components/requests/RequestForm";
import { useRequests } from "@/hooks/useRequests";
import { TechnicalRequest } from '@/types/requests';
import { ClipboardPlus, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRequest, validateScheduleConflict, loading } = useRequests();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleCreateRequest = async (requestData: Partial<TechnicalRequest>) => {
    try {
      // Validar conflictos de fechas antes de crear la solicitud
      if (requestData.requestedDate && requestData.estimatedHours) {
        const hasConflict = await validateScheduleConflict(
          requestData.requestedDate, 
          requestData.estimatedHours
        );
        
        if (hasConflict) {
          return; // No crear la solicitud si hay conflicto
        }
      }

      await createRequest(requestData);
      
      // Redirigir al dashboard después de crear la solicitud
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Solicitudes", href: "/requests" },
    { label: "Nueva Solicitud", icon: ClipboardPlus }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />
            
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ClipboardPlus className="w-6 h-6" />
                  Nueva Solicitud Técnica
                </CardTitle>
                <CardDescription>
                  Complete el formulario para crear una nueva solicitud de servicio técnico
                </CardDescription>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
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

              {isFormOpen && (
                <RequestForm
                  isOpen={isFormOpen}
                  onClose={() => {
                    setIsFormOpen(false);
                    navigate('/');
                  }}
                  onSubmit={handleCreateRequest}
                  loading={loading}
                  title="Datos de la Solicitud"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewRequestPage;
