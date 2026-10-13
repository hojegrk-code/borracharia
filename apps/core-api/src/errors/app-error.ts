import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 402, 'PAYMENT_REQUIRED', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Acesso não autorizado', details?: unknown) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado para este perfil', details?: unknown) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export function globalErrorHandler(error: any, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: 'Erro de validação nos dados de entrada',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: error.flatten().fieldErrors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    });
  }

  // Fastify standard schema errors
  if (error && typeof error.statusCode === 'number') {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message || 'Erro na requisição',
      code: error.code || 'HTTP_ERROR',
      statusCode: error.statusCode,
    });
  }

  // Generic internal server error (never leak raw stack trace)
  return reply.status(500).send({
    success: false,
    error: 'Ocorreu um erro interno no servidor',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  });
}
