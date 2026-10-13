import { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors/app-error.js';
import { AuthenticatedUser, authService } from '../services/auth.service.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

/**
 * Middleware para validar o token JWT emitido pelo Supabase Auth.
 * Rejeita com HTTP 401 Unauthorized requisições sem token ou com token inválido.
 */
export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    throw new UnauthorizedError(
      'Token de autenticação não fornecido. Envie o cabeçalho Authorization: Bearer <token>',
    );
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError('Token de autenticação vazio');
  }

  const user = await authService.verifyToken(token);
  if (!user) {
    throw new UnauthorizedError('Token de autenticação inválido ou expirado');
  }

  request.user = user;
}
