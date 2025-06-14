import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import RequestList from "@/components/requests/RequestList";
import { useRequests } from "@/hooks/useRequests";
import { TechnicalRequest } from '@/types/requests';
import { UserCheck, Search, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchPendingManager, approveManager, rejectRequest, loading } = useRequests();
  const [requests, setRequests] = useState<TechnicalRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setIsLoading(true);
      const pendingRequests = await fetchPendingManager();
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error al cargar solicitudes pendientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string, comments?: string) => {
    try {
      await approveManager(requestId, comments);
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
    { label: "Pendientes Gestor", icon: UserCheck }
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
                  <UserCheck className="w-6 h-6" />
                  Solicitudes Pendientes - Gestor
                </CardTitle>
                <CardDescription>
                  Revise y apruebe las solicitudes técnicas pendientes de validación
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
                  <div className="text-2xl font-bold text-orange-600">
                    {requests.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solicitudes Pendientes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {requests.filter(r => r.priority === 'Crítica').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prioridad Crítica
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {requests.filter(r => r.priority === 'Alta').length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prioridad Alta
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Instrucciones */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                Instrucciones para Gestores
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Revise cuidadosamente cada solicitud antes de aprobar</li>
                <li>• Verifique que los datos técnicos estén completos</li>
                <li>• Las solicitudes aprobadas serán enviadas al Supervisor</li>
                <li>• Use "Rechazar" solo si hay errores graves o información faltante</li>
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
                actionLabel="Aprobar para Supervisor"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingManagerPage;
