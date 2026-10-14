import { getAuthToken, getProviderAuthToken, getAdminAuthToken } from './supabase';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(
  /\/$/,
  '',
);

// ==========================================
// Tipagens Compartilhadas
// ==========================================
export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  estimated_base_price_min: string | number;
  estimated_base_price_max: string | number;
  is_active: boolean;
}

export interface CreateRequestPayload {
  service_type_id: string;
  latitude: number;
  longitude: number;
}

export interface ServiceRequestResponse {
  id: string;
  customer_id: string;
  service_type_id: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  service_type: {
    id: string;
    name: string;
    estimated_base_price_min: string | number;
    estimated_base_price_max: string | number;
  };
}

export interface NearbyRequest {
  id: string;
  customer_id: string;
  service_type_id: string;
  service_name: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  distance_km: number;
}

export interface SubmitProposalPayload {
  proposed_price: number;
  estimated_arrival_time_mins: number;
}

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

// ==========================================
// Cliente da API de Cliente (/app)
// ==========================================
export class CustomerApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(
    customHeaders?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const response = await fetch(`${this.baseUrl}/service-types`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Falha ao obter tipos de serviço: HTTP ${response.status}`);
      }

      const json = await response.json();
      return json.data || [];
    } catch (err) {
      console.warn('Não foi possível carregar serviços via API, utilizando fallback local:', err);
      return [
        {
          id: '3323865b-af3a-40ac-9d6a-1dfecf1c55e4',
          name: 'Troca de Pneu Emergencial',
          description: 'Substituição rápida por estepe ou socorro no local',
          estimated_base_price_min: 80,
          estimated_base_price_max: 180,
          is_active: true,
        },
        {
          id: '9060403c-9a9b-46bc-a6ba-f34988199d17',
          name: 'Calibragem e Vulcanização',
          description: 'Reparo de furos e calibragem imediata',
          estimated_base_price_min: 40,
          estimated_base_price_max: 90,
          is_active: true,
        },
      ];
    }
  }

  async createServiceRequest(
    payload: CreateRequestPayload,
    customerId?: string,
  ): Promise<ServiceRequestResponse> {
    const headers = await this.getHeaders();
    if (customerId) {
      headers['x-customer-id'] = customerId;
    }

    const response = await fetch(`${this.baseUrl}/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || `Erro ao solicitar socorro: HTTP ${response.status}`);
    }
    return json.data;
  }

  async syncUserWithBackend(role = 'CUSTOMER', phone?: string) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/auth/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role, phone }),
    });
    return response.json();
  }
}

// ==========================================
// Cliente da API de Prestador (/pro)
// ==========================================
export class ProviderApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(
    customHeaders?: Record<string, string>,
  ): Promise<Record<string, string>> {
    const token = await getProviderAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getNearbyRequests(
    latitude: number,
    longitude: number,
    radiusKm = 15,
  ): Promise<NearbyRequest[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${this.baseUrl}/requests/nearby?latitude=${latitude}&longitude=${longitude}&radius_km=${radiusKm}`,
        {
          method: 'GET',
          headers,
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        throw new Error(`Falha ao buscar chamados próximos: HTTP ${response.status}`);
      }

      const json = await response.json();
      return json.data || [];
    } catch (err) {
      console.warn('Não foi possível buscar chamados da API:', err);
      return [];
    }
  }

  async submitProposal(requestId: string, payload: SubmitProposalPayload, providerId?: string) {
    const headers = await this.getHeaders();
    if (providerId) {
      headers['x-provider-id'] = providerId;
    }

    const response = await fetch(`${this.baseUrl}/requests/${requestId}/proposals`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || `Erro ao submeter proposta: HTTP ${response.status}`);
    }
    return json.data;
  }

  async syncUserWithBackend(role = 'PROVIDER', phone?: string) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/auth/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role, phone }),
    });
    return response.json();
  }
}

// ==========================================
// Cliente da API de Administração (/admin)
// ==========================================
export class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
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
        // ignore
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

// Instâncias prontas para exportação
export const api = new CustomerApiClient();
export const providerApi = new ProviderApiClient();
export const adminApi = new AdminApiClient();
