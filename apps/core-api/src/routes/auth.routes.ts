import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authService } from '../services/auth.service.js';
import { Role } from '@borracharia/database';

const syncUserSchema = z.object({
  role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
  phone: z.string().optional(),
});

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /auth/sync - Sincroniza o usuário autenticado do Supabase com o PostgreSQL
   */
  app.post('/auth/sync', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user!;
    const body = syncUserSchema.parse(request.body || {});

    const result = await authService.syncUserAndProfile({
      id: user.id,
      email: user.email,
      role: (body.role as Role) || Role.CUSTOMER,
      phone: body.phone,
    });

    return reply.status(200).send({
      success: true,
      message: 'Usuário e perfil sincronizados no banco de dados com sucesso',
      data: result,
    });
  });

  /**
   * GET /auth/me - Retorna informações do usuário atual
   */
  app.get('/auth/me', { preHandler: [authenticate] }, async (request, reply) => {
    return reply.status(200).send({
      success: true,
      data: request.user,
    });
  });
}
