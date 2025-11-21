import { supabase } from "@/lib/supabase";

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

export interface LiveSchedule {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  url_stream: string | null;
  ativa: boolean;
  notificar_usuarios: boolean;
  created_at: string;
  updated_at: string;
}

// ID fixo da única configuração da live
const LIVE_CONFIG_ID = "c0000000-0000-0000-0000-000000000001";

// =====================================================
// FUNÇÕES PARA CONFIGURAÇÃO DA LIVE
// =====================================================

/**
 * Busca a configuração da live
 * Sempre retorna 1 registro (ou null se não existir)
 */
export async function getLiveConfig(): Promise<LiveConfig | null> {
  const { data, error } = await supabase
    .from("live_config")
    .select("*")
    .eq("id", LIVE_CONFIG_ID)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = nenhum resultado encontrado
    console.error("Erro ao buscar configuração da live:", error);
    throw error;
  }

  return data || null;
}

/**
 * Atualiza a configuração da live
 * Apenas 1 registro existe, então sempre faz UPDATE
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
  const { data: config, error } = await supabase
    .from("live_config")
    .update({
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
    })
    .eq("id", LIVE_CONFIG_ID)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar configuração da live:", error);
    throw error;
  }

  return config;
}

/**
 * Liga a transmissão (ativa = true)
 */
export async function ligarLive(
  urlStream: string,
  titulo: string,
  descricao: string | null
): Promise<LiveConfig> {
  const { data: config, error } = await supabase
    .from("live_config")
    .update({
      ativa: true,
      url_stream: urlStream,
      titulo,
      descricao,
    })
    .eq("id", LIVE_CONFIG_ID)
    .select()
    .single();

  if (error) {
    console.error("Erro ao ligar live:", error);
    throw error;
  }

  return config;
}

/**
 * Desliga a transmissão (ativa = false)
 */
export async function desligarLive(): Promise<LiveConfig> {
  const { data: config, error } = await supabase
    .from("live_config")
    .update({ ativa: false })
    .eq("id", LIVE_CONFIG_ID)
    .select()
    .single();

  if (error) {
    console.error("Erro ao desligar live:", error);
    throw error;
  }

  return config;
}

// =====================================================
// FUNÇÕES PARA AGENDAMENTO DE LIVES
// =====================================================

/**
 * Busca todas as lives agendadas (futuras)
 */
export async function getLivesAgendadas(): Promise<LiveSchedule[]> {
  const agora = new Date().toISOString();

  const { data, error } = await supabase
    .from("live_schedule")
    .select("*")
    .eq("ativa", true)
    .gte("data_inicio", agora)
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar lives agendadas:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todas as lives agendadas (incluindo passadas) - Para admin
 */
export async function getTodasLivesAgendadas(): Promise<LiveSchedule[]> {
  const { data, error } = await supabase
    .from("live_schedule")
    .select("*")
    .order("data_inicio", { ascending: false });

  if (error) {
    console.error("Erro ao buscar todas as lives agendadas:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria um novo agendamento de live
 */
export async function criarLiveAgendada(
  titulo: string,
  descricao: string | null,
  dataInicio: string,
  dataFim: string | null,
  urlStream: string | null,
  ativa: boolean,
  notificarUsuarios: boolean
): Promise<LiveSchedule> {
  const { data: schedule, error } = await supabase
    .from("live_schedule")
    .insert([
      {
        titulo,
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim,
        url_stream: urlStream,
        ativa,
        notificar_usuarios: notificarUsuarios,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar live agendada:", error);
    throw error;
  }

  return schedule;
}

/**
 * Atualiza um agendamento de live
 */
export async function atualizarLiveAgendada(
  id: string,
  titulo: string,
  descricao: string | null,
  dataInicio: string,
  dataFim: string | null,
  urlStream: string | null,
  ativa: boolean,
  notificarUsuarios: boolean
): Promise<LiveSchedule> {
  const { data: schedule, error } = await supabase
    .from("live_schedule")
    .update({
      titulo,
      descricao,
      data_inicio: dataInicio,
      data_fim: dataFim,
      url_stream: urlStream,
      ativa,
      notificar_usuarios: notificarUsuarios,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar live agendada:", error);
    throw error;
  }

  return schedule;
}

/**
 * Deleta um agendamento de live
 */
export async function deletarLiveAgendada(id: string): Promise<void> {
  const { error } = await supabase.from("live_schedule").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar live agendada:", error);
    throw error;
  }
}
