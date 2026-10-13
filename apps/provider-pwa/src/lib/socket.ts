import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socketInstance: Socket | null = null;

export function getProviderSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log(`[Socket.io Prestador] Conectado ao servidor: ${socketInstance?.id}`);
      // Registra automaticamente como prestador na sala global
      joinProviderChannel();
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[Socket.io Prestador] Erro de conexão:', error.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`[Socket.io Prestador] Desconectado: ${reason}`);
    });
  }

  return socketInstance;
}

/**
 * Inscreve o prestador no canal de socorristas para receber novos chamados
 */
export function joinProviderChannel(): void {
  const socket = getProviderSocket();
  console.log('[Socket.io Prestador] Solicitando entrada no canal global [providers]');
  socket.emit('provider:join');
}

/**
 * Escuta novos chamados de emergência emitidos em tempo real
 */
export function onNewServiceRequest(callback: (request: any) => void): () => void {
  const socket = getProviderSocket();
  const handler = (request: any) => {
    console.log('[Socket.io Prestador] 🚨 NOVO CHAMADO DE EMERGÊNCIA RECEBIDO!', request);
    callback(request);
  };

  socket.on('request:new', handler);
  return () => {
    socket.off('request:new', handler);
  };
}
