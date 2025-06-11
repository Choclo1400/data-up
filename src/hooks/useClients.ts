
import { useState } from 'react';
import { Client, ClientType } from '@/types/requests';

export const useClients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (clientData: Partial<Client>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        id: `CLI-${Date.now()}`,
        name: clientData.name || '',
        type: clientData.type || ClientType.OTHER,
        contactPerson: clientData.contactPerson || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        address: clientData.address || '',
        region: clientData.region || '',
        comuna: clientData.comuna || '',
        contractNumber: `CONT-${clientData.type}-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        isActive: true,
        createdDate: new Date().toISOString()
      };
      
      console.log('Cliente creado:', newClient);
      return newClient;
    } catch (err) {
      setError('Error al crear el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Cliente actualizado:', id, clientData);
      return { ...clientData, id };
    } catch (err) {
      setError('Error al actualizar el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Cliente eliminado:', id);
      return true;
    } catch (err) {
      setError('Error al eliminar el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleClientStatus = async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('Estado del cliente cambiado:', id, 'Activo:', isActive);
      return { id, isActive };
    } catch (err) {
      setError('Error al cambiar el estado del cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const archiveClient = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      console.log('Cliente archivado:', id);
      return true;
    } catch (err) {
      setError('Error al archivar el cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    archiveClient,
    loading,
    error
  };
};
