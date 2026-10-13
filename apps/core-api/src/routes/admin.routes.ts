import { prisma, ProviderStatus } from '@borracharia/database';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { NotFoundError } from '../errors/app-error.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

const updateProviderStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejection_reason: z.string().optional(),
});

const providerIdParamSchema = z.object({
  id: z.string().uuid({ message: 'O ID do perfil deve ser um UUID válido' }),
});

const listProvidersQuerySchema = z.object({
  status: z.enum(['PENDING_REVIEW', 'APPROVED', 'REJECTED']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export async function adminRoutes(app: FastifyInstance) {
  // Todas as rotas administrativas exigem token JWT com perfil ADMIN
  app.addHook('preHandler', requireAdmin);

  /**
   * GET /admin/stats - Métricas do Marketplace para o painel de controle
   */
  app.get('/admin/stats', async (_req, reply) => {
    const [pendingCount, approvedCount, rejectedCount, totalRequests] = await Promise.all([
      prisma.providerProfile.count({ where: { status: ProviderStatus.PENDING_REVIEW } }),
      prisma.providerProfile.count({ where: { status: ProviderStatus.APPROVED } }),
      prisma.providerProfile.count({ where: { status: ProviderStatus.REJECTED } }),
      prisma.serviceRequest.count(),
    ]);

    return reply.status(200).send({
      success: true,
      data: {
        pending_providers: pendingCount,
        approved_providers: approvedCount,
        rejected_providers: rejectedCount,
        total_providers: pendingCount + approvedCount + rejectedCount,
        total_service_requests: totalRequests,
      },
    });
  });

  /**
   * GET /admin/providers/pending - Lista os perfis de profissionais aguardando revisão
   */
  app.get('/admin/providers/pending', async (_req, reply) => {
    const pendingProviders = await prisma.providerProfile.findMany({
      where: {
        status: ProviderStatus.PENDING_REVIEW,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            created_at: true,
          },
        },
        vehicle_types: {
          include: {
            vehicle_type: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const formatted = pendingProviders.map((provider) => ({
      id: provider.id,
      user_id: provider.user_id,
      user: provider.user,
      cnh_url: provider.cnh_url,
      tools_photo_url: provider.tools_photo_url,
      validation_video_url: provider.validation_video_url,
      status: provider.status,
      asaas_wallet_id: provider.asaas_wallet_id,
      created_at: provider.created_at,
      vehicle_types: provider.vehicle_types.map((vt) => vt.vehicle_type.name),
    }));

    return reply.status(200).send({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  });

  /**
   * GET /admin/providers - Lista prestadores com filtro opcional de status
   */
  app.get('/admin/providers', async (request, reply) => {
    const query = listProvidersQuerySchema.parse(request.query || {});

    const whereClause = query.status ? { status: query.status } : {};

    const providers = await prisma.providerProfile.findMany({
      where: whereClause,
      take: query.limit,
      skip: query.offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            created_at: true,
          },
        },
        vehicle_types: {
          include: {
            vehicle_type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await prisma.providerProfile.count({
      where: whereClause,
    });

    const formatted = providers.map((provider) => ({
      id: provider.id,
      user_id: provider.user_id,
      user: provider.user,
      cnh_url: provider.cnh_url,
      tools_photo_url: provider.tools_photo_url,
      validation_video_url: provider.validation_video_url,
      status: provider.status,
      asaas_wallet_id: provider.asaas_wallet_id,
      created_at: provider.created_at,
      vehicle_types: provider.vehicle_types.map((vt) => vt.vehicle_type.name),
    }));

    return reply.status(200).send({
      success: true,
      total,
      count: formatted.length,
      data: formatted,
    });
  });

  /**
   * PATCH /admin/providers/:id/status - Altera o status do profissional (APPROVED/REJECTED)
   */
  app.patch('/admin/providers/:id/status', async (request, reply) => {
    const params = providerIdParamSchema.parse(request.params);
    const body = updateProviderStatusSchema.parse(request.body);

    const existingProvider = await prisma.providerProfile.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingProvider) {
      throw new NotFoundError(`Perfil de profissional com ID [${params.id}] não foi encontrado.`);
    }

    // Se estiver sendo aprovado e ainda não tiver asaas_wallet_id, cria um identificador
    const walletId =
      body.status === 'APPROVED' && !existingProvider.asaas_wallet_id
        ? `wal_asaas_${existingProvider.id.substring(0, 8)}`
        : existingProvider.asaas_wallet_id;

    const updatedProvider = await prisma.providerProfile.update({
      where: { id: params.id },
      data: {
        status: body.status as ProviderStatus,
        asaas_wallet_id: walletId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return reply.status(200).send({
      success: true,
      message: `Profissional ${body.status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso!`,
      data: {
        id: updatedProvider.id,
        user_id: updatedProvider.user_id,
        user: updatedProvider.user,
        status: updatedProvider.status,
        asaas_wallet_id: updatedProvider.asaas_wallet_id,
        updated_at: updatedProvider.updated_at,
      },
    });
  });
}
