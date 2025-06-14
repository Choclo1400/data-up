// Tipos específicos para el sistema de solicitudes técnicas

export enum RequestType {
  INSTALLATION = "Instalación",
  MAINTENANCE = "Mantenimiento", 
  REPAIR = "Reparación",
  INSPECTION = "Inspección",
  EMERGENCY = "Emergencia"
}

export enum RequestStatus {
  NEW = "Nueva",
  VALIDATING = "En Validación",
  PENDING_MANAGER = "Pendiente Gestor",
  PENDING_SUPERVISOR = "Pendiente Supervisor",
  ASSIGNED = "Asignada", 
  IN_PROGRESS = "En Proceso",
  COMPLETED = "Completada",
  APPROVED = "Aprobada",
  REJECTED = "Rechazada",
  CLOSED = "Cerrada",
  CANCELLED = "Cancelada"
}

export enum Priority {
  LOW = "Baja",
  MEDIUM = "Media",
  HIGH = "Alta", 
  CRITICAL = "Crítica"
}

export enum ClientType {
  ENEL = "Enel",
  SAESA = "Saesa",
  CGE = "CGE",
  FRONTEL = "Frontel",
  OTHER = "Otro"
}

export enum UserRole {
  EMPLOYEE = "Empleado",
  MANAGER = "Gestor",
  SUPERVISOR = "Supervisor",
  ADMIN = "Administrador"
}

export interface TechnicalRequest {
  id: string;
  requestNumber: string;
  type: RequestType;
  status: RequestStatus;
  priority: Priority;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientType: ClientType;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  equipmentRequired: string[];
  materials: string[];
  observations?: string;
  rejectionReason?: string;
  attachments: string[];
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  approvedByManager?: string;
  approvedBySupervisor?: string;
  managerApprovalDate?: string;
  supervisorApprovalDate?: string;
  hasRating?: boolean; // Nuevo campo para saber si ya fue calificada
  ratingId?: string; // ID de la calificación si existe
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  comuna: string;
  contractNumber?: string;
  isActive: boolean;
  createdDate: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: RequestType[];
  region: string;
  isActive: boolean;
  currentRequests: number;
  maxConcurrentRequests: number;
  certificationDate: string;
  certificationExpiry: string;
  rating: number;
  completedRequests: number;
}

export interface RequestStats {
  totalRequests: number;
  newRequests: number;
  pendingManagerRequests: number;
  pendingSupervisorRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  overdueRequests: number;
  averageCompletionTime: number;
  techniciansAvailable: number;
  pendingValidation: number;
}

export interface ApprovalAction {
  requestId: string;
  action: 'approve' | 'reject';
  reason?: string;
  comments?: string;
}
