import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  type: 'individual' | 'business';
  address?: string | null;
  contact_person?: string | null;
  created_at: string;
  updated_at: string;
}

export const clientService = {
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    return { data, error };
  },

  async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteClient(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    return { error };
  },
};

// Convenience functions for compatibility
export const createClient = clientService.createClient;
export const getClients = clientService.getClients;
export const updateClient = clientService.updateClient;
export const deleteClient = clientService.deleteClient;

export async function createSampleClients() {
  const sampleClients = [
    {
      name: 'Juan Pérez',
      type: 'individual' as const,
      email: 'juan.perez@email.com',
      phone: '+1-555-0101',
      address: '123 Main St, Ciudad'
    },
    {
      name: 'María González',
      type: 'individual' as const,
      email: 'maria.gonzalez@email.com', 
      phone: '+1-555-0102',
      address: '456 Oak Ave, Ciudad'
    },
    {
      name: 'TechCorp Solutions',
      type: 'business' as const,
      email: 'info@techcorp.com',
      phone: '+1-555-0201',
      address: '789 Business Blvd, Ciudad'
    },
    {
      name: 'Ana Rodríguez',
      type: 'individual' as const,
      email: 'ana.rodriguez@email.com',
      phone: '+1-555-0103',
      address: '321 Pine St, Ciudad'
    },
    {
      name: 'Innovate LLC',
      type: 'business' as const,
      email: 'contact@innovate.com',
      phone: '+1-555-0202',
      address: '654 Innovation Dr, Ciudad'
    }
  ];

  for (const client of sampleClients) {
    const { error } = await supabase
      .from('clients')
      .insert(client);
    
    if (error) {
      console.error('Error creating sample client:', error);
      throw error;
    }
  }
}