import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];
type ServiceRequestInsert = Database['public']['Tables']['service_requests']['Insert'];
type ServiceRequestUpdate = Database['public']['Tables']['service_requests']['Update'];

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      client:clients(*),
      assigned_technician:users!assigned_technician_id(*),
      approved_by:users!approved_by_id(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching service requests: ${error.message}`);
  }

  return data || [];
}

export async function getServiceRequestById(id: string): Promise<ServiceRequest | null> {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      client:clients(*),
      assigned_technician:users!assigned_technician_id(*),
      approved_by:users!approved_by_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Request not found
    }
    throw new Error(`Error fetching service request: ${error.message}`);
  }

  return data;
}

export async function createServiceRequest(request: ServiceRequestInsert): Promise<ServiceRequest> {
  const { data, error } = await supabase
    .from('service_requests')
    .insert(request)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating service request: ${error.message}`);
  }

  return data;
}

export async function updateServiceRequest(id: string, updates: ServiceRequestUpdate): Promise<ServiceRequest> {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating service request: ${error.message}`);
  }

  return data;
}

export async function deleteServiceRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting service request: ${error.message}`);
  }
}

export async function getRequestsByTechnician(technicianId: string): Promise<ServiceRequest[]> {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      client:clients(*),
      assigned_technician:users!assigned_technician_id(*),
      approved_by:users!approved_by_id(*)
    `)
    .eq('assigned_technician_id', technicianId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching requests by technician: ${error.message}`);
  }

  return data || [];
}

export async function getRequestsByStatus(status: string): Promise<ServiceRequest[]> {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      client:clients(*),
      assigned_technician:users!assigned_technician_id(*),
      approved_by:users!approved_by_id(*)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching requests by status: ${error.message}`);
  }

  return data || [];
}