
export enum ReportType {
  REQUEST_STATUS = "Solicitudes por Estado",
  TECHNICIAN_PERFORMANCE = "Rendimiento de Técnicos", 
  CLIENT_ANALYSIS = "Análisis de Clientes",
  RESOLUTION_TIMES = "Tiempos de Resolución",
  SERVICE_TYPES = "Tipos de Servicio",
  MONTHLY_TRENDS = "Tendencias Mensuales"
}

export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  reportType?: ReportType;
  clientId?: string;
  technicianId?: string;
  serviceType?: string;
  status?: string;
  region?: string;
}

export interface ReportData {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  icon: string;
  data: any[];
  generatedAt: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  filters: ReportFilters;
  reportType: ReportType;
}
