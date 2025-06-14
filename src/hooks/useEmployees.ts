
import { useState } from 'react';
import { Employee } from '@/types/employees';

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@inmel.cl',
    phone: '+56 9 8765 4321',
    position: 'Técnico Senior',
    department: 'Técnico',
    hireDate: '2023-01-15',
    salary: 800000,
    isActive: true,
    skills: ['Instalación eléctrica', 'Mantenimiento'],
    certifications: ['SEC Clase A', 'Primeros Auxilios'],
    emergencyContact: {
      name: 'María Mendoza',
      phone: '+56 9 7654 3210',
      relationship: 'Esposa'
    },
    createdDate: '2023-01-15',
    updatedDate: '2024-01-15'
  },
  {
    id: 'EMP-002',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@inmel.cl',
    phone: '+56 9 7654 3210',
    position: 'Supervisora',
    department: 'Supervisión',
    hireDate: '2022-03-20',
    salary: 1200000,
    isActive: true,
    skills: ['Gestión de equipos', 'Control de calidad'],
    certifications: ['Gestión de Proyectos', 'Seguridad Industrial'],
    emergencyContact: {
      name: 'Pedro Rodríguez',
      phone: '+56 9 6543 2109',
      relationship: 'Hermano'
    },
    createdDate: '2022-03-20',
    updatedDate: '2024-01-15'
  }
];

export const useEmployees = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllEmployees = async (): Promise<Employee[]> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEmployees;
    } catch (err) {
      setError('Error al cargar empleados');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployee: Employee = {
        id: `EMP-${Date.now()}`,
        name: employeeData.name || '',
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        position: employeeData.position || '',
        department: employeeData.department || '',
        hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
        salary: employeeData.salary || 0,
        isActive: true,
        skills: employeeData.skills || [],
        certifications: employeeData.certifications || [],
        emergencyContact: employeeData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      
      mockEmployees.push(newEmployee);
      return newEmployee;
    } catch (err) {
      setError('Error al crear empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = { 
          ...mockEmployees[index], 
          ...employeeData, 
          updatedDate: new Date().toISOString() 
        };
        return mockEmployees[index];
      }
      throw new Error('Empleado no encontrado');
    } catch (err) {
      setError('Error al actualizar empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al eliminar empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (id: string, isActive: boolean): Promise<Employee> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees[index].isActive = isActive;
        mockEmployees[index].updatedDate = new Date().toISOString();
        return mockEmployees[index];
      }
      throw new Error('Empleado no encontrado');
    } catch (err) {
      setError('Error al cambiar estado del empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleEmployeeStatus,
    loading,
    error
  };
};
