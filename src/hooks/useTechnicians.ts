
import { useState } from 'react';
import { Technician, RequestType } from '@/types/requests';

export const useTechnicians = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTechnician = async (technicianData: Partial<Technician>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTechnician: Technician = {
        id: `TECH-${Date.now()}`,
        name: technicianData.name || '',
        email: technicianData.email || '',
        phone: technicianData.phone || '',
        specialties: technicianData.specialties || [RequestType.MAINTENANCE],
        region: technicianData.region || '',
        isActive: true,
        currentRequests: 0,
        maxConcurrentRequests: technicianData.maxConcurrentRequests || 5,
        certificationDate: new Date().toISOString(),
        certificationExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 0,
        completedRequests: 0
      };
      
      console.log('Técnico creado:', newTechnician);
      return newTechnician;
    } catch (err) {
      setError('Error al crear el técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTechnician = async (id: string, technicianData: Partial<Technician>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Técnico actualizado:', id, technicianData);
      return { ...technicianData, id };
    } catch (err) {
      setError('Error al actualizar el técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTechnician = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Técnico eliminado:', id);
      return true;
    } catch (err) {
      setError('Error al eliminar el técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTechnicianStatus = async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('Estado del técnico cambiado:', id, 'Activo:', isActive);
      return { id, isActive };
    } catch (err) {
      setError('Error al cambiar el estado del técnico');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTechnician,
    updateTechnician,
    deleteTechnician,
    toggleTechnicianStatus,
    loading,
    error
  };
};
