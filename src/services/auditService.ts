import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      user:users(name, email, role)
    `)
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Error fetching audit logs: ${error.message}`);
  }

  return data || [];
}

export async function getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      user:users(name, email, role)
    `)
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Error fetching audit logs by user: ${error.message}`);
  }

  return data || [];
}

export async function createAuditLog(auditLog: AuditLogInsert): Promise<AuditLog> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert(auditLog)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating audit log: ${error.message}`);
  }

  return data;
}

export async function getAuditLogsByResource(resource: string, resourceId?: string): Promise<AuditLog[]> {
  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      user:users(name, email, role)
    `)
    .eq('resource', resource);

  if (resourceId) {
    query = query.eq('resource_id', resourceId);
  }

  const { data, error } = await query.order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Error fetching audit logs by resource: ${error.message}`);
  }

  return data || [];
}

export async function getAuditLogsByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      user:users(name, email, role)
    `)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Error fetching audit logs by date range: ${error.message}`);
  }

  return data || [];
}