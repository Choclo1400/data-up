// Forklift Types (mantenemos para referencia)
export enum ForkliftType {
  GAS = "Gás",
  ELECTRIC = "Elétrica",
  RETRACTABLE = "Retrátil"
}

export enum ForkliftStatus {
  OPERATIONAL = "Em Operação",
  STOPPED = "Parada",
  MAINTENANCE = "Aguardando Manutenção"
}

export interface Forklift {
  id: string;
  model: string;
  type: ForkliftType;
  capacity: string;
  acquisitionDate: string;
  lastMaintenance: string;
  status: ForkliftStatus;
  hourMeter: number;
}

// User/Operator Types (adaptamos para técnicos)
export enum UserRole {
  OPERATOR = "operator",
  TECHNICIAN = "technician",
  SUPERVISOR = "supervisor",
  MANAGER = "manager",
  ADMIN = "admin"
}

export enum CertificateStatus {
  REGULAR = "Regular",
  WARNING = "Próximo do Vencimento",
  EXPIRED = "Vencido"
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  cpf: string;
  contact: string;
  shift: string;
  registrationDate: string;
  asoExpirationDate: string;
  nrExpirationDate: string;
  asoStatus: CertificateStatus;
  nrStatus: CertificateStatus;
}

// Importamos y reexportamos los tipos de solicitudes técnicas
export * from './requests';
export * from './notifications';

// Operation Types (mantenemos para compatibilidad)
export interface Operation {
  id: string;
  operatorId: string;
  operatorName: string;
  forkliftId: string;
  forkliftModel: string;
  sector: string;
  initialHourMeter: number;
  currentHourMeter?: number;
  gasConsumption?: number;
  startTime: string;
  endTime?: string;
  status: "active" | "completed";
}

// Maintenance Types (mantenemos para compatibilidad)
export enum MaintenanceStatus {
  WAITING = "Aguardando",
  IN_PROGRESS = "Em andamento", 
  COMPLETED = "Concluído"
}

export interface Maintenance {
  id: string;
  forkliftId: string;
  forkliftModel: string;
  issue: string;
  reportedBy: string;
  reportedDate: string;
  status: MaintenanceStatus;
  completedDate?: string;
}

// Gas Supply Types (mantenemos para compatibilidad)
export interface GasSupply {
  id: string;
  date: string;
  forkliftId: string;
  forkliftModel: string;
  quantity: number;
  hourMeterBefore: number;
  hourMeterAfter: number;
  operator: string;
}

// Dashboard Types actualizados
export interface DashboardStats {
  // Métricas de solicitudes técnicas
  totalRequests: number;
  newRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  overdueRequests: number;
  
  // Métricas de técnicos
  totalTechnicians: number;
  availableTechnicians: number;
  busyTechnicians: number;
  techniciansWithValidCertificates: number;
  techniciansWithWarningCertificates: number;
  techniciansWithExpiredCertificates: number;
  
  // Métricas de clientes
  totalClients: number;
  activeClients: number;
  
  // Métricas operacionales
  averageCompletionTime: number;
  pendingValidations: number;
}

// Common Component Props
export interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}

// Export new types for services and employees
export * from './services';
export * from './employees';