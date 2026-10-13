import { prisma } from '@borracharia/database';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error.js';
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

/**
 * Middleware para garantir que o usuário autenticado possui perfil de Administrador (ADMIN).
 * Rejeita com HTTP 403 Forbidden se o usuário não for ADMIN.
 */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.user) {
    await authenticate(request, reply);
  }

  if (!request.user) {
    throw new UnauthorizedError('Autenticação necessária');
  }

  let role = request.user.role;
  if (role !== 'ADMIN') {
    const dbUser = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { role: true },
    });
    if (dbUser?.role === 'ADMIN') {
      role = 'ADMIN';
      request.user.role = 'ADMIN';
    }
  }

  if (role !== 'ADMIN') {
    throw new ForbiddenError(
      'Acesso restrito. Esta rota exige privilégios de Administrador (ADMIN)',
    );
  }
}
