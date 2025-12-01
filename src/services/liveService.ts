import { api } from "@/lib/api";

// =====================================================
// INTERFACES
// =====================================================

export interface LiveConfig {
  id: string;
  ativa: boolean;
  url_stream: string | null;
  titulo: string;
  descricao: string | null;
  mensagem_offline: string;
  proxima_live_titulo: string | null;
  proxima_live_data: string | null;
  proxima_live_descricao: string | null;
  mostrar_contador_viewers: boolean;
  cor_badge: string;
  created_at: string;
  updated_at: string;
}

export interface LiveStatus {
  ativa: boolean;
  titulo: string | null;
  descricao: string | null;
  viewers: number;
  url_stream: string | null;
}

export interface LiveViewer {
  id: string;
  session_id: string;
  nome: string | null;
  email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  entrou_em: string;
  ultima_atividade: string;
  assistindo: boolean;
}

export interface ViewerStats {
  viewers_ativos: number;
  total_registros: number;
  primeiro_viewer: string | null;
  ultimo_viewer: string | null;
}

// =====================================================
// FUNÇÕES PARA CONFIGURAÇÃO DA LIVE
// =====================================================

/**
 * Busca a configuração da live
 */
export async function getLiveConfig(): Promise<LiveConfig | null> {
  try {
    return await api.get<LiveConfig>("/live/config");
  } catch (error) {
    console.error("Erro ao buscar configuração da live:", error);
    return null;
  }
}

/**
 * Busca o status atual da live (público)
 */
export async function getLiveStatus(): Promise<LiveStatus> {
  return api.get<LiveStatus>("/live/status");
}

/**
 * Atualiza a configuração da live (admin)
 */
export async function atualizarLiveConfig(
  ativa: boolean,
  urlStream: string | null,
  titulo: string,
  descricao: string | null,
  mensagemOffline: string,
  proximaLiveTitulo: string | null,
  proximaLiveData: string | null,
  proximaLiveDescricao: string | null,
  mostrarContadorViewers: boolean,
  corBadge: string
): Promise<LiveConfig> {
  return api.patch<LiveConfig>(
    "/live/config",
    {
      ativa,
      url_stream: urlStream,
      titulo,
      descricao,
      mensagem_offline: mensagemOffline,
      proxima_live_titulo: proximaLiveTitulo,
      proxima_live_data: proximaLiveData,
      proxima_live_descricao: proximaLiveDescricao,
      mostrar_contador_viewers: mostrarContadorViewers,
      cor_badge: corBadge,
    },
    { useAdminPassword: true }
  );
}

/**
 * Liga a transmissão (ativa = true) - Para automação
 */
export async function ligarLive(
  urlStream: string,
  titulo: string,
  descricao: string | null
): Promise<LiveConfig> {
  return api.post<LiveConfig>(
    "/live/iniciar",
    {
      url_stream: urlStream,
      titulo,
      descricao,
    },
    { useApiKey: true }
  );
}

/**
 * Desliga a transmissão (ativa = false) - Para automação
 */
export async function desligarLive(): Promise<LiveConfig> {
  return api.post<LiveConfig>("/live/parar", undefined, { useApiKey: true });
}

// =====================================================
// FUNÇÕES PARA VIEWERS DA LIVE
// =====================================================

/**
 * Gera um ID de sessão único para o navegador
 */
export function gerarSessionId(): string {
  let sessionId = localStorage.getItem("live_session_id");

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("live_session_id", sessionId);
  }

  return sessionId;
}

/**
 * Registra um novo viewer ou atualiza se já existe
 */
export async function registrarViewer(
  sessionId: string,
  nome?: string,
  email?: string
): Promise<LiveViewer> {
  const userAgent = navigator.userAgent;

  return api.post<LiveViewer>("/viewers/registrar", {
    session_id: sessionId,
    nome: nome || null,
    email: email || null,
    user_agent: userAgent,
  });
}

/**
 * Atualiza o heartbeat do viewer (confirma que ainda está assistindo)
 */
export async function atualizarHeartbeat(sessionId: string): Promise<void> {
  try {
    await api.post("/viewers/heartbeat", { session_id: sessionId });
  } catch (error) {
    console.error("Erro ao atualizar heartbeat:", error);
    // Não lançar erro para não interromper a experiência do usuário
  }
}

/**
 * Marca o viewer como não assistindo mais
 */
export async function sairDaLive(sessionId: string): Promise<void> {
  try {
    await api.post("/viewers/sair", { session_id: sessionId });
  } catch (error) {
    console.error("Erro ao sair da live:", error);
  }
}

/**
 * Conta o número de viewers ativos
 */
export async function contarViewersAtivos(): Promise<number> {
  try {
    const response = await api.get<{ viewers: number }>("/viewers/contagem");
    return response.viewers;
  } catch (error) {
    console.error("Erro ao contar viewers:", error);
    return 0;
  }
}

/**
 * Busca informações do viewer atual
 */
export async function getViewerAtual(
  sessionId: string
): Promise<LiveViewer | null> {
  try {
    return await api.get<LiveViewer>(`/viewers/${sessionId}`);
  } catch (error) {
    console.error("Erro ao buscar viewer:", error);
    return null;
  }
}

/**
 * Busca estatísticas dos viewers
 */
export async function getViewersEstatisticas(): Promise<ViewerStats> {
  return api.get<ViewerStats>("/viewers/estatisticas");
}

/**
 * Limpa viewers inativos (via API Key)
 */
export async function limparViewersInativos(): Promise<{ removidos: number }> {
  return api.delete<{ removidos: number }>("/viewers/inativos", {
    useApiKey: true,
  });
}

/**
 * Busca todos os viewers (ativos e inativos) - Para admin
 */
export async function getTodosViewers(): Promise<LiveViewer[]> {
  try {
    return await api.get<LiveViewer[]>("/viewers/todos", {
      useAdminPassword: true,
    });
  } catch (error) {
    console.error("Erro ao buscar viewers:", error);
    return [];
  }
}

/**
 * Busca apenas viewers ativos - Para admin
 */
export async function getViewersAtivos(): Promise<LiveViewer[]> {
  try {
    return await api.get<LiveViewer[]>("/viewers/ativos", {
      useAdminPassword: true,
    });
  } catch (error) {
    console.error("Erro ao buscar viewers ativos:", error);
    return [];
  }
}
