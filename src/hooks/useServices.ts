
import { useState } from 'react';
import { ServiceType, ServiceCategory } from '@/types/services';

// Mock service data
const mockServices: ServiceType[] = [
  {
    id: 'SRV-001',
    name: 'Instalación de Transformador',
    description: 'Instalación completa de transformador eléctrico',
    category: ServiceCategory.ELECTRICAL,
    estimatedHours: 8,
    basePrice: 150000,
    equipmentRequired: ['Grúa', 'Herramientas especializadas'],
    skillsRequired: ['Electricista certificado', 'Operador de grúa'],
    isActive: true,
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  },
  {
    id: 'SRV-002',
    name: 'Mantenimiento Preventivo',
    description: 'Mantenimiento preventivo de equipos eléctricos',
    category: ServiceCategory.ELECTRICAL,
    estimatedHours: 4,
    basePrice: 75000,
    equipmentRequired: ['Multímetro', 'Herramientas básicas'],
    skillsRequired: ['Técnico eléctrico'],
    isActive: true,
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  },
  {
    id: 'SRV-003',
    name: 'Reparación de Emergencia',
    description: 'Reparación urgente de fallas eléctricas',
    category: ServiceCategory.EMERGENCY,
    estimatedHours: 6,
    basePrice: 200000,
    equipmentRequired: ['Kit de emergencia', 'Vehículo especializado'],
    skillsRequired: ['Técnico de emergencias'],
    isActive: true,
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  }
];

export const useServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllServices = async (): Promise<ServiceType[]> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockServices;
    } catch (err) {
      setError('Error al cargar servicios');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Partial<ServiceType>): Promise<ServiceType> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newService: ServiceType = {
        id: `SRV-${Date.now()}`,
        name: serviceData.name || '',
        description: serviceData.description || '',
        category: serviceData.category || ServiceCategory.ELECTRICAL,
        estimatedHours: serviceData.estimatedHours || 0,
        basePrice: serviceData.basePrice || 0,
        equipmentRequired: serviceData.equipmentRequired || [],
        skillsRequired: serviceData.skillsRequired || [],
        isActive: true,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      
      mockServices.push(newService);
      return newService;
    } catch (err) {
      setError('Error al crear servicio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, serviceData: Partial<ServiceType>): Promise<ServiceType> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        mockServices[index] = { ...mockServices[index], ...serviceData, updatedDate: new Date().toISOString() };
        return mockServices[index];
      }
      throw new Error('Servicio no encontrado');
    } catch (err) {
      setError('Error al actualizar servicio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        mockServices.splice(index, 1);
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al eliminar servicio');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllServices,
    createService,
    updateService,
    deleteService,
    loading,
    error
  };
};
