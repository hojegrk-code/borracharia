const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

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
}

export const api = new ApiClient();
