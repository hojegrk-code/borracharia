import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

export * from '@prisma/client';
export { pg };

// Fallback para DIRECT_URL caso apenas DATABASE_URL tenha sido fornecida
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export const pgPool =
  globalForPrisma.pgPool ??
  new pg.Pool({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production' ||
      process.env.DATABASE_URL?.includes('supabase.co') ||
      process.env.DATABASE_URL?.includes('pooler.supabase.com')
        ? { rejectUnauthorized: false }
        : false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pgPool;
}

export default prisma;
