import { supabase } from "@/lib/supabase";

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  local: string | null;
  tipo: string | null;
  destaque: boolean;
  imagem_url: string | null;
  created_at: string;
}

/**
 * Busca eventos futuros (a partir de hoje)
 */
export async function getEventosFuturos(): Promise<Evento[]> {
  const hoje = new Date().toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .gte("data_inicio", hoje)
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar eventos futuros:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca eventos de um mês específico
 */
export async function getEventosDoMes(ano: number, mes: number): Promise<Evento[]> {
  const inicioMes = new Date(ano, mes, 1).toISOString();
  const fimMes = new Date(ano, mes + 1, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .gte("data_inicio", inicioMes)
    .lte("data_inicio", fimMes)
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar eventos do mês:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca eventos em destaque
 */
export async function getEventosDestaque(): Promise<Evento[]> {
  const hoje = new Date().toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("destaque", true)
    .gte("data_inicio", hoje)
    .order("data_inicio", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Erro ao buscar eventos destaque:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todos os eventos para a tela de admin
 */
export async function getTodosEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("data_inicio", { ascending: false });

  if (error) {
    console.error("Erro ao buscar todos os eventos:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria um novo evento
 */
export async function criarEvento(
  titulo: string,
  descricao: string | null,
  dataInicio: string,
  dataFim: string | null,
  local: string | null,
  tipo: string | null,
  destaque: boolean,
  imagemUrl: string | null
): Promise<Evento> {
  const { data: evento, error } = await supabase
    .from("eventos")
    .insert([
      {
        titulo,
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim,
        local,
        tipo,
        destaque,
        imagem_url: imagemUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }

  return evento;
}

/**
 * Atualiza um evento existente
 */
export async function atualizarEvento(
  id: string,
  titulo: string,
  descricao: string | null,
  dataInicio: string,
  dataFim: string | null,
  local: string | null,
  tipo: string | null,
  destaque: boolean,
  imagemUrl: string | null
): Promise<Evento> {
  const { data: evento, error } = await supabase
    .from("eventos")
    .update({
      titulo,
      descricao,
      data_inicio: dataInicio,
      data_fim: dataFim,
      local,
      tipo,
      destaque,
      imagem_url: imagemUrl,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }

  return evento;
}

/**
 * Deleta um evento
 */
export async function deletarEvento(id: string): Promise<void> {
  const { error } = await supabase.from("eventos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar evento:", error);
    throw error;
  }
}
