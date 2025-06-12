
export enum ReportType {
  FORKLIFT_USAGE = "Utilización de Empilhadeiras",
  FUEL_CONSUMPTION = "Consumo de Combustible", 
  MAINTENANCE_HISTORY = "Histórico de Manutenções",
  OPERATOR_STATUS = "Status de Operadores"
}

export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  reportType?: ReportType;
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
