import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import DateRangePicker from '@/components/common/DateRangePicker';
import ReportCard from '@/components/reports/ReportCard';
import ReportPreview from '@/components/reports/ReportPreview';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRatings } from '@/hooks/useRatings';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, FileText, Calendar, TrendingUp, TrendingDown, Loader2, Users, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ReportType, ReportFilters } from '@/types/reports';

const availableReports = [
  {
    type: ReportType.REQUEST_STATUS,
    title: "Solicitudes por Estado",
    description: "Distribución de solicitudes según su estado actual"
  },
  {
    type: ReportType.TECHNICIAN_PERFORMANCE,
    title: "Rendimiento de Técnicos",
    description: "Análisis de eficiencia y productividad por técnico"
  },
  {
    type: ReportType.CLIENT_ANALYSIS,
    title: "Análisis de Clientes",
    description: "Estadísticas de satisfacción y actividad por cliente"
  },
  {
    type: ReportType.RESOLUTION_TIMES,
    title: "Tiempos de Resolución",
    description: "Análisis de tiempos promedio por tipo de servicio"
  },
  {
    type: ReportType.SERVICE_TYPES,
    title: "Tipos de Servicio",
    description: "Distribución y análisis de tipos de servicios"
  },
  {
    type: ReportType.MONTHLY_TRENDS,
    title: "Tendencias Mensuales",
    description: "Evolución de solicitudes e ingresos por mes"
  }
];

const AnalyticsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { loading, reportData, selectedReport, generateReport, exportReport, setSelectedReport } = useAnalytics();
  const { getRatingStats } = useRatings();
  
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: undefined,
    dateTo: undefined,
    reportType: undefined
  });

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setFilters(prev => ({ ...prev, dateFrom: from, dateTo: to }));
  };

  const handleReportTypeChange = (type: string) => {
    setFilters(prev => ({ ...prev, reportType: type as ReportType }));
  };

  const handleApplyFilters = () => {
    if (!filters.reportType) {
      return;
    }
    generateReport(filters);
  };

  const handleReportCardClick = (type: ReportType) => {
    setSelectedReport(type);
    setFilters(prev => ({ ...prev, reportType: type }));
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!filters.reportType) return;
    
    exportReport({
      format,
      filters,
      reportType: filters.reportType
    });
  };

  // Obtener estadísticas reales de calificaciones
  const ratingStats = getRatingStats();

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
      title: "Satisfacción del Cliente", 
      value: `${ratingStats.averageRating}/5`, 
      trend: ratingStats.totalRatings > 0 ? `${ratingStats.totalRatings} calificaciones` : "Sin datos",
      isPositive: ratingStats.averageRating >= 4,
      icon: Star
    },
    { 
      title: "Técnicos Activos", 
      value: 23, 
      trend: "+2",
      isPositive: true,
      icon: Users
    }
  ];

  const monthlyData = [
    { mes: 'Ene', solicitudes: 120, completadas: 110, pendientes: 10 },
    { mes: 'Feb', solicitudes: 98, completadas: 89, pendientes: 9 },
    { mes: 'Mar', solicitudes: 145, completadas: 132, pendientes: 13 },
    { mes: 'Abr', solicitudes: 167, completadas: 155, pendientes: 12 },
    { mes: 'May', solicitudes: 189, completadas: 175, pendientes: 14 },
    { mes: 'Jun', solicitudes: 234, completadas: 220, pendientes: 14 }
  ];

  const serviceTypeData = [
    { name: 'Instalación', value: 35, color: '#0088FE' },
    { name: 'Mantenimiento', value: 28, color: '#00C49F' },
    { name: 'Reparación', value: 20, color: '#FFBB28' },
    { name: 'Inspección', value: 12, color: '#FF8042' },
    { name: 'Emergencia', value: 5, color: '#8884D8' }
  ];

  const breadcrumbItems = [
    { label: 'Análisis y Reportes', icon: BarChart3 }
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
          subtitle="Monitorea el rendimiento y genera reportes del sistema"
        />
        
        <main className="flex-1 px-6 py-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Análisis y Reportes</h1>
                <p className="text-muted-foreground">Monitorea el rendimiento del sistema y genera reportes detallados</p>
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

          {/* Sección de Reportes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Columna izquierda - Filtros */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generador de Reportes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DateRangePicker
                    from={filters.dateFrom}
                    to={filters.dateTo}
                    onDateChange={handleDateChange}
                    label="Período"
                  />
                  
                  <div>
                    <Label htmlFor="reportType">Tipo de Reporte</Label>
                    <Select value={filters.reportType} onValueChange={handleReportTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ReportType).filter(type => type && type.trim() !== '').map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleApplyFilters} 
                    disabled={loading || !filters.reportType}
                    className="w-full"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Generar Reporte
                  </Button>
                  
                  {reportData && (
                    <div className="space-y-2 pt-4 border-t">
                      <Label>Exportar</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleExport('pdf')}
                          disabled={loading}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleExport('excel')}
                          disabled={loading}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Columna derecha - Reportes disponibles */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reportes Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {availableReports.map((report) => (
                      <ReportCard
                        key={report.type}
                        type={report.type}
                        title={report.title}
                        description={report.description}
                        isSelected={selectedReport === report.type}
                        onClick={() => handleReportCardClick(report.type)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vista previa del reporte */}
          {reportData && (
            <ReportPreview reportData={reportData} />
          )}

          {/* Gráficos de análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Nuevo gráfico de satisfacción del cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Satisfacción del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                {ratingStats.totalRatings > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ratingStats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="hsl(var(--primary))" 
                        name="Calificación Promedio"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No hay calificaciones disponibles</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
