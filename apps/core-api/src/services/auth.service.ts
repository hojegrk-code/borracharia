import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { prisma, Role } from '@borracharia/database';

export interface AuthenticatedUser {
  id: string; // Supabase user ID (UUID)
  email: string;
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_JWT_SECRET =
  process.env.SUPABASE_JWT_SECRET || 'borracharia-dev-secret-super-safe-jwt-2026';

let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('mock-borracharia')) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

export class AuthService {
  /**
   * Valida o token JWT emitido pelo Supabase Auth.
   * Suporta validação via supabase.auth.getUser() e fallback via verificação de assinatura JWT (HS256).
   */
  async verifyToken(token: string): Promise<AuthenticatedUser | null> {
    if (!token) return null;

    // 1. Tenta validar diretamente com o Supabase Auth API se o cliente estiver configurado
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (!error && data.user) {
          const userMeta = data.user.user_metadata || {};
          return {
            id: data.user.id,
            email: data.user.email || '',
            role: (userMeta.role as 'CUSTOMER' | 'PROVIDER' | 'ADMIN') || 'CUSTOMER',
          };
        }
      } catch (err) {
        console.warn(
          '[AuthService] Falha ao verificar token via Supabase client, tentando verificação JWT local:',
          err,
        );
      }
    }

    // 2. Validação local via secret JWT (Supabase JWT Secret ou segredo de desenvolvimento)
    try {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as any;
      if (decoded && (decoded.sub || decoded.id)) {
        const id = decoded.sub || decoded.id;
        const email = decoded.email || '';
        const role =
          decoded.role === 'PROVIDER' || decoded.user_metadata?.role === 'PROVIDER'
            ? 'PROVIDER'
            : decoded.role === 'ADMIN' || decoded.user_metadata?.role === 'ADMIN'
              ? 'ADMIN'
              : 'CUSTOMER';

        return { id, email, role };
      }
    } catch {
      // Se não validar com o secret principal, tenta decodificar sem verificação apenas se não for produção (para testes de token simulados)
      if (process.env.NODE_ENV !== 'production') {
        try {
          const decoded = jwt.decode(token) as any;
          if (decoded && (decoded.sub || decoded.id)) {
            const id = decoded.sub || decoded.id;
            const email = decoded.email || '';
            const role =
              decoded.role === 'PROVIDER' || decoded.user_metadata?.role === 'PROVIDER'
                ? 'PROVIDER'
                : decoded.role === 'ADMIN' || decoded.user_metadata?.role === 'ADMIN'
                  ? 'ADMIN'
                  : 'CUSTOMER';
            return { id, email, role };
          }
        } catch {
          // Token completamente inválido
        }
      }
    }

    return null;
  }

  /**
   * Sincroniza ou provisiona o usuário e seu perfil no PostgreSQL após o cadastro no Supabase.
   */
  async syncUserAndProfile(params: {
    id: string;
    email: string;
    role: Role;
    phone?: string | undefined;
  }) {
    const { id, email, role, phone } = params;
    const effectivePhone =
      phone ||
      `+5500${id
        .replace(/[^0-9]/g, '')
        .slice(0, 9)
        .padEnd(9, '0')}`;

    // 1. Cria ou atualiza o registro na tabela User
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        ...(phone ? { phone } : {}),
      },
      create: {
        id,
        email,
        phone: effectivePhone,
        role,
      },
    });

    // 2. Cria o perfil correspondente (CustomerProfile ou ProviderProfile)
    if (role === Role.CUSTOMER) {
      const customerProfile = await prisma.customerProfile.upsert({
        where: { user_id: id },
        update: {},
        create: {
          user_id: id,
        },
      });

      return { user, customerProfile };
    }

    if (role === Role.PROVIDER) {
      const providerProfile = await prisma.providerProfile.upsert({
        where: { user_id: id },
        update: {},
        create: {
          user_id: id,
          status: 'APPROVED',
          asaas_wallet_id: `wal_supabase_${id.substring(0, 8)}`,
        },
      });

      return { user, providerProfile };
    }

    return { user };
  }

  /**
   * Gera um JWT assinado (útil para testes de integração e2e rápidos)
   */
  generateTestToken(user: {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  }): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        user_metadata: { role: user.role },
      },
      SUPABASE_JWT_SECRET,
      { expiresIn: '7d' },
    );
  }
}

export const authService = new AuthService();
