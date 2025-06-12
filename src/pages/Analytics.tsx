
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, FileText, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AnalyticsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const generateReport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        dateFrom,
        dateTo,
        statusFilter,
        serviceTypeFilter,
        format,
        generatedAt: new Date().toISOString()
      };
      
      console.log('Generando reporte:', reportData);
      
      toast({
        title: "Reporte generado",
        description: `El reporte en formato ${format.toUpperCase()} ha sido generado exitosamente.`,
      });
      
      // Simular descarga
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `reporte-solicitudes-${format}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const metricsData = [
    { title: "Solicitudes Totales", value: 1247, trend: "+12%" },
    { title: "Tiempo Promedio Resolución", value: "4.2 días", trend: "-8%" },
    { title: "Eficiencia del Sistema", value: "94.5%", trend: "+3%" },
    { title: "Técnicos Activos", value: 23, trend: "+2" }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Análisis y Reportes" 
          subtitle="Genera reportes y analiza la eficiencia del sistema"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Análisis y Reportes</h1>
                <p className="text-muted-foreground">Monitorea el rendimiento del sistema</p>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        metric.trend.startsWith('+') ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.trend}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generador de reportes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generador de Reportes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Fecha Desde</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateTo">Fecha Hasta</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="statusFilter">Estado</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los estados</SelectItem>
                      <SelectItem value="nueva">Nueva</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="serviceTypeFilter">Tipo de Servicio</Label>
                  <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los tipos</SelectItem>
                      <SelectItem value="instalacion">Instalación</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="reparacion">Reparación</SelectItem>
                      <SelectItem value="inspeccion">Inspección</SelectItem>
                      <SelectItem value="emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => generateReport('pdf')} 
                  disabled={loading}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generar Reporte PDF
                </Button>
                
                <Button 
                  onClick={() => generateReport('excel')} 
                  disabled={loading}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generar Reporte Excel
                </Button>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Generando reporte, por favor espera...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráficos de análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <p className="text-muted-foreground">Gráfico de barras - Solicitudes por mes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <p className="text-muted-foreground">Gráfico circular - Distribución por tipo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
