import { prisma } from '@borracharia/database';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors/app-error.js';
import {
  createServiceRequestSchema,
  nearbyRequestsQuerySchema,
  requestIdParamSchema,
} from '../schemas/requests.schemas.js';
import { authService } from '../services/auth.service.js';
import { requestsService } from '../services/requests.service.js';
import { socketService } from '../services/socket.service.js';

export async function resolveCustomerId(req: FastifyRequest): Promise<string> {
  // 1. Extrai ID do usuário autenticado via Supabase JWT
  if (req.user) {
    const userId = req.user.id;
    let profile = await prisma.customerProfile.findUnique({
      where: { user_id: userId },
    });

    // Se o perfil ainda não existir no PostgreSQL, provisiona automaticamente
    if (!profile) {
      await authService.syncUserAndProfile({
        id: userId,
        email: req.user.email,
        role: 'CUSTOMER',
      });
      profile = await prisma.customerProfile.findUnique({
        where: { user_id: userId },
      });
    }

    if (profile) return profile.id;
  }

  // 2. Fallbacks retrocompatíveis para headers de desenvolvimento
  const customerIdHeader = (req.headers['x-customer-id'] as string) || undefined;
  const userIdHeader = (req.headers['x-user-id'] as string) || undefined;

  if (customerIdHeader) return customerIdHeader;
  if (userIdHeader) {
    const profile = await prisma.customerProfile.findFirst({
      where: {
        OR: [{ id: userIdHeader }, { user_id: userIdHeader }],
      },
    });

    if (profile) return profile.id;
  }

  // Fallback para conveniência de desenvolvimento
  const defaultProfile = await prisma.customerProfile.findFirst();
  if (defaultProfile) {
    return defaultProfile.id;
  }

  throw new UnauthorizedError('Identificação do cliente ausente. Faça login para continuar.');
}

export class RequestsController {
  /**
   * POST /requests - Abre um novo chamado de emergência
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    const customerId = await resolveCustomerId(request);
    const body = createServiceRequestSchema.parse(request.body);

    const serviceRequest = await requestsService.createRequest(customerId, body);

    // Notifica borracheiros conectados via WebSocket
    socketService.emitNewRequest(serviceRequest);

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
