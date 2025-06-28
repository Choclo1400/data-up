import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, BarChart3, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { DateRangePicker } from '@/components/common/DateRangePicker';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('general');

  // Mock data for demonstration
  const reportStats = {
    totalRequests: 156,
    completedRequests: 142,
    pendingRequests: 14,
    averageResolutionTime: '2.3 días',
    customerSatisfaction: '4.7/5',
    activeClients: 45
  };

  const reportTypes = [
    {
      id: 'general',
      title: 'Reporte General',
      description: 'Vista general de todas las solicitudes y servicios',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 'performance',
      title: 'Rendimiento de Técnicos',
      description: 'Análisis del desempeño del equipo técnico',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: 'clients',
      title: 'Reporte de Clientes',
      description: 'Estadísticas y análisis de clientes',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      id: 'services',
      title: 'Servicios Realizados',
      description: 'Detalle de todos los servicios completados',
      icon: CheckCircle,
      color: 'bg-orange-500'
    }
  ];

  const generateReport = () => {
    // Simulate report generation
    console.log(`Generating ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reportes y Análisis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Genera y visualiza reportes detallados del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Programar Reporte
          </Button>
          <Button onClick={generateReport}>
            <Download className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Solicitudes</p>
                <p className="text-2xl font-bold">{reportStats.totalRequests}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{reportStats.completedRequests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{reportStats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo Promedio</p>
                <p className="text-2xl font-bold">{reportStats.averageResolutionTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Satisfacción</p>
                <p className="text-2xl font-bold">{reportStats.customerSatisfaction}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Activos</p>
                <p className="text-2xl font-bold">{reportStats.activeClients}</p>
              </div>
              <Users className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reporte</CardTitle>
          <CardDescription>
            Selecciona el tipo de reporte y el período de tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Reporte</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rango de Fechas</label>
              <DateRangePicker />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <Card 
              key={type.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedReport === type.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedReport(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Preview */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa del Reporte</CardTitle>
              <CardDescription>
                Previsualización del reporte seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reporte en Construcción
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  La vista previa del reporte se mostrará aquí una vez generado
                </p>
                <Button onClick={generateReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Vista Previa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Reporte</CardTitle>
              <CardDescription>
                Datos tabulares del reporte seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Datos no Disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Los datos del reporte se mostrarán aquí una vez generado
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opciones de Exportación</CardTitle>
              <CardDescription>
                Exporta el reporte en diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-8 h-8 mb-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-8 h-8 mb-2" />
                  Exportar Excel
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="w-8 h-8 mb-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;