import 'dotenv/config';
import { buildApp } from './app.js';

async function testCloudReadiness() {
  console.log('🧪 Iniciando teste de Cloud Readiness para Core API...');

  const TEST_PORT = 3099;
  const TEST_HOST = '0.0.0.0';

  const app = buildApp();

  console.log(`1. Testando bind no host ${TEST_HOST} e porta dinâmica ${TEST_PORT}...`);
  await app.listen({ port: TEST_PORT, host: TEST_HOST });
  console.log(`✅ Servidor Fastify ouvindo com sucesso em http://${TEST_HOST}:${TEST_PORT}`);

  console.log('\n2. Testando CORS e OPTIONS pre-flight request...');
  const corsResponse = await fetch(`http://127.0.0.1:${TEST_PORT}/health`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://borracharia-customer-pwa.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, x-user-id',
    },
  });

  console.log(`Status preflight OPTIONS: ${corsResponse.status}`);
  const allowOrigin = corsResponse.headers.get('access-control-allow-origin');
  console.log(`Header Access-Control-Allow-Origin: ${allowOrigin}`);

  if (allowOrigin !== '*') {
    throw new Error(`CORS não está liberado para todas as origens! Obtido: ${allowOrigin}`);
  }
  console.log('✅ CORS configurado corretamente para Vercel (*)');

  console.log('\n3. Testando GET /health...');
  const healthResponse = await fetch(`http://127.0.0.1:${TEST_PORT}/health`, {
    method: 'GET',
    headers: {
      Origin: 'https://borracharia-customer-pwa.vercel.app',
    },
  });

  const healthData = (await healthResponse.json()) as {
    status: string;
    service: string;
  };
  console.log('Resposta do /health:', healthData);

  if (healthResponse.status !== 200 || healthData.status !== 'ok') {
    throw new Error('/health não respondeu com sucesso!');
  }
  console.log('✅ Healthcheck do Render (healthCheckPath: /health) validado com sucesso!');

  await app.close();
  console.log('\n🎉 TODOS OS TESTES DE CLOUD READINESS FORAM CONCLUÍDOS COM SUCESSO!');
}

testCloudReadiness().catch((err) => {
  console.error('❌ Falha no teste de Cloud Readiness:', err);
  process.exit(1);
});
