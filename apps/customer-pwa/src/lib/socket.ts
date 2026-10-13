import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socketInstance: Socket | null = null;

export function getCustomerSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log(`[Socket.io Cliente] Conectado ao servidor: ${socketInstance?.id}`);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('[Socket.io Cliente] Erro de conexão:', error.message);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`[Socket.io Cliente] Desconectado: ${reason}`);
    });
  }

  return socketInstance;
}

/**
 * Inscreve o cliente na sala do chamado específico
 */
export function joinCustomerRequestRoom(requestId: string): void {
  const socket = getCustomerSocket();
  console.log(`[Socket.io Cliente] Solicitando entrada na sala do chamado: ${requestId}`);
  socket.emit('customer:join', { requestId });
}

/**
 * Escuta novas propostas recebidas para o chamado em tempo real
 */
export function onNewProposal(callback: (proposal: any) => void): () => void {
  const socket = getCustomerSocket();
  const handler = (proposal: any) => {
    console.log('[Socket.io Cliente] 🔔 Nova proposta recebida em tempo real!', proposal);
    callback(proposal);
  };

  socket.on('proposal:new', handler);
  return () => {
    socket.off('proposal:new', handler);
  };
}

/**
 * Escuta a confirmação de proposta aceita em tempo real
 */
export function onProposalAccepted(callback: (data: any) => void): () => void {
  const socket = getCustomerSocket();
  const handler = (data: any) => {
    console.log('[Socket.io Cliente] 🎉 Proposta aceita confirmada via WebSocket!', data);
    callback(data);
  };

  socket.on('proposal:accepted', handler);
  return () => {
    socket.off('proposal:accepted', handler);
  };
}
