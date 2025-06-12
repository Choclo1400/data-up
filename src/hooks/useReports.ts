
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ReportType, ReportFilters, ReportData, ExportOptions } from '@/types/reports';

// Mock data for different report types
const mockReportData = {
  [ReportType.FORKLIFT_USAGE]: [
    { empilhadeira: 'EMP-001', horasUso: 120, eficiencia: 85 },
    { empilhadeira: 'EMP-002', horasUso: 98, eficiencia: 92 },
    { empilhadeira: 'EMP-003', horasUso: 145, eficiencia: 78 },
  ],
  [ReportType.FUEL_CONSUMPTION]: [
    { empilhadeira: 'EMP-001', consumo: 45.2, horimetro: 1250 },
    { empilhadeira: 'EMP-002', consumo: 38.7, horimetro: 980 },
    { empilhadeira: 'EMP-003', consumo: 52.1, horimetro: 1450 },
  ],
  [ReportType.MAINTENANCE_HISTORY]: [
    { empilhadeira: 'EMP-001', ultimaManutencao: '2024-01-15', proximaManutencao: '2024-04-15' },
    { empilhadeira: 'EMP-002', ultimaManutencao: '2024-02-01', proximaManutencao: '2024-05-01' },
    { empilhadeira: 'EMP-003', ultimaManutencao: '2024-01-20', proximaManutencao: '2024-04-20' },
  ],
  [ReportType.OPERATOR_STATUS]: [
    { operador: 'João Silva', aso: '2024-12-31', certificacao: '2025-06-30' },
    { operador: 'Maria Santos', aso: '2025-03-15', certificacao: '2025-09-15' },
    { operador: 'Pedro Costa', aso: '2024-11-20', certificacao: '2025-05-20' },
  ],
};

export const useReports = () => {
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
      
      // In a real implementation, you would call an API here
      // const response = await fetch('/api/reports/export', { method: 'POST', body: JSON.stringify(options) });
      
      toast.success(`Reporte exportado en formato ${options.format.toUpperCase()}`);
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
