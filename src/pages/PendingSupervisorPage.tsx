import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RequestList from "@/components/requests/RequestList";
import { useRequests } from "@/hooks/useRequests";
import { TechnicalRequest } from '@/types/requests';
import { Shield, Search, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingSupervisorPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchPendingSupervisor, approveSupervisor, rejectRequest, loading } = useRequests();
  const [requests, setRequests] = useState<TechnicalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setIsLoading(true);
      const pendingRequests = await fetchPendingSupervisor();
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error al cargar solicitudes pendientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string, comments?: string) => {
    try {
      await approveSupervisor(requestId, comments);
      // Remover la solicitud de la lista después de aprobarla
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await rejectRequest(requestId, reason);
      // Remover la solicitud de la lista después de rechazarla
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  };

  const handleViewRequest = (request: TechnicalRequest) => {
    console.log('Ver detalles de solicitud:', request);
    // Aquí se podría abrir un modal con los detalles completos
  };

  const handleViewHistory = (request: TechnicalRequest) => {
    console.log('Ver historial de decisiones:', request.id);
    // Aquí se podría abrir un modal con el historial
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Solicitudes", href: "/requests" },
    { label: "Pendientes Supervisor", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Solicitudes Pendientes - Supervisor
                </CardTitle>
                <CardDescription>
                  Revisión final y aprobación de solicitudes técnicas validadas por el Gestor
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={loadPendingRequests}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por número, título o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {requests.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solicitudes Pendientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {requests.filter(r => r.approvedByManager).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Validadas por Gestor
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {requests.filter(r => r.priority === 'Crítica' || r.priority === 'Alta').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alta Prioridad
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Información del proceso */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Aprobación Final - Supervisor
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Estas solicitudes ya fueron validadas técnicamente por el Gestor</li>
                <li>• Su aprobación permite la asignación inmediata a técnicos</li>
                <li>• Verifique recursos disponibles y cronograma antes de aprobar</li>
                <li>• Las solicitudes aprobadas entran al flujo operativo</li>
              </ul>
            </div>

            {/* Lista de solicitudes */}
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Cargando solicitudes...</p>
              </div>
            ) : (
              <RequestList
                requests={filteredRequests}
                showActions={true}
                onApprove={handleApprove}
                onReject={handleReject}
                onView={handleViewRequest}
                onViewHistory={handleViewHistory}
                loading={loading}
                actionLabel="Aprobar Definitivamente"
              />
            )}

            {/* Información adicional para solicitudes aprobadas por gestor */}
            {requests.length > 0 && requests.some(r => r.approvedByManager) && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Solicitudes Validadas por Gestor
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Las siguientes solicitudes han sido revisadas y aprobadas técnicamente por el Gestor. 
                  Su aprobación como Supervisor las habilita para asignación inmediata.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingSupervisorPage;
