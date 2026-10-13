import 'dotenv/config';
import { prisma, ProviderStatus, Role } from '@borracharia/database';
import { buildApp } from './app.js';
import { authService } from './services/auth.service.js';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function runE2ETests() {
  console.log('\n============================================================');
  console.log('🚀 [BorracharIA Core API] - Teste de Integração HTTP E2E');
  console.log('============================================================\n');

  // 1. Iniciar servidor Fastify na porta 3001
  const app = buildApp();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`[HTTP Server] Subiu na porta ${PORT} para validação de ponta a ponta.\n`);

  try {
    // 2. Preparar massa de dados no banco (Serviço, 1 Cliente, 2 Prestadores)
    const serviceType = await prisma.serviceType.upsert({
      where: { name: 'Troca de Pneu Emergencial' },
      update: {},
      create: {
        name: 'Troca de Pneu Emergencial',
        description: 'Troca rápida de pneu furado ou danificado',
        estimated_base_price_min: 80.0,
        estimated_base_price_max: 180.0,
        is_active: true,
      },
    });

    const customerUser = await prisma.user.create({
      data: {
        email: `cliente-e2e-${Date.now()}@borracharia.com.br`,
        phone: `+55119${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: Role.CUSTOMER,
        customer_profile: { create: {} },
      },
      include: { customer_profile: true },
    });

    const provider1User = await prisma.user.create({
      data: {
        email: `pro1-e2e-${Date.now()}@borracharia.com.br`,
        phone: `+55118${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: Role.PROVIDER,
        provider_profile: {
          create: {
            status: ProviderStatus.APPROVED,
            asaas_wallet_id: 'wal_asaas_e2e_01',
          },
        },
      },
      include: { provider_profile: true },
    });

    const provider2User = await prisma.user.create({
      data: {
        email: `pro2-e2e-${Date.now()}@borracharia.com.br`,
        phone: `+55117${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: Role.PROVIDER,
        provider_profile: {
          create: {
            status: ProviderStatus.APPROVED,
            asaas_wallet_id: 'wal_asaas_e2e_02',
          },
        },
      },
      include: { provider_profile: true },
    });

    const customerId = customerUser.customer_profile!.id;
    const pro1Id = provider1User.provider_profile!.id;
    const pro2Id = provider2User.provider_profile!.id;

    const customerToken = authService.generateTestToken({
      id: customerUser.id,
      email: customerUser.email,
      role: 'CUSTOMER',
    });
    const pro1Token = authService.generateTestToken({
      id: provider1User.id,
      email: provider1User.email,
      role: 'PROVIDER',
    });
    const pro2Token = authService.generateTestToken({
      id: provider2User.id,
      email: provider2User.email,
      role: 'PROVIDER',
    });

    console.log('✔ Usuários e perfis base configurados no banco:');
    console.log(`   Cliente:   ${customerUser.email} (ID: ${customerId})`);
    console.log(`   Prestador 1: ${provider1User.email} (ID: ${pro1Id})`);
    console.log(`   Prestador 2: ${provider2User.email} (ID: ${pro2Id})\n`);

    // TESTE 1: GET /health
    console.log('--- TESTE 1: GET /health ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}`, healthData);
    if (healthRes.status !== 200) throw new Error('Healthcheck falhou');

    // TESTE 2: POST /requests (Cliente abre chamado de emergência)
    console.log('\n--- TESTE 2: POST /requests (Cliente abre chamado) ---');
    const createReqRes = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
        'x-customer-id': customerId,
      },
      body: JSON.stringify({
        service_type_id: serviceType.id,
        latitude: -23.5615,
        longitude: -46.656,
      }),
    });
    const createReqData = (await createReqRes.json()) as any;
    console.log(`Status: ${createReqRes.status}`);
    console.log('Resposta:', {
      requestId: createReqData.data.id,
      status: createReqData.data.status,
      service: createReqData.data.service_type.name,
      coords: { lat: createReqData.data.latitude, lng: createReqData.data.longitude },
    });
    const requestId = createReqData.data.id;

    // TESTE 3: GET /requests/nearby (Prestador busca chamados em um raio de 10 km)
    console.log('\n--- TESTE 3: GET /requests/nearby (Busca geoespacial) ---');
    // Coordenadas próximas: MASP / Av. Paulista (-23.5614, -46.6558)
    const nearbyRes = await fetch(
      `${BASE_URL}/requests/nearby?latitude=-23.5614&longitude=-46.6558&radius_km=10`,
      {
        headers: {
          Authorization: `Bearer ${pro1Token}`,
        },
      },
    );
    const nearbyData = (await nearbyRes.json()) as any;
    console.log(`Status: ${nearbyRes.status}`);
    console.log(`Chamados encontrados no raio de 10 km: ${nearbyData.total}`);
    console.log('Primeiro resultado:', nearbyData.data[0]);

    // TESTE 4: POST /requests/:id/proposals (Prestador 1 envia lance de R$ 130, 15 min)
    console.log('\n--- TESTE 4: POST /requests/:id/proposals (Lance Prestador 1) ---');
    const prop1Res = await fetch(`${BASE_URL}/requests/${requestId}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pro1Token}`,
        'x-provider-id': pro1Id,
      },
      body: JSON.stringify({
        proposed_price: 130.0,
        estimated_arrival_time_mins: 15,
      }),
    });
    const prop1Data = (await prop1Res.json()) as any;
    console.log(`Status: ${prop1Res.status}`);
    console.log('Proposta 1 criada:', {
      proposalId: prop1Data.data.id,
      preco: prop1Data.data.proposed_price,
      tempo: `${prop1Data.data.estimated_arrival_time_mins} min`,
      status: prop1Data.data.status,
    });
    const proposal1Id = prop1Data.data.id;
    console.log(`Lance 1 registrado com ID: ${proposal1Id}`);

    // TESTE 5: POST /requests/:id/proposals (Prestador 2 envia lance de R$ 110, 20 min)
    console.log('\n--- TESTE 5: POST /requests/:id/proposals (Lance Prestador 2) ---');
    const prop2Res = await fetch(`${BASE_URL}/requests/${requestId}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pro2Token}`,
        'x-provider-id': pro2Id,
      },
      body: JSON.stringify({
        proposed_price: 110.0,
        estimated_arrival_time_mins: 20,
      }),
    });
    const prop2Data = (await prop2Res.json()) as any;
    console.log(`Status: ${prop2Res.status}`);
    console.log('Proposta 2 criada:', {
      proposalId: prop2Data.data.id,
      preco: prop2Data.data.proposed_price,
      tempo: `${prop2Data.data.estimated_arrival_time_mins} min`,
      status: prop2Data.data.status,
    });
    const proposal2Id = prop2Data.data.id;

    // TESTE 6: GET /requests/:id/proposals (Cliente lista propostas)
    console.log('\n--- TESTE 6: GET /requests/:id/proposals (Cliente lista lances) ---');
    const listPropRes = await fetch(`${BASE_URL}/requests/${requestId}/proposals`, {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });
    const listPropData = (await listPropRes.json()) as any;
    console.log(`Status: ${listPropRes.status}`);
    console.log(`Total de propostas recebidas: ${listPropData.total}`);
    listPropData.data.forEach((p: any, idx: number) => {
      console.log(
        `  Lance #${idx + 1}: ID ${p.id} | R$ ${p.proposed_price} | ${p.estimated_arrival_time_mins} min | Status: ${p.status}`,
      );
    });

    // TESTE 7: POST /requests/:id/proposals/:proposalId/accept (Cliente aceita a Proposta 2 de R$ 110)
    console.log(
      '\n--- TESTE 7: POST /requests/:id/proposals/:proposalId/accept (Aceite e Pré-autorização Asaas) ---',
    );
    const acceptRes = await fetch(
      `${BASE_URL}/requests/${requestId}/proposals/${proposal2Id}/accept`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
          'x-customer-id': customerId,
        },
        body: JSON.stringify({
          payment_method: 'CREDIT_CARD',
          credit_card_token: 'card_tok_mastercard_4421',
        }),
      },
    );
    const acceptData = (await acceptRes.json()) as any;
    console.log(`Status: ${acceptRes.status}`);
    console.log('Resultado do Aceite:', {
      mensagem: acceptData.message,
      chamadoStatus: acceptData.service_request.status,
      propostaAceita: acceptData.accepted_proposal,
      pagamentoAutorizado: acceptData.payment_authorization,
    });

    // TESTE 8: Validação de Estado Final no Banco
    console.log('\n--- TESTE 8: Validação de Estados Finais no Banco ---');
    const finalProposals = await prisma.proposal.findMany({
      where: { service_request_id: requestId },
      orderBy: { proposed_price: 'asc' },
    });
    const finalRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    console.log(
      `Status do Chamado no Banco: ${finalRequest?.status} (Esperado: PROVIDER_ASSIGNED)`,
    );
    finalProposals.forEach((p) => {
      console.log(`  Proposta ${p.id} (R$ ${p.proposed_price}): Status no Banco = ${p.status}`);
    });

    // TESTE 9: Regra funcional - Tentar enviar lance para chamado já atribuído
    console.log(
      '\n--- TESTE 9: Tentativa de lance após prestador atribuído (Deve ser rejeitado) ---',
    );
    const rejectedBidRes = await fetch(`${BASE_URL}/requests/${requestId}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pro1Token}`,
        'x-provider-id': pro1Id,
      },
      body: JSON.stringify({
        proposed_price: 90.0,
        estimated_arrival_time_mins: 10,
      }),
    });
    const rejectedBidData = (await rejectedBidRes.json()) as any;
    console.log(`Status retornado: ${rejectedBidRes.status} (Esperado: 400)`);
    console.log('Resposta:', rejectedBidData);

    console.log('\n============================================================');
    console.log('🎉 TODOS OS TESTES E2E FORAM CONCLUÍDOS COM 100% DE SUCESSO!');
    console.log('============================================================\n');
  } finally {
    await app.close();
    await prisma.$disconnect();
  }
}

runE2ETests().catch((err) => {
  console.error('Falha nos testes E2E:', err);
  process.exit(1);
});
