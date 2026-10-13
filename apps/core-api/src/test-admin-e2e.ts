import 'dotenv/config';
import { prisma, ProviderStatus, Role } from '@borracharia/database';
import { randomUUID } from 'crypto';
import { buildApp } from './app.js';
import { authService } from './services/auth.service.js';

const PORT = 3004;
const BASE_URL = `http://localhost:${PORT}`;

async function runAdminE2ETests() {
  console.log('\n============================================================');
  console.log('🛠️ [BorracharIA Core API] - Teste de Integração Admin & Gestão E2E');
  console.log('============================================================\n');

  const app = buildApp();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(
    `[HTTP Server] Subiu na porta ${PORT} para validação de endpoints administrativos.\n`,
  );

  try {
    // 1. Preparar credenciais de teste
    const adminId = randomUUID();
    const adminEmail = `fundador.admin.${Date.now()}@borracharia.com.br`;
    const adminToken = authService.generateTestToken({
      id: adminId,
      email: adminEmail,
      role: 'ADMIN',
    });

    const customerId = randomUUID();
    const customerEmail = `cliente.normal.${Date.now()}@borracharia.com.br`;
    const customerToken = authService.generateTestToken({
      id: customerId,
      email: customerEmail,
      role: 'CUSTOMER',
    });

    // 2. Preparar prestador com status PENDING_REVIEW no banco
    const pendingProviderUser = await prisma.user.create({
      data: {
        email: `borracheiro.candidato.${Date.now()}@borracharia.com.br`,
        phone: `+55119${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: Role.PROVIDER,
        provider_profile: {
          create: {
            status: ProviderStatus.PENDING_REVIEW,
            cnh_url: 'https://storage.borracharia.com.br/docs/cnh-joao-silva.pdf',
            tools_photo_url: 'https://storage.borracharia.com.br/docs/tools-kit-completo.jpg',
            validation_video_url:
              'https://storage.borracharia.com.br/videos/validacao-video-joao.mp4',
          },
        },
      },
      include: { provider_profile: true },
    });

    const providerProfileId = pendingProviderUser.provider_profile!.id;
    console.log(
      `✔ Prestador candidato criado no banco: [${pendingProviderUser.email}] (Profile ID: ${providerProfileId})\n`,
    );

    // -------------------------------------------------------------
    // TESTE 1: GET /admin/providers/pending sem token (401)
    // -------------------------------------------------------------
    console.log('--- TESTE 1: GET /admin/providers/pending sem token (Esperado 401) ---');
    const noAuthRes = await fetch(`${BASE_URL}/admin/providers/pending`);
    console.log(`Status HTTP retornado: ${noAuthRes.status}`);
    if (noAuthRes.status !== 401) {
      throw new Error(`Esperado status 401, recebido: ${noAuthRes.status}`);
    }
    console.log('✅ TESTE 1 APROVADO: Bloqueado sem token (401 Unauthorized)!\n');

    // -------------------------------------------------------------
    // TESTE 2: GET /admin/providers/pending com token de CLIENTE (403)
    // -------------------------------------------------------------
    console.log(
      '--- TESTE 2: GET /admin/providers/pending com token de CUSTOMER (Esperado 403) ---',
    );
    const forbiddenRes = await fetch(`${BASE_URL}/admin/providers/pending`, {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });
    const forbiddenData = (await forbiddenRes.json()) as any;
    console.log(`Status HTTP retornado: ${forbiddenRes.status}`, forbiddenData);
    if (forbiddenRes.status !== 403) {
      throw new Error(`Esperado status 403, recebido: ${forbiddenRes.status}`);
    }
    console.log('✅ TESTE 2 APROVADO: Bloqueado para perfis não-ADMIN (403 Forbidden)!\n');

    // -------------------------------------------------------------
    // TESTE 3: GET /admin/providers/pending com token de ADMIN (200)
    // -------------------------------------------------------------
    console.log('--- TESTE 3: GET /admin/providers/pending como ADMIN (Esperado 200) ---');
    const pendingListRes = await fetch(`${BASE_URL}/admin/providers/pending`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const pendingListData = (await pendingListRes.json()) as any;
    console.log(`Status HTTP retornado: ${pendingListRes.status}`);
    console.log(`Total de pendentes listados: ${pendingListData.count}`);
    const foundPending = pendingListData.data.find((p: any) => p.id === providerProfileId);
    if (!foundPending) {
      throw new Error('Prestador criado não encontrado na listagem de pendentes');
    }
    console.log('Dados do prestador retornado:', {
      id: foundPending.id,
      email: foundPending.user.email,
      cnh: foundPending.cnh_url,
      tools: foundPending.tools_photo_url,
      video: foundPending.validation_video_url,
      status: foundPending.status,
    });
    console.log('✅ TESTE 3 APROVADO: Lista de pendentes recuperada com sucesso pelo Admin!\n');

    // -------------------------------------------------------------
    // TESTE 4: PATCH /admin/providers/:id/status (Aprovação de Prestador)
    // -------------------------------------------------------------
    console.log(`--- TESTE 4: PATCH /admin/providers/${providerProfileId}/status -> APPROVED ---`);
    const approveRes = await fetch(`${BASE_URL}/admin/providers/${providerProfileId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'APPROVED',
      }),
    });
    const approveData = (await approveRes.json()) as any;
    console.log(`Status HTTP retornado: ${approveRes.status}`, approveData);
    if (approveRes.status !== 200 || !approveData.success) {
      throw new Error('Falha ao aprovar prestador');
    }

    // Verificar se o status atualizou no banco de dados
    const updatedDb = await prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });
    if (updatedDb?.status !== ProviderStatus.APPROVED) {
      throw new Error(`Status no banco não é APPROVED. Atual: ${updatedDb?.status}`);
    }
    console.log(
      `Status confirmado no PostgreSQL: ${updatedDb.status} | Asaas Wallet: ${updatedDb.asaas_wallet_id}`,
    );
    console.log('✅ TESTE 4 APROVADO: Profissional aprovado e refletido imediatamente no banco!\n');

    // -------------------------------------------------------------
    // TESTE 5: GET /admin/stats (Métricas administrativas)
    // -------------------------------------------------------------
    console.log('--- TESTE 5: GET /admin/stats ---');
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const statsData = (await statsRes.json()) as any;
    console.log(`Status HTTP retornado: ${statsRes.status}`, statsData.data);
    if (statsRes.status !== 200 || typeof statsData.data.approved_providers !== 'number') {
      throw new Error('Falha ao buscar estatísticas');
    }
    console.log('✅ TESTE 5 APROVADO: Métricas do dashboard consultadas com sucesso!\n');

    console.log('============================================================');
    console.log('🎉 TODOS OS TESTES ADMINISTRATIVOS (BIA-ENG-009) PASSARAM COM SUCESSO!');
    console.log('============================================================\n');
  } finally {
    await app.close();
    await prisma.$disconnect();
  }
}

runAdminE2ETests().catch((err) => {
  console.error('❌ Falha nos testes administrativos E2E:', err);
  process.exit(1);
});
