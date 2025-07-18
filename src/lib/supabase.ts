import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user role
export const getUserRole = async (userId?: string) => {
  const targetUserId = userId || (await getCurrentUser())?.id;
  
  if (!targetUserId) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', targetUserId)
    .single();
    
  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
  
  return data?.role || null;
};