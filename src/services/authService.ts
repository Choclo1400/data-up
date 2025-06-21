
import api from './api';
import { UserRole } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  permissions: string[];
  createdDate: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Usuarios de prueba para simulación
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Usuario',
    email: 'admin@empresa.com',
    role: UserRole.ADMIN,
    department: 'Sistemas',
    isActive: true,
    twoFactorEnabled: false,
    permissions: ['*'],
    createdDate: '2023-01-01',
    lastLogin: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Manager Usuario',
    email: 'manager@empresa.com',
    role: UserRole.MANAGER,
    department: 'Operaciones',
    isActive: true,
    twoFactorEnabled: false,
    permissions: ['view_reports', 'manage_clients', 'approve_manager', 'create_requests', 'view_requests', 'view_calendar'],
    createdDate: '2023-03-15',
    lastLogin: '2024-01-14T16:45:00Z'
  },
  {
    id: '3',
    name: 'Técnico Usuario',
    email: 'tecnico@empresa.com',
    role: UserRole.TECHNICIAN,
    department: 'Mantenimiento',
    isActive: true,
    twoFactorEnabled: false,
    permissions: ['view_requests', 'view_calendar', 'view_reports'],
    createdDate: '2023-03-15',
    lastLogin: '2024-01-13T08:20:00Z'
  },
  {
    id: '4',
    name: 'Empleado Usuario',
    email: 'empleado@empresa.com',
    role: UserRole.OPERATOR,
    department: 'Producción',
    isActive: true,
    twoFactorEnabled: false,
    permissions: ['view_requests', 'create_requests', 'view_calendar'],
    createdDate: '2023-03-15',
    lastLogin: '2024-01-12T14:30:00Z'
  }
];

// Contraseña para todos los usuarios de prueba
const MOCK_PASSWORD = '123456';

class AuthService {
  private useMockAuth = true; // Cambiar a false para usar API real

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.useMockAuth) {
      return this.mockLogin(credentials);
    }

    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  }

  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error('Credenciales incorrectas. Usa: admin@empresa.com / 123456');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      token,
      user,
      message: 'Login exitoso'
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    if (this.useMockAuth) {
      throw new Error('Registro no disponible en modo simulación');
    }

    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    if (this.useMockAuth) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return;
    }

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMockAuth) {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('No hay usuario autenticado');
      }
      return JSON.parse(userStr);
    }

    const response = await api.get('/auth/me');
    return response.data.user;
  }

  async refreshToken(): Promise<string> {
    if (this.useMockAuth) {
      const user = this.getStoredUser();
      if (!user) {
        throw new Error('No hay usuario para refrescar token');
      }
      const token = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem('authToken', token);
      return token;
    }

    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return token;
  }

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    if (this.useMockAuth) {
      throw new Error('2FA no disponible en modo simulación');
    }

    const response = await api.post('/auth/2fa/enable');
    return response.data;
  }

  async verify2FA(token: string): Promise<void> {
    if (this.useMockAuth) {
      throw new Error('2FA no disponible en modo simulación');
    }

    await api.post('/auth/2fa/verify', { token });
  }

  async disable2FA(token: string): Promise<void> {
    if (this.useMockAuth) {
      throw new Error('2FA no disponible en modo simulación');
    }

    await api.post('/auth/2fa/disable', { token });
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Método para obtener usuarios de prueba (solo en modo mock)
  getMockUsers(): User[] {
    return this.useMockAuth ? MOCK_USERS : [];
  }

  // Método para cambiar entre modo mock y API real
  setMockMode(useMock: boolean): void {
    this.useMockAuth = useMock;
  }
}

export default new AuthService();
