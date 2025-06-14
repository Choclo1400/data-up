
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  isActive: boolean;
  skills: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdDate: string;
  updatedDate: string;
}

export interface EmployeeFilter {
  department?: string;
  position?: string;
  isActive?: boolean;
  search?: string;
}
