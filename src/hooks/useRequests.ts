
import { useState } from 'react';
import { TechnicalRequest, RequestType, RequestStatus, Priority } from '@/types/requests';

// Simulamos llamadas a la API REST con MongoDB
export const useRequests = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (requestData: Partial<TechnicalRequest>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulamos llamada a API REST
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: TechnicalRequest = {
        id: `REQ-${Date.now()}`,
        requestNumber: `SOL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        type: requestData.type || RequestType.MAINTENANCE,
        status: RequestStatus.NEW,
        priority: requestData.priority || Priority.MEDIUM,
        title: requestData.title || '',
        description: requestData.description || '',
        clientId: requestData.clientId || '',
        clientName: requestData.clientName || '',
        clientType: requestData.clientType || 'OTHER' as any,
        location: requestData.location || '',
        requestedDate: new Date().toISOString().split('T')[0],
        estimatedHours: requestData.estimatedHours || 4,
        equipmentRequired: requestData.equipmentRequired || [],
        materials: requestData.materials || [],
        createdBy: 'usuario@inmel.cl',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        attachments: []
      };
      
      console.log('Solicitud creada:', newRequest);
      return newRequest;
    } catch (err) {
      setError('Error al crear la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, requestData: Partial<TechnicalRequest>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulamos llamada a API REST para actualizar
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Solicitud actualizada:', id, requestData);
      return { ...requestData, id, updatedDate: new Date().toISOString() };
    } catch (err) {
      setError('Error al actualizar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulamos llamada a API REST para eliminar
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Solicitud eliminada:', id);
      return true;
    } catch (err) {
      setError('Error al eliminar la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    updateRequest,
    deleteRequest,
    loading,
    error
  };
};
