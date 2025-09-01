import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator';
}

export interface UpdateUserData {
  name?: string;
  role?: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator';
  is_active?: boolean;
  two_factor_enabled?: boolean;
}

class UserService {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create user: No user data returned');
    }

    // Then create the user record in our users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password_hash: '', // This will be handled by Supabase Auth
      })
      .select()
      .single();

    if (error) {
      // If user creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create user record: ${error.message}`);
    }

    return data;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data;
  }

  async deleteUser(id: string): Promise<void> {
    // First delete from our users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Failed to delete user record: ${dbError.message}`);
    }

    // Then delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      throw new Error(`Failed to delete auth user: ${authError.message}`);
    }
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    return this.updateUser(id, { role: role as any });
  }

  async toggleUserStatus(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.updateUser(id, { is_active: !user.is_active });
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch users by role: ${error.message}`);
    }

    return data || [];
  }

  async getTechnicians(): Promise<User[]> {
    return this.getUsersByRole('technician');
  }

  async getManagers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('role', ['admin', 'manager', 'supervisor'])
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch managers: ${error.message}`);
    }

    return data || [];
  }
}

const userService = new UserService();
export default userService;