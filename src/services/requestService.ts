import api from './api';

export interface Request {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  requestedBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  client?: {
    _id: string;
    name: string;
  };
  scheduledDate?: string;
  completedDate?: string;
  attachments: string[];
  comments: Array<{
    _id: string;
    text: string;
    author: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client?: string;
  scheduledDate?: string;
}

export interface UpdateRequestData {
  title?: string;
  description?: string;
  type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  assignedTo?: string;
  scheduledDate?: string;
}

class RequestService {
  async getRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    type?: string;
    assignedTo?: string;
  }): Promise<{ requests: Request[]; total: number; pages: number }> {
    const response = await api.get('/requests', { params });
    return response.data;
  }

  async getRequestById(id: string): Promise<Request> {
    const response = await api.get(`/requests/${id}`);
    return response.data.request;
  }

  async createRequest(data: CreateRequestData): Promise<Request> {
    const response = await api.post('/requests', data);
    return response.data.request;
  }

  async updateRequest(id: string, data: UpdateRequestData): Promise<Request> {
    const response = await api.put(`/requests/${id}`, data);
    return response.data.request;
  }

  async deleteRequest(id: string): Promise<void> {
    await api.delete(`/requests/${id}`);
  }

  async approveRequest(id: string, comment?: string): Promise<Request> {
    const response = await api.post(`/requests/${id}/approve`, { comment });
    return response.data.request;
  }

  async rejectRequest(id: string, reason: string): Promise<Request> {
    const response = await api.post(`/requests/${id}/reject`, { reason });
    return response.data.request;
  }

  async addComment(id: string, text: string): Promise<Request> {
    const response = await api.post(`/requests/${id}/comments`, { text });
    return response.data.request;
  }

  async uploadAttachment(id: string, file: File): Promise<Request> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/requests/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.request;
  }

  async getMyRequests(): Promise<Request[]> {
    const response = await api.get('/requests/my');
    return response.data.requests;
  }

  async getAssignedRequests(): Promise<Request[]> {
    const response = await api.get('/requests/assigned');
    return response.data.requests;
  }
}

export default new RequestService();