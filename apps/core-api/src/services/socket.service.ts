import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const SOCKET_ROOMS = {
  PROVIDERS: 'providers',
  requestRoom: (requestId: string) => `request:${requestId}`,
} as const;

export const SOCKET_EVENTS = {
  // Eventos recebidos do cliente
  PROVIDER_JOIN: 'provider:join',
  CUSTOMER_JOIN: 'customer:join',

  // Eventos emitidos pelo servidor
  REQUEST_NEW: 'request:new',
  PROPOSAL_NEW: 'proposal:new',
  PROPOSAL_ACCEPTED: 'proposal:accepted',
} as const;

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  if (ioInstance) {
    return ioInstance;
  }

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: false,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);

    // Borracheiro / Pro entra na sala global de prestadores para receber novos chamados
    socket.on(SOCKET_EVENTS.PROVIDER_JOIN, () => {
      socket.join(SOCKET_ROOMS.PROVIDERS);
      console.log(`[Socket.io] Pro [${socket.id}] entrou na sala [${SOCKET_ROOMS.PROVIDERS}]`);
      socket.emit('joined', { room: SOCKET_ROOMS.PROVIDERS, timestamp: new Date().toISOString() });
    });

    // Cliente se inscreve na sala específica do seu chamado para receber lances
    socket.on(SOCKET_EVENTS.CUSTOMER_JOIN, (data: { requestId?: string } | string | undefined) => {
      const requestId =
        typeof data === 'string'
          ? data
          : data && typeof data === 'object'
            ? data.requestId
            : undefined;

      if (requestId) {
        const room = SOCKET_ROOMS.requestRoom(requestId);
        socket.join(room);
        console.log(`[Socket.io] Cliente [${socket.id}] entrou na sala [${room}]`);
        socket.emit('joined', { room, requestId, timestamp: new Date().toISOString() });
      } else {
        console.warn(`[Socket.io] customer:join recebido sem requestId válido de [${socket.id}]`);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Cliente desconectado: ${socket.id} (motivo: ${reason})`);
    });
  });

  ioInstance = io;
  console.log('⚡ Servidor Socket.io inicializado com sucesso (CORS: *)');
  return io;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export const socketService = {
  /**
   * Notifica borracheiros online sobre a criação de um novo chamado
   */
  emitNewRequest(requestData: any): void {
    if (!ioInstance) {
      console.warn('[Socket.io] Instância não inicializada. Evento request:new ignorado.');
      return;
    }

    console.log(
      `[Socket.io] Emitindo [request:new] para a sala [${SOCKET_ROOMS.PROVIDERS}] e broadcast`,
    );
    ioInstance.to(SOCKET_ROOMS.PROVIDERS).emit(SOCKET_EVENTS.REQUEST_NEW, requestData);
    // Também emite globalmente para garantir recebimento em clientes recém-conectados
    ioInstance.emit(SOCKET_EVENTS.REQUEST_NEW, requestData);
  },

  /**
   * Notifica o cliente na sala do chamado sobre o recebimento de uma nova proposta/lance
   */
  emitNewProposal(requestId: string, proposalData: any): void {
    if (!ioInstance) {
      console.warn('[Socket.io] Instância não inicializada. Evento proposal:new ignorado.');
      return;
    }

    const room = SOCKET_ROOMS.requestRoom(requestId);
    console.log(
      `[Socket.io] Emitindo [proposal:new] para o chamado [${requestId}] na sala [${room}]`,
    );
    ioInstance.to(room).emit(SOCKET_EVENTS.PROPOSAL_NEW, proposalData);
  },

  /**
   * Notifica a sala do chamado quando uma proposta foi aceita
   */
  emitProposalAccepted(requestId: string, data: any): void {
    if (!ioInstance) return;

    const room = SOCKET_ROOMS.requestRoom(requestId);
    console.log(`[Socket.io] Emitindo [proposal:accepted] para o chamado [${requestId}]`);
    ioInstance.to(room).emit(SOCKET_EVENTS.PROPOSAL_ACCEPTED, data);
  },
};
