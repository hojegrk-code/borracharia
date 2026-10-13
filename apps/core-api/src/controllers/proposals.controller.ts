import { prisma } from '@borracharia/database';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestError, NotFoundError } from '../errors/app-error.js';
import {
  acceptProposalSchema,
  createProposalSchema,
  requestAndProposalIdParamSchema,
  requestIdParamSchema,
} from '../schemas/requests.schemas.js';
import { proposalsService } from '../services/proposals.service.js';
import { socketService } from '../services/socket.service.js';
import { resolveCustomerId } from './requests.controller.js';

export async function resolveProviderId(req: FastifyRequest): Promise<string> {
  const providerIdHeader = (req.headers['x-provider-id'] as string) || undefined;
  const userIdHeader = (req.headers['x-user-id'] as string) || undefined;

  if (providerIdHeader) return providerIdHeader;
  if (!userIdHeader) {
    throw new BadRequestError(
      'Identificação do prestador ausente (envie o header x-user-id ou x-provider-id)',
    );
  }

  // Tenta encontrar perfil por profileId ou por userId
  const profile = await prisma.providerProfile.findFirst({
    where: {
      OR: [{ id: userIdHeader }, { user_id: userIdHeader }],
    },
  });

  if (!profile) {
    throw new NotFoundError(
      `Perfil de prestador não encontrado para o identificador [${userIdHeader}]`,
    );
  }

  return profile.id;
}

export class ProposalsController {
  /**
   * POST /requests/:id/proposals - Profissional submete um lance
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    const params = requestIdParamSchema.parse(request.params);
    const providerId = await resolveProviderId(request);
    const body = createProposalSchema.parse(request.body);

    const proposal = await proposalsService.createProposal(params.id, providerId, body);

    // Emite evento WebSocket na sala do chamado para notificar o cliente
    socketService.emitNewProposal(params.id, proposal);

    return reply.status(201).send({
      success: true,
      message: 'Lance submetido com sucesso',
      data: proposal,
    });
  }

  /**
   * GET /requests/:id/proposals - Cliente lista lances para o seu chamado
   */
  async list(request: FastifyRequest, reply: FastifyReply) {
    const params = requestIdParamSchema.parse(request.params);

    const proposals = await proposalsService.getProposalsForRequest(params.id);

    return reply.status(200).send({
      success: true,
      total: proposals.length,
      data: proposals,
    });
  }

  /**
   * POST /requests/:id/proposals/:proposalId/accept - Cliente aceita uma proposta e pré-autoriza pagamento
   */
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const params = requestAndProposalIdParamSchema.parse(request.params);
    const customerId = await resolveCustomerId(request);
    const body = acceptProposalSchema.parse(request.body || {});

    const result = await proposalsService.acceptProposal(
      params.id,
      params.proposalId,
      customerId,
      body,
    );

    // Notifica participantes da sala que a proposta foi aceita e o socorrista está a caminho
    socketService.emitProposalAccepted(params.id, result);

    return reply.status(200).send({
      success: true,
      ...result,
    });
  }
}

export const proposalsController = new ProposalsController();
