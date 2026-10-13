import 'dotenv/config';
import { io as Client, Socket } from 'socket.io-client';
import { buildApp } from './app.js';
import { initSocketServer, socketService } from './services/socket.service.js';

async function testWebSocketIntegration() {
  console.log('🧪 Iniciando teste de validação bidirecional do Socket.io (Backend + Clientes)...');

  const TEST_PORT = 3098;
  const TEST_HOST = '127.0.0.1';
  const SERVER_URL = `http://${TEST_HOST}:${TEST_PORT}`;

  // 1. Inicializa Fastify e integra Socket.io
  const app = buildApp();
  initSocketServer(app.server);

  await app.listen({ port: TEST_PORT, host: TEST_HOST });
  console.log(`✅ Servidor HTTP + Socket.io ouvindo em ${SERVER_URL}`);

  let providerSocket: Socket | null = null;
  let customerSocket: Socket | null = null;

  try {
    // 2. Conecta Prestador (Provider PWA)
    console.log('\n2. Conectando cliente Prestador (Provider PWA)...');
    providerSocket = Client(SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout conectando prestador')), 5000);
      providerSocket!.on('connect', () => {
        clearTimeout(timeout);
        console.log(`✅ Prestador conectado com socket ID: ${providerSocket!.id}`);
        resolve();
      });
    });

    // Prestador entra na sala de prestadores
    providerSocket.emit('provider:join');

    // 3. Conecta Cliente (Customer PWA)
    console.log('\n3. Conectando cliente Solicitante (Customer PWA)...');
    customerSocket = Client(SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout conectando cliente')), 5000);
      customerSocket!.on('connect', () => {
        clearTimeout(timeout);
        console.log(`✅ Cliente conectado com socket ID: ${customerSocket!.id}`);
        resolve();
      });
    });

    const testRequestId = 'chamado-teste-ws-' + Date.now();

    // Cliente entra na sala do seu chamado
    customerSocket.emit('customer:join', { requestId: testRequestId });

    // Aguarda sincronização das salas no servidor
    await new Promise((r) => setTimeout(r, 200));

    // 4. Teste de Notificação de Novo Chamado (request:new)
    console.log('\n4. Testando emissão de [request:new] do Backend para o Prestador...');
    const requestReceivedPromise = new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Timeout aguardando evento request:new no Prestador')),
        5000,
      );
      providerSocket!.on('request:new', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    const mockRequestPayload = {
      id: testRequestId,
      service_type: { name: 'Troca de Pneu Emergencial' },
      latitude: -26.9926,
      longitude: -48.6346,
      status: 'CREATED',
    };

    socketService.emitNewRequest(mockRequestPayload);

    const receivedRequest = await requestReceivedPromise;
    console.log('✅ Prestador recebeu [request:new] via WebSocket com sucesso:');
    console.log(`   - ID do Chamado: ${receivedRequest.id}`);
    console.log(`   - Serviço: ${receivedRequest.service_type?.name}`);
    console.log(`   - Coordenadas: (${receivedRequest.latitude}, ${receivedRequest.longitude})`);

    if (receivedRequest.id !== testRequestId) {
      throw new Error(`ID divergente no evento request:new: ${receivedRequest.id}`);
    }

    // 5. Teste de Notificação de Novo Lance (proposal:new)
    console.log('\n5. Testando emissão de [proposal:new] do Prestador para a sala do Cliente...');
    const proposalReceivedPromise = new Promise<any>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Timeout aguardando evento proposal:new no Cliente')),
        5000,
      );
      customerSocket!.on('proposal:new', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    const mockProposalPayload = {
      id: 'prop-' + Date.now(),
      service_request_id: testRequestId,
      proposed_price: 120.0,
      estimated_arrival_time_mins: 15,
      status: 'PENDING',
    };

    socketService.emitNewProposal(testRequestId, mockProposalPayload);

    const receivedProposal = await proposalReceivedPromise;
    console.log('✅ Cliente recebeu [proposal:new] via WebSocket com sucesso:');
    console.log(`   - ID da Proposta: ${receivedProposal.id}`);
    console.log(`   - Valor Ofertado: R$ ${receivedProposal.proposed_price}`);
    console.log(`   - Tempo Estimado: ${receivedProposal.estimated_arrival_time_mins} min`);

    if (receivedProposal.service_request_id !== testRequestId) {
      throw new Error(
        `Chamado divergente no evento proposal:new: ${receivedProposal.service_request_id}`,
      );
    }

    console.log('\n============================================================');
    console.log('🎉 COMUNICAÇÃO BIDIRECIONAL SOCKET.IO VALIDADA COM 100% DE SUCESSO!');
    console.log('============================================================');
  } finally {
    if (providerSocket) providerSocket.disconnect();
    if (customerSocket) customerSocket.disconnect();
    await app.close();
  }
}

testWebSocketIntegration().catch((err) => {
  console.error('❌ Falha no teste WebSocket:', err);
  process.exit(1);
});
