import 'dotenv/config';
import { buildApp } from './app.js';
import { prisma } from '@borracharia/database';

async function runFrontendIntegrationTest() {
  console.log('🧪 Iniciando teste de integração Frontend -> Core API...');

  const app = buildApp();
  await app.ready();

  // 1. Simula GET /service-types carregado pela home do customer-pwa
  console.log('1. Testando GET /service-types (catálogo de serviços para a UI)...');
  const serviceTypesResponse = await app.inject({
    method: 'GET',
    url: '/service-types',
  });

  console.log(`Status HTTP: ${serviceTypesResponse.statusCode}`);
  const serviceTypesData = JSON.parse(serviceTypesResponse.payload);
  console.log(`Tipos de serviço encontrados: ${serviceTypesData.data.length}`);
  if (serviceTypesData.data.length === 0) {
    throw new Error('Nenhum tipo de serviço retornado pela API!');
  }

  const selectedService = serviceTypesData.data[0];
  console.log(
    `Serviço selecionado para o socorro: "${selectedService.name}" (${selectedService.id})`,
  );

  // 2. Simula clique no botão "🚨 Solicitar Socorro" em Balneário Camboriú
  console.log('\n2. Testando POST /requests disparado pelo botão do Customer PWA...');
  const createRequestPayload = {
    service_type_id: selectedService.id,
    latitude: -26.9926,
    longitude: -48.6346,
  };

  const createResponse = await app.inject({
    method: 'POST',
    url: '/requests',
    payload: createRequestPayload,
    headers: {
      'content-type': 'application/json',
    },
  });

  console.log(`Status HTTP: ${createResponse.statusCode}`);
  const createData = JSON.parse(createResponse.payload);
  console.log('Resposta da criação do chamado:', JSON.stringify(createData, null, 2));

  if (createResponse.statusCode !== 201 || !createData.success) {
    throw new Error(`Falha ao criar chamado: ${createResponse.payload}`);
  }

  const createdRequestId = createData.data.id;
  const createdStatus = createData.data.status;
  const createdLat = createData.data.latitude;
  const createdLng = createData.data.longitude;

  // 3. Validação no Banco de Dados
  console.log('\n3. Validando persistência real no PostgreSQL...');
  const dbRequest = await prisma.serviceRequest.findUnique({
    where: { id: createdRequestId },
    include: {
      customer: { include: { user: true } },
      service_type: true,
    },
  });

  if (!dbRequest) {
    throw new Error(`Chamado ${createdRequestId} não foi persistido no banco!`);
  }

  console.log('✅ Chamado verificado com sucesso no banco de dados:');
  console.log(`   - ID: ${dbRequest.id}`);
  console.log(`   - Status: ${dbRequest.status} (Esperado: CREATED)`);
  console.log(
    `   - Coordenadas: (${dbRequest.latitude}, ${dbRequest.longitude}) (Esperado: -26.9926, -48.6346)`,
  );
  console.log(`   - Serviço: ${dbRequest.service_type.name}`);
  console.log(`   - Cliente: ${dbRequest.customer.user.email}`);

  if (createdStatus !== 'CREATED' || dbRequest.status !== 'CREATED') {
    throw new Error(`Status incorreto: recebido ${dbRequest.status}, esperado CREATED`);
  }

  if (
    Math.abs(Number(createdLat) - -26.9926) > 0.0001 ||
    Math.abs(Number(createdLng) - -48.6346) > 0.0001
  ) {
    throw new Error(`Coordenadas não batem com Balneário Camboriú!`);
  }

  await app.close();
  await prisma.$disconnect();

  console.log('\n🎉 TODOS OS TESTES DE INTEGRAÇÃO DO FRONTEND PASSARAM COM SUCESSO!');
}

runFrontendIntegrationTest().catch((err) => {
  console.error('❌ Falha no teste de integração:', err);
  process.exit(1);
});
