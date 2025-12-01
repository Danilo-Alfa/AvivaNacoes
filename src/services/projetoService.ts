import { supabase } from "@/lib/supabase";

export interface Projeto {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  objetivo: string | null;
  publico_alvo: string | null;
  frequencia: string | null;
  como_participar: string | null;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Busca todos os projetos ativos
 */
export async function getProjetosAtivos(): Promise<Projeto[]> {
  const { data, error } = await supabase
    .from("projetos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar projetos:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todos os projetos (para admin)
 */
export async function getTodosProjetos(): Promise<Projeto[]> {
  const { data, error } = await supabase
    .from("projetos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar todos os projetos:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria um novo projeto
 */
export async function criarProjeto(
  nome: string,
  descricao: string | null,
  categoria: string | null,
  objetivo: string | null,
  publicoAlvo: string | null,
  frequencia: string | null,
  comoParticipar: string | null,
  imagemUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<Projeto> {
  const { data, error } = await supabase
    .from("projetos")
    .insert([
      {
        nome,
        descricao,
        categoria,
        objetivo,
        publico_alvo: publicoAlvo,
        frequencia,
        como_participar: comoParticipar,
        imagem_url: imagemUrl,
        ordem,
        ativo,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar projeto:", error);
    throw error;
  }

  return data;
}

/**
 * Atualiza um projeto
 */
export async function atualizarProjeto(
  id: string,
  nome: string,
  descricao: string | null,
  categoria: string | null,
  objetivo: string | null,
  publicoAlvo: string | null,
  frequencia: string | null,
  comoParticipar: string | null,
  imagemUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<Projeto> {
  const { data, error } = await supabase
    .from("projetos")
    .update({
      nome,
      descricao,
      categoria,
      objetivo,
      publico_alvo: publicoAlvo,
      frequencia,
      como_participar: comoParticipar,
      imagem_url: imagemUrl,
      ordem,
      ativo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar projeto:", error);
    throw error;
  }

  return data;
}

/**
 * Deleta um projeto
 */
export async function deletarProjeto(id: string): Promise<void> {
  const { error } = await supabase.from("projetos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar projeto:", error);
    throw error;
  }
}
