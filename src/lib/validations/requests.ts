import { z } from 'zod';

// Enums matching the database and types
export const RequestStatus = {
  NEW: 'Nueva',
  VALIDATING: 'En Validación', 
  PENDING_MANAGER: 'Pendiente Gestor',
  PENDING_SUPERVISOR: 'Pendiente Supervisor',
  ASSIGNED: 'Asignada',
  IN_PROGRESS: 'En Proceso', 
  COMPLETED: 'Completada',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CLOSED: 'Cerrada',
  CANCELLED: 'Cancelada'
} as const;

export const ServiceType = {
  INSTALLATION: 'Instalación',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación', 
  INSPECTION: 'Inspección',
  EMERGENCY: 'Emergencia'
} as const;

export const Priority = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica'
} as const;

// Validation schemas
export const serviceRequestSchema = z.object({
  service_type: z.enum(['Instalación', 'Mantenimiento', 'Reparación', 'Inspección', 'Emergencia']),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  client_id: z.string().uuid('Debe seleccionar un cliente válido'),
  scheduled_date: z.string().optional(),
  estimated_cost: z.number().positive('El costo estimado debe ser positivo').optional(),
  materials: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const updateRequestSchema = serviceRequestSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(['Nueva', 'En Validación', 'Pendiente Gestor', 'Pendiente Supervisor', 'Asignada', 'En Proceso', 'Completada', 'Aprobada', 'Rechazada', 'Cerrada', 'Cancelada']).optional(),
  assigned_technician_id: z.string().uuid().optional().nullable(),
  actual_cost: z.number().positive().optional(),
  completed_date: z.string().optional(),
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;
export type UpdateRequestFormData = z.infer<typeof updateRequestSchema>;