
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import DateRangePicker from '@/components/common/DateRangePicker';
import ReportCard from '@/components/reports/ReportCard';
import ReportPreview from '@/components/reports/ReportPreview';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReports } from '@/hooks/useReports';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { ReportType, ReportFilters } from '@/types/reports';

const availableReports = [
  {
    type: ReportType.FORKLIFT_USAGE,
    title: "Utilización de Empilhadeiras",
    description: "Análise de horas de uso por máquina"
  },
  {
    type: ReportType.FUEL_CONSUMPTION,
    title: "Consumo de Combustível",
    description: "Consumo de gás por empilhadeira e horímetro"
  },
  {
    type: ReportType.MAINTENANCE_HISTORY,
    title: "Histórico de Manutenções",
    description: "Registros de manutenções realizadas"
  },
  {
    type: ReportType.OPERATOR_STATUS,
    title: "Status dos Operadores",
    description: "Validade de ASO e certificações"
  }
];

const ReportsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { loading, reportData, selectedReport, generateReport, exportReport, setSelectedReport } = useReports();
  
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

  const breadcrumbItems = [
    { label: 'Relatórios', icon: FileText }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Relatórios" 
          subtitle="Visualização e exportação de dados"
        />
        
        <main className="flex-1 px-6 py-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Sistema de Relatórios</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Filtros */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
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
                    Aplicar Filtros
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
            
            {/* Columna derecha - Reportes disponibles y vista previa */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
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
                  
                  {!reportData && !selectedReport && (
                    <div className="mt-8 text-center text-muted-foreground">
                      <p>Seleccione un tipo de reporte y aplique filtros para generar la vista previa</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Vista previa del reporte */}
              {reportData && (
                <ReportPreview reportData={reportData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
