import { prisma, ServiceRequestStatus } from '@borracharia/database';
import { BadRequestError, NotFoundError } from '../errors/app-error.js';
import { CreateServiceRequestInput } from '../schemas/requests.schemas.js';

export interface NearbyRequestResult {
  id: string;
  customer_id: string;
  service_type_id: string;
  service_name: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: Date;
  distance_km: number;
}

export class RequestsService {
  /**
   * Cria um novo chamado de emergência para o cliente
   */
  async createRequest(customerId: string, input: CreateServiceRequestInput) {
    // 1. Validar se o cliente existe
    const customer = await prisma.customerProfile.findUnique({
      where: { id: customerId },
      include: { user: true },
    });

    if (!customer) {
      throw new NotFoundError(`Perfil de cliente não encontrado para o ID [${customerId}]`);
    }

    // 2. Validar se o tipo de serviço existe e está ativo
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: input.service_type_id },
    });

    if (!serviceType) {
      throw new NotFoundError(`Tipo de serviço [${input.service_type_id}] não encontrado`);
    }

    if (!serviceType.is_active) {
      throw new BadRequestError(`O serviço [${serviceType.name}] está temporariamente inativo`);
    }

    // 3. Criar o chamado com status inicial CREATED
    const request = await prisma.serviceRequest.create({
      data: {
        customer_id: customerId,
        service_type_id: input.service_type_id,
        latitude: input.latitude,
        longitude: input.longitude,
        status: ServiceRequestStatus.CREATED,
      },
      include: {
        service_type: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return request;
  }

  /**
   * Busca chamados em aberto (CREATED, SEARCHING_PROVIDER) baseados em raio de coordenadas
   * utilizando query geoespacial via Prisma.
   */
  async getNearbyRequests(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<NearbyRequestResult[]> {
    const radiusMeters = radiusKm * 1000;

    try {
      // Tentativa 1: Consulta geoespacial utilizando PostGIS ST_DistanceSphere nativo
      const results = await prisma.$queryRaw<
        Array<{
          id: string;
          customer_id: string;
          service_type_id: string;
          service_name: string;
          latitude: number;
          longitude: number;
          status: string;
          created_at: Date;
          distance_meters: number;
        }>
      >`
        SELECT 
          sr.id,
          sr.customer_id,
          sr.service_type_id,
          st.name AS service_name,
          sr.latitude,
          sr.longitude,
          sr.status::text AS status,
          sr.created_at,
          ST_DistanceSphere(
            ST_MakePoint(sr.longitude, sr.latitude),
            ST_MakePoint(${longitude}, ${latitude})
          ) AS distance_meters
        FROM service_requests sr
        JOIN service_types st ON st.id = sr.service_type_id
        WHERE sr.status IN ('CREATED', 'SEARCHING_PROVIDER', 'PROPOSALS_RECEIVED')
          AND ST_DistanceSphere(
            ST_MakePoint(sr.longitude, sr.latitude),
            ST_MakePoint(${longitude}, ${latitude})
          ) <= ${radiusMeters}
        ORDER BY distance_meters ASC;
      `;

      return results.map((r) => ({
        ...r,
        distance_km: Number((r.distance_meters / 1000).toFixed(2)),
      }));
    } catch {
      // Fallback gracioso: Caso a extensão PostGIS não esteja instalada no ambiente local,
      // calcula a distância esférica precisa via fórmula de Haversine em SQL puro
      const fallbackResults = await prisma.$queryRaw<
        Array<{
          id: string;
          customer_id: string;
          service_type_id: string;
          service_name: string;
          latitude: number;
          longitude: number;
          status: string;
          created_at: Date;
          distance_km: number;
        }>
      >`
        SELECT 
          sr.id,
          sr.customer_id,
          sr.service_type_id,
          st.name AS service_name,
          sr.latitude,
          sr.longitude,
          sr.status::text AS status,
          sr.created_at,
          (
            6371 * acos(
              LEAST(1.0, GREATEST(-1.0, 
                cos(radians(${latitude})) * cos(radians(sr.latitude)) * 
                cos(radians(sr.longitude) - radians(${longitude})) + 
                sin(radians(${latitude})) * sin(radians(sr.latitude))
              ))
            )
          ) AS distance_km
        FROM service_requests sr
        JOIN service_types st ON st.id = sr.service_type_id
        WHERE sr.status IN ('CREATED', 'SEARCHING_PROVIDER', 'PROPOSALS_RECEIVED')
          AND (
            6371 * acos(
              LEAST(1.0, GREATEST(-1.0, 
                cos(radians(${latitude})) * cos(radians(sr.latitude)) * 
                cos(radians(sr.longitude) - radians(${longitude})) + 
                sin(radians(${latitude})) * sin(radians(sr.latitude))
              ))
            )
          ) <= ${radiusKm}
        ORDER BY distance_km ASC;
      `;

      return fallbackResults.map((r) => ({
        ...r,
        distance_km: Number(Number(r.distance_km).toFixed(2)),
      }));
    }
  }

  /**
   * Busca um chamado pelo ID com seus relacionamentos
   */
  async getRequestById(id: string) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        service_type: true,
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        proposals: {
          include: {
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundError(`Chamado [${id}] não encontrado`);
    }

    return request;
  }
}

export const requestsService = new RequestsService();
