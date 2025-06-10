
// Technical Request Types for Inmel Chile - Enel Management System

export enum RequestType {
  MAINTENANCE = "Mantenimiento",
  INSPECTION = "Inspección",
  INSTALLATION = "Instalación",
  REPAIR = "Reparación",
  EMERGENCY = "Emergencia"
}

export enum RequestStatus {
  PENDING = "Pendiente",
  IN_REVIEW = "En Revisión",
  APPROVED = "Aprobada",
  IN_PROGRESS = "En Progreso",
  COMPLETED = "Completada",
  REJECTED = "Rechazada",
  CANCELLED = "Cancelada"
}

export enum Priority {
  LOW = "Baja",
  MEDIUM = "Media",
  HIGH = "Alta",
  CRITICAL = "Crítica"
}

export enum UserRole {
  EMPLOYEE = "Empleado",
  MANAGER = "Gestor",
  SUPERVISOR = "Supervisor",
  ADMIN = "Administrador"
}

export interface TechnicalRequest {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  priority: Priority;
  clientCode: string; // Enel client code
  requestedBy: string;
  assignedTo?: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  location: string;
  equipment?: string;
  notes?: string;
  attachments?: string[];
  history: RequestHistoryEntry[];
}

export interface RequestHistoryEntry {
  id: string;
  requestId: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  previousStatus?: RequestStatus;
  newStatus?: RequestStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  isActive: boolean;
  createdDate: string;
  lastLogin?: string;
}

export interface Client {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string;
  location: string;
  status: "Operativo" | "Fuera de Servicio" | "En Mantenimiento";
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  overdueRequests: number;
  activeUsers: number;
  avgCompletionTime: number;
  requestsByType: { [key in RequestType]: number };
  requestsByPriority: { [key in Priority]: number };
}

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

// Legacy types for backward compatibility (will be phased out)
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

export enum CertificateStatus {
  REGULAR = "Regular",
  WARNING = "Próximo do Vencimento",
  EXPIRED = "Vencido"
}

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
