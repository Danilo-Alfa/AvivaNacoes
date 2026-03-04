import { supabase } from "@/lib/supabase";

export interface DiaSemCulto {
  id: string;
  data: string; // formato YYYY-MM-DD
  motivo: string | null;
  created_at: string;
}

/**
 * Busca todos os dias sem culto
 */
export async function getDiasSemCulto(): Promise<DiaSemCulto[]> {
  const { data, error } = await supabase
    .from("dias_sem_culto")
    .select("*")
    .order("data", { ascending: true });

  if (error) {
    console.error("Erro ao buscar dias sem culto:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca dias sem culto de um mês específico
 */
export async function getDiasSemCultoDoMes(
  ano: number,
  mes: number
): Promise<DiaSemCulto[]> {
  const inicioMes = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const fimMes = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("dias_sem_culto")
    .select("*")
    .gte("data", inicioMes)
    .lte("data", fimMes)
    .order("data", { ascending: true });

  if (error) {
    console.error("Erro ao buscar dias sem culto do mês:", error);
    throw error;
  }

  return data || [];
}

/**
 * Adiciona um dia sem culto
 */
export async function adicionarDiaSemCulto(
  data: string,
  motivo: string | null
): Promise<DiaSemCulto> {
  const { data: registro, error } = await supabase
    .from("dias_sem_culto")
    .insert([{ data, motivo }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar dia sem culto:", error);
    throw error;
  }

  return registro;
}

/**
 * Remove um dia sem culto
 */
export async function removerDiaSemCulto(id: string): Promise<void> {
  const { error } = await supabase
    .from("dias_sem_culto")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao remover dia sem culto:", error);
    throw error;
  }
}
