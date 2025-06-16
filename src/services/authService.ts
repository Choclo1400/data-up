import api from './api';

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
  role: string;
  department?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
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
    const response = await api.get('/auth/me');
    return response.data.user;
  }

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return token;
  }

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await api.post('/auth/2fa/enable');
    return response.data;
  }

  async verify2FA(token: string): Promise<void> {
    await api.post('/auth/2fa/verify', { token });
  }

  async disable2FA(token: string): Promise<void> {
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
}

export default new AuthService();