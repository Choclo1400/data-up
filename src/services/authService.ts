import { supabase } from '@/lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'supervisor' | 'technician' | 'operator';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
  success: boolean;
  message: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUpUser = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const { email, password, name, role = 'operator' } = data;

    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (authError) {
      return {
        user: null,
        error: authError,
        success: false,
        message: authError.message,
      };
    }

    if (!authData.user) {
      return {
        user: null,
        error: null,
        success: false,
        message: 'Failed to create user account',
      };
    }

    // Insert user data into the users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        is_active: true,
      });

    if (insertError) {
      // If user creation in our table fails, we should clean up the auth user
      console.error('Failed to insert user data:', insertError);
      return {
        user: null,
        error: insertError as AuthError,
        success: false,
        message: 'Failed to complete user registration',
      };
    }

    return {
      user: authData.user,
      error: null,
      success: true,
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    return {
      user: null,
      error: error as AuthError,
      success: false,
      message: 'An unexpected error occurred during registration',
    };
  }
};

/**
 * Sign in a user with email and password
 */
export const signInUser = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const { email, password } = data;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        user: null,
        error: authError,
        success: false,
        message: authError.message,
      };
    }

    // Update last login timestamp
    if (authData.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);
    }

    return {
      user: authData.user,
      error: null,
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    return {
      user: null,
      error: error as AuthError,
      success: false,
      message: 'An unexpected error occurred during sign in',
    };
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Signed out successfully',
    };
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during sign out',
    };
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Reset password for a user
 */
export const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during password reset',
    };
  }
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    console.error('Unexpected error during password update:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during password update',
    };
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (userRole: string): boolean => {
  return userRole === 'admin';
};

/**
 * Check if user has manager or higher privileges
 */
export const isManagerOrHigher = (userRole: string): boolean => {
  return ['admin', 'manager'].includes(userRole);
};

/**
 * Check if user has supervisor or higher privileges
 */
export const isSupervisorOrHigher = (userRole: string): boolean => {
  return ['admin', 'manager', 'supervisor'].includes(userRole);
};