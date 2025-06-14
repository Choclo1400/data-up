
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
import { BarChart3, Download, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
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
    { 
      title: "Solicitudes Totales", 
      value: 1247, 
      trend: "+12%",
      isPositive: true,
      icon: FileText
    },
    { 
      title: "Tiempo Promedio Resolución", 
      value: "4.2 días", 
      trend: "-8%",
      isPositive: true,
      icon: Calendar
    },
    { 
      title: "Eficiencia del Sistema", 
      value: "94.5%", 
      trend: "+3%",
      isPositive: true,
      icon: TrendingUp
    },
    { 
      title: "Técnicos Activos", 
      value: 23, 
      trend: "+2",
      isPositive: true,
      icon: BarChart3
    }
  ];

  // Datos para gráfico de barras - Solicitudes por mes
  const monthlyData = [
    { mes: 'Ene', solicitudes: 120, completadas: 110, pendientes: 10 },
    { mes: 'Feb', solicitudes: 98, completadas: 89, pendientes: 9 },
    { mes: 'Mar', solicitudes: 145, completadas: 132, pendientes: 13 },
    { mes: 'Abr', solicitudes: 167, completadas: 155, pendientes: 12 },
    { mes: 'May', solicitudes: 189, completadas: 175, pendientes: 14 },
    { mes: 'Jun', solicitudes: 234, completadas: 220, pendientes: 14 }
  ];

  // Datos para gráfico circular - Tipos de servicio
  const serviceTypeData = [
    { name: 'Instalación', value: 35, color: '#0088FE' },
    { name: 'Mantenimiento', value: 28, color: '#00C49F' },
    { name: 'Reparación', value: 20, color: '#FFBB28' },
    { name: 'Inspección', value: 12, color: '#FF8042' },
    { name: 'Emergencia', value: 5, color: '#8884D8' }
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
            {metricsData.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-medium",
                          metric.isPositive ? "text-green-600" : "text-red-600"
                        )}>
                          {metric.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{metric.trend}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Generador de reportes */}
          <Card className="mb-8">
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
                      <SelectItem value="all">Todos los estados</SelectItem>
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
                      <SelectItem value="all">Todos los tipos</SelectItem>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="solicitudes" fill="#8884d8" name="Total" />
                    <Bar dataKey="completadas" fill="#82ca9d" name="Completadas" />
                    <Bar dataKey="pendientes" fill="#ffc658" name="Pendientes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
