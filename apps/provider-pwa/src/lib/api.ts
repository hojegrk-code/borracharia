const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export class ProviderApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getNearbyRequests(
    latitude: number,
    longitude: number,
    radiusKm = 15,
  ): Promise<NearbyRequest[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/requests/nearby?latitude=${latitude}&longitude=${longitude}&radius_km=${radiusKm}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

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
}

export const providerApi = new ProviderApiClient();
