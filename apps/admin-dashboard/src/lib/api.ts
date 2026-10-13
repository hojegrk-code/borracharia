import { getAdminAuthToken } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ProviderItem {
  id: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    phone: string;
    created_at: string;
  };
  cnh_url?: string | null;
  tools_photo_url?: string | null;
  validation_video_url?: string | null;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  asaas_wallet_id?: string | null;
  created_at: string;
  vehicle_types?: string[];
}

export interface AdminStats {
  pending_providers: number;
  approved_providers: number;
  rejected_providers: number;
  total_providers: number;
  total_service_requests: number;
}

class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await getAdminAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Erro HTTP: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Ignora erro de parse de JSON se payload não for JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getPendingProviders(): Promise<{ success: boolean; count: number; data: ProviderItem[] }> {
    return this.request('/admin/providers/pending');
  }

  async getAllProviders(
    status?: string,
  ): Promise<{ success: boolean; total: number; count: number; data: ProviderItem[] }> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/admin/providers${query}`);
  }

  async updateProviderStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    rejection_reason?: string,
  ): Promise<{ success: boolean; message: string; data: ProviderItem }> {
    return this.request(`/admin/providers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        rejection_reason,
      }),
    });
  }

  async getStats(): Promise<{ success: boolean; data: AdminStats }> {
    return this.request('/admin/stats');
  }

  async syncUser(role = 'ADMIN', phone?: string): Promise<any> {
    return this.request('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({ role, phone }),
    });
  }
}

export const adminApi = new AdminApiClient(API_BASE_URL);
