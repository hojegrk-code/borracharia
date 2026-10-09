import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({
      status: 'ok',
      service: 'borracharia-core-api',
      timestamp: new Date().toISOString(),
    });
  });
}
