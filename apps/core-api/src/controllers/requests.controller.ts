import { prisma } from '@borracharia/database';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError, NotFoundError } from '../errors/app-error.js';
import {
  createServiceRequestSchema,
  nearbyRequestsQuerySchema,
  requestIdParamSchema,
} from '../schemas/requests.schemas.js';
import { requestsService } from '../services/requests.service.js';

export async function resolveCustomerId(req: FastifyRequest): Promise<string> {
  const customerIdHeader = (req.headers['x-customer-id'] as string) || undefined;
  const userIdHeader = (req.headers['x-user-id'] as string) || undefined;

  if (customerIdHeader) return customerIdHeader;
  if (!userIdHeader) {
    throw new BadRequestError(
      'Identificação do cliente ausente (envie o header x-user-id ou x-customer-id)',
    );
  }

  // Tenta encontrar perfil por profileId ou por userId
  const profile = await prisma.customerProfile.findFirst({
    where: {
      OR: [{ id: userIdHeader }, { user_id: userIdHeader }],
    },
  });

  if (!profile) {
    throw new NotFoundError(
      `Perfil de cliente não encontrado para o identificador [${userIdHeader}]`,
    );
  }

  return profile.id;
}

export class RequestsController {
  /**
   * POST /requests - Abre um novo chamado de emergência
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    const customerId = await resolveCustomerId(request);
    const body = createServiceRequestSchema.parse(request.body);

    const serviceRequest = await requestsService.createRequest(customerId, body);

    return reply.status(201).send({
      success: true,
      message: 'Chamado de emergência criado com sucesso',
      data: serviceRequest,
    });
  }

  /**
   * GET /requests/nearby - Lista chamados em aberto por proximidade
   */
  async getNearby(request: FastifyRequest, reply: FastifyReply) {
    const query = nearbyRequestsQuerySchema.parse(request.query);

    const nearbyRequests = await requestsService.getNearbyRequests(
      query.latitude,
      query.longitude,
      query.radius_km,
    );

    return reply.status(200).send({
      success: true,
      total: nearbyRequests.length,
      radius_km: query.radius_km,
      data: nearbyRequests,
    });
  }

  /**
   * GET /requests/:id - Detalha um chamado específico
   */
  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = requestIdParamSchema.parse(request.params);

    const serviceRequest = await requestsService.getRequestById(params.id);

    return reply.status(200).send({
      success: true,
      data: serviceRequest,
    });
  }
}

export const requestsController = new RequestsController();
