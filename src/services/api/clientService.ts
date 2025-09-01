import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientRow = Database['public']['Tables']['clients']['Row'];

export async function createClient(clientData: ClientInsert): Promise<ClientRow[]> {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }
  
  return data;
}

export async function getClients(): Promise<ClientRow[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data || [];
}

export async function updateClient(id: string, updates: Partial<ClientInsert>): Promise<ClientRow[]> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }

  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

// Example function to create sample clients programmatically
export async function createSampleClients(): Promise<void> {
  const sampleClients: ClientInsert[] = [
    {
      name: 'Acme Corporation',
      type: 'company',
      email: 'contact@acme.com',
      phone: '+1-555-0123',
      address: '123 Business Ave, Suite 100, New York, NY 10001',
      contact_person: 'John Smith'
    },
    {
      name: 'Tech Solutions Ltd',
      type: 'company',
      email: 'info@techsolutions.com',
      phone: '+1-555-0456',
      address: '456 Innovation Drive, San Francisco, CA 94105',
      contact_person: 'Sarah Johnson'
    },
    {
      name: 'María García',
      type: 'individual',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0789',
      address: '789 Residential St, Los Angeles, CA 90210'
    },
    {
      name: 'Global Manufacturing Inc',
      type: 'company',
      email: 'operations@globalmanuf.com',
      phone: '+1-555-0321',
      address: '321 Industrial Blvd, Chicago, IL 60601',
      contact_person: 'Michael Brown'
    },
    {
      name: 'Roberto Fernández',
      type: 'individual',
      email: 'roberto.fernandez@email.com',
      phone: '+1-555-0654',
      address: '654 Main Street, Miami, FL 33101'
    }
  ];

  try {
    for (const client of sampleClients) {
      await createClient(client);
      console.log(`Created client: ${client.name}`);
    }
    console.log('All sample clients created successfully');
  } catch (error) {
    console.error('Error creating sample clients:', error);
    throw error;
  }
}