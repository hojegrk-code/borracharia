import { FastifyInstance } from 'fastify';
import { proposalsController } from '../controllers/proposals.controller.js';
import { requestsController } from '../controllers/requests.controller.js';

export async function requestsRoutes(app: FastifyInstance) {
  // Chamados
  app.post('/requests', requestsController.create);
  app.get('/requests/nearby', requestsController.getNearby);
  app.get('/requests/:id', requestsController.getById);

  // Lances (Proposals)
  app.post('/requests/:id/proposals', proposalsController.create);
  app.get('/requests/:id/proposals', proposalsController.list);

  // Aceite de Lance e Integração Asaas
  app.post('/requests/:id/proposals/:proposalId/accept', proposalsController.accept);
}
