import 'dotenv/config';
import { buildApp } from './app.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function bootstrap() {
  const app = buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 BorracharIA Core API rodando com sucesso em http://localhost:${PORT}`);
  } catch (err) {
    console.error('Erro ao inicializar o servidor HTTP:', err);
    process.exit(1);
  }
}

bootstrap();
