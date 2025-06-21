
import api from './api';
import { UserRole } from '../types';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  isActive?: boolean;
}

class UserService {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number; pages: number }> {
    const response = await api.get('/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.user;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data.user;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async changeUserRole(id: string, role: UserRole): Promise<User> {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data.user;
  }

  async toggleUserStatus(id: string): Promise<User> {
    const response = await api.put(`/users/${id}/toggle-status`);
    return response.data.user;
  }

  async resetUserPassword(id: string): Promise<{ tempPassword: string }> {
    const response = await api.post(`/users/${id}/reset-password`);
    return response.data;
  }
}

export default new UserService();
