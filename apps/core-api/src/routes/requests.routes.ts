import { prisma } from '@borracharia/database';
import { FastifyInstance } from 'fastify';
import { proposalsController } from '../controllers/proposals.controller.js';
import { requestsController } from '../controllers/requests.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

export async function requestsRoutes(app: FastifyInstance) {
  // Catálogo de Serviços (Consulta pública de tabela base de preços)
  app.get('/service-types', async (_req, reply) => {
    const types = await prisma.serviceType.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
    return reply.status(200).send({
      success: true,
      data: types,
    });
  });

  // Chamados (Protegidos por Supabase JWT)
  app.post('/requests', { preHandler: [authenticate] }, requestsController.create);
  app.get('/requests/nearby', { preHandler: [authenticate] }, requestsController.getNearby);
  app.get('/requests/:id', { preHandler: [authenticate] }, requestsController.getById);

  // Lances (Proposals) (Protegidos por Supabase JWT)
  app.post('/requests/:id/proposals', { preHandler: [authenticate] }, proposalsController.create);
  app.get('/requests/:id/proposals', { preHandler: [authenticate] }, proposalsController.list);

  // Aceite de Lance e Integração Asaas (Protegido por Supabase JWT)
  app.post(
    '/requests/:id/proposals/:proposalId/accept',
    { preHandler: [authenticate] },
    proposalsController.accept,
  );
}
