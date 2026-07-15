const BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // Convenience methods
  tasks = {
    list: (params?: Record<string, string>) => this.get<any[]>('/tasks', params),
    get: (id: string) => this.get<any>(`/tasks/${id}`),
    create: (data: any) => this.post<any>('/tasks', data),
    update: (id: string, data: any) => this.patch<any>(`/tasks/${id}`, data),
    delete: (id: string) => this.delete(`/tasks/${id}`),
    comments: {
      list: (taskId: string) => this.get<any[]>(`/tasks/${taskId}/comments`),
      create: (taskId: string, data: any) => this.post<any>(`/tasks/${taskId}/comments`, data),
    },
  };

  projects = {
    list: (params?: Record<string, string>) => this.get<any[]>('/projects', params),
    get: (id: string) => this.get<any>(`/projects/${id}`),
    create: (data: any) => this.post<any>('/projects', data),
    update: (id: string, data: any) => this.patch<any>(`/projects/${id}`, data),
    delete: (id: string) => this.delete(`/projects/${id}`),
    archive: (id: string) => this.post(`/projects/${id}/archive`),
    restore: (id: string) => this.post(`/projects/${id}/restore`),
    duplicate: (id: string) => this.post<any>(`/projects/${id}/duplicate`),
    statistics: (id: string) => this.get<any>(`/projects/${id}/statistics`),
    tasks: (id: string, params?: Record<string, string>) => this.get<any[]>(`/projects/${id}/tasks`, params),
  };

  teams = {
    list: () => this.get<any[]>('/teams'),
    get: (id: string) => this.get<any>(`/teams/${id}`),
    create: (data: any) => this.post<any>('/teams', data),
    update: (id: string, data: any) => this.patch<any>(`/teams/${id}`, data),
    members: (id: string) => this.get<any[]>(`/teams/${id}/members`),
    addMember: (id: string, data: any) => this.post<any>(`/teams/${id}/members`, data),
  };

  sprints = {
    list: (params?: Record<string, string>) => this.get<any[]>('/sprints', params),
    get: (id: string) => this.get<any>(`/sprints/${id}`),
    create: (data: any) => this.post<any>('/sprints', data),
    update: (id: string, data: any) => this.patch<any>(`/sprints/${id}`, data),
    start: (id: string) => this.post(`/sprints/${id}/start`),
    complete: (id: string) => this.post(`/sprints/${id}/complete`),
  };

  timeEntries = {
    list: (params?: Record<string, string>) => this.get<any[]>('/time-entries', params),
    create: (data: any) => this.post<any>('/time-entries', data),
    start: (data: any) => this.post<any>('/time-entries/start', data),
    stop: (data: any) => this.post<any>('/time-entries/stop', data),
    summary: (params?: Record<string, string>) => this.get<any>('/time-entries/summary', params),
  };

  analytics = {
    get: (params?: Record<string, string>) => this.get<any>('/analytics', params),
    events: (data: any) => this.post('/analytics/events', data),
  };

  webhooks = {
    list: () => this.get<any[]>('/webhooks'),
    create: (data: any) => this.post<any>('/webhooks', data),
    update: (id: string, data: any) => this.patch<any>(`/webhooks/${id}`, data),
    delete: (id: string) => this.delete(`/webhooks/${id}`),
    test: (id: string) => this.post(`/webhooks/${id}/test`),
    logs: (id: string) => this.get<any[]>(`/webhooks/${id}/logs`),
  };

  notifications = {
    list: (params?: Record<string, string>) => this.get<any>('/notifications', params),
    markRead: (id?: string) => this.patch('/notifications', id ? { id } : { readAll: true }),
  };

  search = (query: string, type?: string) => this.get<any>('/search', { q: query, ...(type && { type }) });
}

export const api = new ApiClient();
export default api;