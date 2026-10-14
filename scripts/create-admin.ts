import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { prisma, Role } from '@borracharia/database';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

// Função auxiliar para carregar múltiplos .env se existirem
function loadEnvFiles() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'apps/core-api/.env'),
    path.resolve(process.cwd(), 'apps/admin-dashboard/.env'),
    path.resolve(process.cwd(), 'packages/database/.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [k, ...v] = trimmed.split('=');
            const key = k.trim();
            const val = v
              .join('=')
              .trim()
              .replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }
}

loadEnvFiles();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@borracharia.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_ROLE: Role = Role.ADMIN;
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+5511999990000';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function createAdminAccount() {
  console.log('\n============================================================');
  console.log('👑 [BorracharIA] Provisionamento da Conta Master de Administrador');
  console.log('============================================================\n');

  console.log(`📌 Alvo de Provisionamento:`);
  console.log(`   - E-mail: ${ADMIN_EMAIL}`);
  console.log(`   - Senha:  ${'*'.repeat(ADMIN_PASSWORD.length)} (${ADMIN_PASSWORD})`);
  console.log(`   - Role:   ${ADMIN_ROLE}\n`);

  let supabaseUserId: string | null = null;
  let supabaseStatus = 'SKIPPED_OR_MOCK';

  // 1. Tentar provisionar via Supabase Auth se houver URL válida de produção
  const isRealSupabase =
    SUPABASE_URL &&
    !SUPABASE_URL.includes('mock-borracharia') &&
    (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);

  if (isRealSupabase) {
    console.log(`🌐 Conectando ao Supabase Auth (${SUPABASE_URL})...`);
    try {
      if (SUPABASE_SERVICE_ROLE_KEY) {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        // Tenta criar via Auth Admin API
        const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { role: 'ADMIN' },
        });

        if (!createError && createData.user) {
          supabaseUserId = createData.user.id;
          supabaseStatus = 'CREATED_IN_SUPABASE_AUTH';
          console.log(`✔ Usuário criado com sucesso no Supabase Auth: ID ${supabaseUserId}`);
        } else if (createError) {
          console.log(
            `ℹ Supabase createUser retornou: ${createError.message}. Tentando atualizar...`,
          );
          // Se o usuário já existe, pesquisa e atualiza
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersData?.users?.find(
            (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
          );

          if (existingUser) {
            supabaseUserId = existingUser.id;
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              password: ADMIN_PASSWORD,
              user_metadata: { role: 'ADMIN' },
              email_confirm: true,
            });
            supabaseStatus = 'UPDATED_IN_SUPABASE_AUTH';
            console.log(
              `✔ Senha e metadados de ADMIN atualizados no Supabase Auth para ID ${supabaseUserId}`,
            );
          }
        }
      } else if (SUPABASE_ANON_KEY) {
        // Fallback com Anon Key via signUp
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: signData, error: signError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: { role: 'ADMIN' },
          },
        });

        if (!signError && signData.user) {
          supabaseUserId = signData.user.id;
          supabaseStatus = 'SIGNED_UP_IN_SUPABASE_AUTH';
          console.log(`✔ Cadastro efetuado no Supabase Auth: ID ${supabaseUserId}`);
        } else {
          console.log(`ℹ SignUp Supabase: ${signError?.message || 'Sem resposta'}`);
        }
      }
    } catch (err: any) {
      console.warn(`⚠ Falha na comunicação com Supabase Auth: ${err.message}`);
    }
  } else {
    console.log(
      `ℹ Supabase configurado em modo mock/local (${SUPABASE_URL || 'mock'}). Provisionando diretamente no PostgreSQL...`,
    );
  }

  // 2. Provisionar no PostgreSQL (Prisma)
  console.log(`\n🗄️ Sincronizando com o banco de dados PostgreSQL...`);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    let adminUser;
    if (existingUser) {
      adminUser = await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: {
          role: ADMIN_ROLE,
          ...(supabaseUserId ? { id: supabaseUserId } : {}),
        },
      });
      console.log(`✔ Usuário existente atualizado para role ADMIN no banco: ID ${adminUser.id}`);
    } else {
      adminUser = await prisma.user.create({
        data: {
          id: supabaseUserId || randomUUID(),
          email: ADMIN_EMAIL,
          phone: ADMIN_PHONE,
          role: ADMIN_ROLE,
        },
      });
      console.log(`✔ Novo usuário ADMIN criado no banco: ID ${adminUser.id}`);
    }

    console.log('\n============================================================');
    console.log('🎉 PROVISIONAMENTO DE ADMINISTRADOR CONCLUÍDO COM SUCESSO!');
    console.log('============================================================');
    console.log(`- E-mail:       ${adminUser.email}`);
    console.log(`- Senha:        ${ADMIN_PASSWORD}`);
    console.log(`- Role:         ${adminUser.role}`);
    console.log(`- Telefone:     ${adminUser.phone}`);
    console.log(`- Database ID:  ${adminUser.id}`);
    console.log(`- Supabase Auth:${supabaseStatus}`);
    console.log('============================================================\n');
  } catch (dbErr: any) {
    console.error(`❌ Erro ao provisionar usuário no banco de dados:`, dbErr);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminAccount().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
