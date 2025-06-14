
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for authentication
const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    name: 'Admin Sistema',
    email: 'admin@inmel.cl',
    role: UserRole.ADMIN,
    permissions: ['create_requests', 'edit_requests', 'delete_requests', 'manage_clients', 'manage_technicians', 'manage_users', 'view_reports', 'system_config', 'manage_services', 'manage_employees'],
    isActive: true
  },
  {
    id: 'user-2',
    name: 'Juan Supervisor',
    email: 'supervisor@inmel.cl',
    role: UserRole.SUPERVISOR,
    permissions: ['create_requests', 'edit_requests', 'approve_requests', 'view_reports', 'manage_technicians'],
    isActive: true
  },
  {
    id: 'user-3',
    name: 'María Gestora',
    email: 'gestor@inmel.cl',
    role: UserRole.MANAGER,
    permissions: ['create_requests', 'edit_requests', 'approve_manager', 'view_reports'],
    isActive: true
  },
  {
    id: 'user-4',
    name: 'Carlos Empleado',
    email: 'empleado@inmel.cl',
    role: UserRole.OPERATOR,
    permissions: ['create_requests', 'view_requests'],
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would call your API
    const foundUser = mockUsers.find(u => u.email === email && u.isActive);
    
    if (foundUser && password === 'password123') { // Mock password check
      setUser(foundUser);
      localStorage.setItem('authUser', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
      hasRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
