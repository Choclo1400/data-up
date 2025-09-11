import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];
type ServiceRequestInsert = Database['public']['Tables']['service_requests']['Insert'];
type ServiceRequestUpdate = Database['public']['Tables']['service_requests']['Update'];
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];
type Client = Database['public']['Tables']['clients']['Row'];

// Service Requests
export const getServiceRequests = async () => {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      clients:client_id(id, name, email, phone, type),
      assigned_technician:assigned_technician_id(id, name, email),
      approved_by:approved_by_id(id, name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createServiceRequest = async (request: ServiceRequestInsert) => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert(request)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateServiceRequest = async (id: string, updates: ServiceRequestUpdate) => {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createUser = async (user: UserInsert) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, updates: UserUpdate) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Clients
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};