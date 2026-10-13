import cors from '@fastify/cors';
import Fastify from 'fastify';
import { globalErrorHandler } from './errors/app-error.js';
import { adminRoutes } from './routes/admin.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { healthRoutes } from './routes/health.routes.js';
import { requestsRoutes } from './routes/requests.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // CORS
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-user-id',
      'x-customer-id',
      'x-provider-id',
      'x-user-role',
    ],
  });

  // Tratamento Global de Erros (Zod, AppError, 500 sem vazamento de stack trace)
  app.setErrorHandler((error, request, reply) => {
    return globalErrorHandler(error, request, reply);
  });

  // Registro de rotas
  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(requestsRoutes);
  app.register(adminRoutes);

  return app;
}
