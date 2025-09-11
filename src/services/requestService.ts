import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { ServiceRequestFormData } from '@/lib/validations/requests';

type ServiceRequestInsert = Database['public']['Tables']['service_requests']['Insert'];
type ServiceRequestUpdate = Database['public']['Tables']['service_requests']['Update'];

// Get all service requests with client information
export async function getServiceRequests() {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      clients:client_id (
        id,
        name,
        type,
        contact_person
      ),
      assigned_technician:assigned_technician_id (
        id,
        name,
        email
      ),
      approved_by:approved_by_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching service requests: ${error.message}`);
  }

  return data;
}

// Get service request by ID
export async function getServiceRequestById(id: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      clients:client_id (
        id,
        name,
        type,
        contact_person,
        phone,
        email
      ),
      assigned_technician:assigned_technician_id (
        id,
        name,
        email,
        phone
      ),
      approved_by:approved_by_id (
        id,
        name,
        email
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching service request: ${error.message}`);
  }

  return data;
}

// Create new service request
export async function createServiceRequest(requestData: ServiceRequestFormData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const insertData: ServiceRequestInsert = {
    service_type: requestData.service_type,
    description: requestData.description,
    priority: requestData.priority,
    status: 'Nueva',
    client_id: requestData.client_id,
    scheduled_date: requestData.scheduled_date || null,
    estimated_cost: requestData.estimated_cost || null,
    materials: requestData.materials || [],
    notes: requestData.notes || null,
  };

  const { data, error } = await supabase
    .from('service_requests')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating service request: ${error.message}`);
  }

  return data;
}

// Update service request
export async function updateServiceRequest(id: string, updateData: Partial<ServiceRequestUpdate>) {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating service request: ${error.message}`);
  }

  return data;
}

// Delete service request
export async function deleteServiceRequest(id: string) {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting service request: ${error.message}`);
  }
}

// Update request status (for approval workflow)
export async function updateRequestStatus(id: string, status: string, additionalData?: Record<string, any>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const updateData: ServiceRequestUpdate = {
    status,
    ...additionalData,
  };

  // Add approval tracking
  if (status === 'Pendiente Supervisor') {
    updateData.approved_by_id = user.id;
  }

  const { data, error } = await supabase
    .from('service_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating request status: ${error.message}`);
  }

  return data;
}

// Assign technician to request
export async function assignTechnician(requestId: string, technicianId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .update({
      assigned_technician_id: technicianId,
      status: 'Asignada'
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error assigning technician: ${error.message}`);
  }

  return data;
}

// Get requests by status for dashboard
export async function getRequestsByStatus() {
  const { data, error } = await supabase
    .from('service_requests')
    .select('status')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching requests by status: ${error.message}`);
  }

  // Count by status
  const statusCounts = data.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return statusCounts;
}

// Get overdue requests
export async function getOverdueRequests() {
  const today = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      clients:client_id (name),
      assigned_technician:assigned_technician_id (name)
    `)
    .not('scheduled_date', 'is', null)
    .lt('scheduled_date', today)
    .in('status', ['Asignada', 'En Proceso'])
    .order('scheduled_date', { ascending: true });

  if (error) {
    throw new Error(`Error fetching overdue requests: ${error.message}`);
  }

  return data || [];
}