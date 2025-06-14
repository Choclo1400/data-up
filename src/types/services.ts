
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  estimatedHours: number;
  basePrice: number;
  equipmentRequired: string[];
  skillsRequired: string[];
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export enum ServiceCategory {
  ELECTRICAL = "Eléctrico",
  MECHANICAL = "Mecánico",
  CIVIL = "Civil",
  TELECOMMUNICATIONS = "Telecomunicaciones",
  EMERGENCY = "Emergencia"
}

export interface ServiceFilter {
  category?: ServiceCategory;
  minHours?: number;
  maxHours?: number;
  isActive?: boolean;
  search?: string;
}
