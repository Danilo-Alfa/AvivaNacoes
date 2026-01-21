import { io, Socket } from 'socket.io-client';
import { api, API_BASE_URL } from '@/lib/api';

// =====================================================
// INTERFACES
// =====================================================

export interface ChatMensagem {
  id: string;
  session_id: string;
  nome: string;
  email: string | null;
  mensagem: string;
  created_at: string;
}

export interface ChatEstatisticas {
  total_mensagens: number;
  usuarios_unicos: number;
}

// =====================================================
// CLASSE DO CHAT (Socket.io)
// =====================================================

type ChatEventHandler<T = unknown> = (data: T) => void;

class ChatClient {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<ChatEventHandler>> = new Map();
  private sessionId: string = '';
  private nome: string = '';
  private email: string = '';

  connect(sessionId: string, nome: string, email?: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.sessionId = sessionId;
    this.nome = nome;
    this.email = email || '';

    this.socket = io(`${API_BASE_URL}/chat`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Chat conectado');
      // Fazer join quando conectar
      this.socket?.emit('join', {
        sessionId: this.sessionId,
        nome: this.nome,
        email: this.email,
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Chat desconectado');
      this.emit('desconectado', {});
    });

    // Eventos do chat
    this.socket.on('mensagem', (data: ChatMensagem) => {
      this.emit('mensagem', data);
    });

    this.socket.on('mensagens_anteriores', (data: ChatMensagem[]) => {
      this.emit('mensagens_anteriores', data);
    });

    this.socket.on('users_online', (count: number) => {
      this.emit('users_online', count);
    });

    this.socket.on('user_joined', (data: { nome: string; timestamp: string }) => {
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data: { nome: string; timestamp: string }) => {
      this.emit('user_left', data);
    });

    this.socket.on('usuario_digitando', (data: { nome: string }) => {
      this.emit('usuario_digitando', data);
    });

    this.socket.on('usuario_parou_digitar', (data: { nome: string }) => {
      this.emit('usuario_parou_digitar', data);
    });

    this.socket.on('mensagem_deletada', (data: { mensagemId: string }) => {
      this.emit('mensagem_deletada', data);
    });

    this.socket.on('chat_limpo', () => {
      this.emit('chat_limpo', {});
    });

    this.socket.on('erro', (data: { message: string }) => {
      console.error('Erro no chat:', data.message);
      this.emit('erro', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Enviar mensagem
  enviarMensagem(mensagem: string): void {
    if (!this.socket?.connected) {
      console.error('Socket não conectado');
      return;
    }

    this.socket.emit('nova_mensagem', { mensagem });
  }

  // Indicar que está digitando
  digitando(): void {
    this.socket?.emit('digitando');
  }

  // Indicar que parou de digitar
  parouDigitar(): void {
    this.socket?.emit('parou_digitar');
  }

  // Deletar mensagem (admin)
  deletarMensagem(mensagemId: string, adminPassword: string): void {
    this.socket?.emit('deletar_mensagem', { mensagemId, adminPassword });
  }

  // Limpar chat (admin)
  limparChat(adminPassword: string): void {
    this.socket?.emit('limpar_chat', { adminPassword });
  }

  // Sistema de eventos
  on<T = unknown>(event: string, handler: ChatEventHandler<T>): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as ChatEventHandler);
  }

  off<T = unknown>(event: string, handler: ChatEventHandler<T>): void {
    this.eventHandlers.get(event)?.delete(handler as ChatEventHandler);
  }

  private emit(event: string, data: unknown): void {
    this.eventHandlers.get(event)?.forEach((handler) => handler(data));
  }
}

// Instância singleton do chat
export const chatClient = new ChatClient();

// =====================================================
// FUNÇÕES REST (para admin)
// =====================================================

/**
 * Busca as últimas mensagens do chat via REST
 */
export async function getMensagens(): Promise<ChatMensagem[]> {
  return api.get<ChatMensagem[]>('/chat/mensagens');
}

/**
 * Busca estatísticas do chat
 */
export async function getEstatisticasChat(): Promise<ChatEstatisticas> {
  return api.get<ChatEstatisticas>('/chat/estatisticas');
}

/**
 * Deleta uma mensagem (admin)
 */
export async function deletarMensagem(id: string): Promise<void> {
  return api.delete(`/chat/mensagem/${id}`, { useAdminPassword: true });
}

/**
 * Limpa todo o chat (via API Key)
 */
export async function limparChat(): Promise<void> {
  return api.post('/chat/limpar', undefined, { useApiKey: true });
}
