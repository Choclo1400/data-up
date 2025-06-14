
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ReportType, ReportFilters, ReportData, ExportOptions } from '@/types/reports';

// Mock data for different report types
const mockReportData = {
  [ReportType.REQUEST_STATUS]: [
    { estado: 'Nueva', cantidad: 45, porcentaje: 25 },
    { estado: 'En Proceso', cantidad: 78, porcentaje: 43 },
    { estado: 'Completada', cantidad: 52, porcentaje: 29 },
    { estado: 'Cancelada', cantidad: 5, porcentaje: 3 },
  ],
  [ReportType.TECHNICIAN_PERFORMANCE]: [
    { tecnico: 'Juan Pérez', solicitudesCompletadas: 23, tiempoPromedio: 4.2, eficiencia: 92 },
    { tecnico: 'María García', solicitudesCompletadas: 28, tiempoPromedio: 3.8, eficiencia: 95 },
    { tecnico: 'Carlos López', solicitudesCompletadas: 19, tiempoPromedio: 5.1, eficiencia: 87 },
  ],
  [ReportType.CLIENT_ANALYSIS]: [
    { cliente: 'Empresa ABC', solicitudes: 15, satisfaccion: 4.8, tiempoPromedio: 3.2 },
    { cliente: 'Corporación XYZ', solicitudes: 22, satisfaccion: 4.6, tiempoPromedio: 4.1 },
    { cliente: 'Industrias DEF', solicitudes: 8, satisfaccion: 4.9, tiempoPromedio: 2.8 },
  ],
  [ReportType.RESOLUTION_TIMES]: [
    { tipoServicio: 'Instalación', tiempoPromedio: 6.2, minimo: 2.1, maximo: 12.5 },
    { tipoServicio: 'Mantenimiento', tiempoPromedio: 3.8, minimo: 1.5, maximo: 8.2 },
    { tipoServicio: 'Reparación', tiempoPromedio: 5.5, minimo: 2.8, maximo: 15.3 },
  ],
  [ReportType.SERVICE_TYPES]: [
    { tipo: 'Instalación', cantidad: 89, ingresos: 125400 },
    { tipo: 'Mantenimiento', cantidad: 156, ingresos: 89600 },
    { tipo: 'Reparación', cantidad: 67, ingresos: 98300 },
    { tipo: 'Inspección', cantidad: 34, ingresos: 28900 },
  ],
  [ReportType.MONTHLY_TRENDS]: [
    { mes: 'Ene', solicitudes: 120, completadas: 110, ingresos: 89500 },
    { mes: 'Feb', solicitudes: 98, completadas: 89, ingresos: 76200 },
    { mes: 'Mar', solicitudes: 145, completadas: 132, ingresos: 98700 },
    { mes: 'Abr', solicitudes: 167, completadas: 155, ingresos: 112300 },
    { mes: 'May', solicitudes: 189, completadas: 175, ingresos: 128900 },
    { mes: 'Jun', solicitudes: 234, completadas: 220, ingresos: 156800 },
  ],
};

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const generateReport = useCallback(async (filters: ReportFilters) => {
    if (!filters.reportType) {
      toast.error('Seleccione un tipo de reporte');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data: ReportData = {
        id: `report-${Date.now()}`,
        type: filters.reportType,
        title: filters.reportType,
        description: `Reporte generado del ${filters.dateFrom?.toLocaleDateString()} al ${filters.dateTo?.toLocaleDateString()}`,
        icon: 'FileBarChart',
        data: mockReportData[filters.reportType] || [],
        generatedAt: new Date().toISOString(),
      };
      
      setReportData(data);
      setSelectedReport(filters.reportType);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el reporte');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (options: ExportOptions) => {
    if (!reportData) {
      toast.error('No hay datos para exportar');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        ...options,
        generatedAt: new Date().toISOString()
      };
      
      console.log('Exportando reporte:', reportData);
      
      toast.success(`Reporte exportado en formato ${options.format.toUpperCase()}`);
      
      // Simulate download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `reporte-${options.reportType.toLowerCase().replace(/\s+/g, '-')}-${options.format}-${Date.now()}.${options.format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      toast.error('Error al exportar el reporte');
      console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  }, [reportData]);

  const clearReport = useCallback(() => {
    setReportData(null);
    setSelectedReport(null);
  }, []);

  return {
    loading,
    reportData,
    selectedReport,
    generateReport,
    exportReport,
    clearReport,
    setSelectedReport,
  };
};
