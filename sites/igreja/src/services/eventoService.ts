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
  cor: string | null;
  created_at: string;
}

/**
 * Busca eventos futuros (a partir de hoje)
 * Inclui eventos que ainda não terminaram (data_fim >= hoje OU data_inicio >= hoje)
 */
export async function getEventosFuturos(): Promise<Evento[]> {
  const hoje = new Date().toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .or(`data_inicio.gte.${hoje},data_fim.gte.${hoje}`)
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar eventos futuros:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca eventos de um mês específico
 * Inclui eventos que:
 * - Começam no mês
 * - Terminam no mês (mas começaram antes)
 * - Se estendem pelo mês (começam antes e terminam depois)
 */
export async function getEventosDoMes(ano: number, mes: number): Promise<Evento[]> {
  const inicioMes = new Date(ano, mes, 1).toISOString();
  const fimMes = new Date(ano, mes + 1, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .or(`and(data_inicio.gte.${inicioMes},data_inicio.lte.${fimMes}),and(data_fim.gte.${inicioMes},data_fim.lte.${fimMes}),and(data_inicio.lte.${inicioMes},data_fim.gte.${fimMes})`)
    .order("data_inicio", { ascending: true });

  if (error) {
    console.error("Erro ao buscar eventos do mês:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca eventos em destaque
 * Inclui eventos que ainda não terminaram (data_fim >= hoje OU data_inicio >= hoje)
 */
export async function getEventosDestaque(): Promise<Evento[]> {
  const hoje = new Date().toISOString();

  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("destaque", true)
    .or(`data_inicio.gte.${hoje},data_fim.gte.${hoje}`)
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
  imagemUrl: string | null,
  cor: string | null
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
        cor,
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
  imagemUrl: string | null,
  cor: string | null
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
      cor,
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
