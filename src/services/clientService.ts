import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching clients: ${error.message}`);
  }

  return data || [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Client not found
    }
    throw new Error(`Error fetching client: ${error.message}`);
  }

  return data;
}

export async function createClient(client: ClientInsert): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating client: ${error.message}`);
  }

  return data;
}

export async function updateClient(id: string, updates: ClientUpdate): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating client: ${error.message}`);
  }

  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting client: ${error.message}`);
  }
}
// Create sample clients for testing
export const createSampleClients = async (): Promise<void> => {
  const sampleClients = [
    {
      name: 'Empresa Demo S.L.',
      email: 'demo@empresa.com',
      phone: '+34 900 123 456',
      address: 'Calle Demo 123, 28001 Madrid',
      type: 'company' as const,
      contact_person: 'Juan Demo',
      is_active: true
    },
    {
      name: 'María Ejemplo',
      email: 'maria@ejemplo.com',
      phone: '+34 600 654 321',
      address: 'Avenida Ejemplo 45, 08002 Barcelona',
      type: 'individual' as const,
      contact_person: 'María Ejemplo',
      is_active: true
    },
    {
      name: 'Tecnología Avanzada Ltd.',
      email: 'info@tecavanzada.com',
      phone: '+34 915 789 012',
      address: 'Polígono Industrial, Nave 7, 41001 Sevilla',
      type: 'company' as const,
      contact_person: 'Carlos Técnico',
      is_active: true
    }
  ];

  const { error } = await supabase
    .from('clients')
    .insert(sampleClients);

  if (error) {
    throw new Error(`Error creating sample clients: ${error.message}`);
  }
};


export async function searchClients(query: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,contact_person.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error searching clients: ${error.message}`);
  }

  return data || [];
}