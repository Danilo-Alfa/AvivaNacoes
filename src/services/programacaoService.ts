import { supabase } from "@/lib/supabase";

export interface Programacao {
  id: string;
  titulo: string;
  dia_semana: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  horario: string;
  local: string | null;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Mapeamento de dias da semana
export const DIAS_SEMANA = [
  { valor: 0, nome: "Domingo" },
  { valor: 1, nome: "Segunda" },
  { valor: 2, nome: "Terça" },
  { valor: 3, nome: "Quarta" },
  { valor: 4, nome: "Quinta" },
  { valor: 5, nome: "Sexta" },
  { valor: 6, nome: "Sábado" },
];

export function getNomeDiaSemana(dia: number): string {
  return DIAS_SEMANA.find((d) => d.valor === dia)?.nome || "";
}

/**
 * Busca toda a programação ativa agrupada por dia
 */
export async function getProgramacaoAtiva(): Promise<Programacao[]> {
  const { data, error } = await supabase
    .from("programacao")
    .select("*")
    .eq("ativo", true)
    .order("dia_semana", { ascending: true })
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar programação:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca toda a programação (para admin)
 */
export async function getTodaProgramacao(): Promise<Programacao[]> {
  const { data, error } = await supabase
    .from("programacao")
    .select("*")
    .order("dia_semana", { ascending: true })
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar toda programação:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova atividade na programação
 */
export async function criarProgramacao(
  titulo: string,
  diaSemana: number,
  horario: string,
  local: string | null,
  descricao: string | null,
  ordem: number,
  ativo: boolean
): Promise<Programacao> {
  const { data, error } = await supabase
    .from("programacao")
    .insert([
      {
        titulo,
        dia_semana: diaSemana,
        horario,
        local,
        descricao,
        ordem,
        ativo,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar programação:", error);
    throw error;
  }

  return data;
}

/**
 * Atualiza uma atividade da programação
 */
export async function atualizarProgramacao(
  id: string,
  titulo: string,
  diaSemana: number,
  horario: string,
  local: string | null,
  descricao: string | null,
  ordem: number,
  ativo: boolean
): Promise<Programacao> {
  const { data, error } = await supabase
    .from("programacao")
    .update({
      titulo,
      dia_semana: diaSemana,
      horario,
      local,
      descricao,
      ordem,
      ativo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar programação:", error);
    throw error;
  }

  return data;
}

/**
 * Deleta uma atividade da programação
 */
export async function deletarProgramacao(id: string): Promise<void> {
  const { error } = await supabase.from("programacao").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar programação:", error);
    throw error;
  }
}
