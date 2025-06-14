
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuditFiltersComponent from '@/components/audit/AuditFilters';
import AuditEventCard from '@/components/audit/AuditEventCard';
import { useAudit } from '@/hooks/useAudit';
import { AuditEvent, AuditFilters } from '@/types/audit';
import { Shield, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuditPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { getAuditEvents, loading } = useAudit();
  
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({});

  const loadEvents = async () => {
    try {
      const auditEvents = await getAuditEvents(filters);
      setEvents(auditEvents);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos de auditoría.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const handleFiltersChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleExport = () => {
    // Simular exportación de datos
    const csvData = events.map(event => ({
      fecha: new Date(event.timestamp).toLocaleString('es-CL'),
      tipo: event.type,
      severidad: event.severity,
      usuario: event.userName,
      titulo: event.title,
      descripcion: event.description,
      ip: event.ipAddress || 'N/A'
    }));
    
    console.log('Exportando datos de auditoría:', csvData);
    
    toast({
      title: "Exportación iniciada",
      description: "Los datos de auditoría están siendo exportados.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Auditoría del Sistema" 
          subtitle="Registro de eventos y actividades críticas"
        />
        
        <main className="flex-1 px-6 py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Auditoría y Bitácora</h1>
                <p className="text-muted-foreground">
                  Monitoreo de eventos críticos del sistema
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadEvents} disabled={loading}>
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Actualizar
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          <AuditFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Eventos de Auditoría ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Cargando eventos...</p>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay eventos
                  </h3>
                  <p className="text-gray-500">
                    No se encontraron eventos de auditoría con los filtros seleccionados.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <AuditEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AuditPage;
