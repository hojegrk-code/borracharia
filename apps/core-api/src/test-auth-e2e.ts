import 'dotenv/config';
import { prisma } from '@borracharia/database';
import { randomUUID } from 'crypto';
import { buildApp } from './app.js';
import { authService } from './services/auth.service.js';

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

async function runAuthE2ETests() {
  console.log('\n============================================================');
  console.log('🛡️ [BorracharIA Core API] - Teste de Integração Auth & JWT E2E');
  console.log('============================================================\n');

  const app = buildApp();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`[HTTP Server] Subiu na porta ${PORT} para testes de autenticação.\n`);

  try {
    // 1. Garantir que tipo de serviço existe
    const serviceType = await prisma.serviceType.upsert({
      where: { name: 'Troca de Pneu Emergencial Auth Test' },
      update: {},
      create: {
        name: 'Troca de Pneu Emergencial Auth Test',
        description: 'Troca de pneu para validação de autenticação',
        estimated_base_price_min: 75.0,
        estimated_base_price_max: 150.0,
        is_active: true,
      },
    });

    // -------------------------------------------------------------
    // CENÁRIO 1: Acesso desprotegido sem Authorization Header (401)
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 1: POST /requests sem Header Authorization ---');
    const noAuthRes = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type_id: serviceType.id,
        latitude: -23.5615,
        longitude: -46.656,
      }),
    });
    const noAuthData = (await noAuthRes.json()) as any;
    console.log(`Status HTTP retornado: ${noAuthRes.status} (Esperado: 401)`);
    console.log('Payload de erro:', noAuthData);
    if (noAuthRes.status !== 401) {
      throw new Error(`Esperado status 401, recebido: ${noAuthRes.status}`);
    }
    if (!noAuthData.message?.toLowerCase().includes('token')) {
      throw new Error('Mensagem de erro não menciona token');
    }
    console.log('✅ CENÁRIO 1 APROVADO: Requisição sem token bloqueada com 401 Unauthorized!\n');

    // -------------------------------------------------------------
    // CENÁRIO 2: Acesso com token malformado ou inválido (401)
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 2: POST /requests com Token Inválido ---');
    const badTokenRes = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-falso-ou-malformado-123456',
      },
      body: JSON.stringify({
        service_type_id: serviceType.id,
        latitude: -23.5615,
        longitude: -46.656,
      }),
    });
    const badTokenData = (await badTokenRes.json()) as any;
    console.log(`Status HTTP retornado: ${badTokenRes.status} (Esperado: 401)`);
    console.log('Payload de erro:', badTokenData);
    if (badTokenRes.status !== 401) {
      throw new Error(`Esperado status 401, recebido: ${badTokenRes.status}`);
    }
    console.log('✅ CENÁRIO 2 APROVADO: Token inválido rejeitado com 401 Unauthorized!\n');

    // -------------------------------------------------------------
    // CENÁRIO 3: Sincronização de Usuário e Perfil via POST /auth/sync
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 3: Sincronização de Usuário (Cliente e Socorrista) ---');
    const customerUserId = randomUUID();
    const customerEmail = `cliente.auth.${Date.now()}@borracharia.com.br`;
    const customerToken = authService.generateTestToken({
      id: customerUserId,
      email: customerEmail,
      role: 'CUSTOMER',
    });

    const providerUserId = randomUUID();
    const providerEmail = `socorrista.auth.${Date.now()}@borracharia.com.br`;
    const providerToken = authService.generateTestToken({
      id: providerUserId,
      email: providerEmail,
      role: 'PROVIDER',
    });

    // Sync do Cliente
    const syncCustomerRes = await fetch(`${BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        role: 'CUSTOMER',
        phone: '+5511999990001',
      }),
    });
    const syncCustomerData = (await syncCustomerRes.json()) as any;
    console.log(`Status Sync Cliente: ${syncCustomerRes.status} (Esperado: 200)`);
    if (syncCustomerRes.status !== 200 || !syncCustomerData.success) {
      throw new Error('Falha no sync do cliente');
    }

    // Sync do Socorrista
    const syncProviderRes = await fetch(`${BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({
        role: 'PROVIDER',
        phone: '+5511999990002',
      }),
    });
    const syncProviderData = (await syncProviderRes.json()) as any;
    console.log(`Status Sync Socorrista: ${syncProviderRes.status} (Esperado: 200)`);
    if (syncProviderRes.status !== 200 || !syncProviderData.success) {
      throw new Error('Falha no sync do socorrista');
    }
    console.log('✅ CENÁRIO 3 APROVADO: Usuários e perfis sincronizados no PostgreSQL!\n');

    // -------------------------------------------------------------
    // CENÁRIO 4: Consulta de Identidade via GET /auth/me
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 4: GET /auth/me (Inspeção de Token Autenticado) ---');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });
    const meData = (await meRes.json()) as any;
    console.log(`Status /auth/me: ${meRes.status} (Esperado: 200)`);
    console.log('Dados do usuário autenticado:', meData.data);
    if (meData.data.id !== customerUserId || meData.data.email !== customerEmail) {
      throw new Error('Dados retornados por /auth/me divergem do token emitido');
    }
    console.log(
      '✅ CENÁRIO 4 APROVADO: Endpoint /auth/me validou e retornou a identidade correta!\n',
    );

    // -------------------------------------------------------------
    // CENÁRIO 5: Abertura de Chamado Autenticada (Sem header fake)
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 5: POST /requests com JWT (Resolução Automática do Cliente) ---');
    const createReqRes = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        service_type_id: serviceType.id,
        latitude: -23.5615,
        longitude: -46.656,
      }),
    });
    const createReqData = (await createReqRes.json()) as any;
    console.log(`Status POST /requests: ${createReqRes.status} (Esperado: 201)`);
    if (createReqRes.status !== 201) {
      throw new Error(`Falha ao criar chamado: ${JSON.stringify(createReqData)}`);
    }

    const requestId = createReqData.data.id;
    console.log(`Chamado criado com ID: ${requestId}`);

    // Verificar se o customer_id no banco corresponde ao customerProfile do usuário autenticado
    const dbCustomerProfile = await prisma.customerProfile.findUnique({
      where: { user_id: customerUserId },
    });
    if (!dbCustomerProfile || createReqData.data.customer_id !== dbCustomerProfile.id) {
      throw new Error('Chamado não foi vinculado ao perfil do usuário autenticado pelo JWT');
    }
    console.log(
      `✅ CENÁRIO 5 APROVADO: Chamado vinculado ao CustomerProfile ${dbCustomerProfile.id} do usuário ${customerUserId}!\n`,
    );

    // -------------------------------------------------------------
    // CENÁRIO 6: Submissão de Lance Autenticada pelo Socorrista
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 6: POST /requests/:id/proposals com JWT de Socorrista ---');
    const createPropRes = await fetch(`${BASE_URL}/requests/${requestId}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({
        proposed_price: 120.0,
        estimated_arrival_time_mins: 18,
      }),
    });
    const createPropData = (await createPropRes.json()) as any;
    console.log(`Status POST proposal: ${createPropRes.status} (Esperado: 201)`);
    if (createPropRes.status !== 201) {
      throw new Error(`Falha ao submeter lance: ${JSON.stringify(createPropData)}`);
    }

    const proposalId = createPropData.data.id;
    const dbProviderProfile = await prisma.providerProfile.findUnique({
      where: { user_id: providerUserId },
    });
    if (!dbProviderProfile || createPropData.data.provider_id !== dbProviderProfile.id) {
      throw new Error('Proposta não foi vinculada ao perfil do socorrista autenticado');
    }
    console.log(
      `✅ CENÁRIO 6 APROVADO: Lance vinculado ao ProviderProfile ${dbProviderProfile.id} do usuário ${providerUserId}!\n`,
    );

    // -------------------------------------------------------------
    // CENÁRIO 7: Aceite de Lance pelo Cliente Autenticado
    // -------------------------------------------------------------
    console.log('--- CENÁRIO 7: POST /requests/:id/proposals/:id/accept com JWT de Cliente ---');
    const acceptRes = await fetch(
      `${BASE_URL}/requests/${requestId}/proposals/${proposalId}/accept`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          payment_method: 'CREDIT_CARD',
          credit_card_token: 'tok_mastercard_auth_test',
        }),
      },
    );
    const acceptData = (await acceptRes.json()) as any;
    console.log(`Status POST accept: ${acceptRes.status} (Esperado: 200)`);
    if (acceptRes.status !== 200) {
      throw new Error(`Falha ao aceitar proposta: ${JSON.stringify(acceptData)}`);
    }
    console.log('Resultado do aceite:', {
      statusChamado: acceptData.service_request.status,
      propostaAceitaId: acceptData.accepted_proposal.id,
      preAutorizacao: acceptData.payment_authorization.status,
    });
    console.log('✅ CENÁRIO 7 APROVADO: Aceite concluído e autorizado para usuário autenticado!\n');

    console.log('============================================================');
    console.log('🎉 TODOS OS TESTES E2E DE AUTENTICAÇÃO (BIA-ENG-008) PASSARAM COM SUCESSO!');
    console.log('============================================================\n');
  } finally {
    await app.close();
    await prisma.$disconnect();
  }
}

runAuthE2ETests().catch((err) => {
  console.error('❌ Falha nos testes de autenticação E2E:', err);
  process.exit(1);
});
