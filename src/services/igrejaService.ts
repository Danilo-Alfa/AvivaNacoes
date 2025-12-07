import { supabase } from "@/lib/supabase";

export interface Igreja {
  id: string;
  nome: string;
  bairro: string | null;
  endereco: string;
  cidade: string | null;
  cep: string | null;
  telefone: string | null;
  whatsapp: string | null;
  horarios: string | null;
  pastor: string | null;
  latitude: number | null;
  longitude: number | null;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Busca todas as igrejas ativas
 */
export async function getIgrejasAtivas(): Promise<Igreja[]> {
  const { data, error } = await supabase
    .from("igrejas")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar igrejas:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todas as igrejas (para admin)
 */
export async function getTodasIgrejas(): Promise<Igreja[]> {
  const { data, error } = await supabase
    .from("igrejas")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar todas as igrejas:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova igreja
 */
export async function criarIgreja(
  nome: string,
  bairro: string | null,
  endereco: string,
  cidade: string | null,
  cep: string | null,
  telefone: string | null,
  whatsapp: string | null,
  horarios: string | null,
  pastor: string | null,
  latitude: number | null,
  longitude: number | null,
  imagemUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<Igreja> {
  const { data, error } = await supabase
    .from("igrejas")
    .insert([
      {
        nome,
        bairro,
        endereco,
        cidade,
        cep,
        telefone,
        whatsapp,
        horarios,
        pastor,
        latitude,
        longitude,
        imagem_url: imagemUrl,
        ordem,
        ativo,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar igreja:", error);
    throw error;
  }

  return data;
}

/**
 * Atualiza uma igreja
 */
export async function atualizarIgreja(
  id: string,
  nome: string,
  bairro: string | null,
  endereco: string,
  cidade: string | null,
  cep: string | null,
  telefone: string | null,
  whatsapp: string | null,
  horarios: string | null,
  pastor: string | null,
  latitude: number | null,
  longitude: number | null,
  imagemUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<Igreja> {
  const { data, error } = await supabase
    .from("igrejas")
    .update({
      nome,
      bairro,
      endereco,
      cidade,
      cep,
      telefone,
      whatsapp,
      horarios,
      pastor,
      latitude,
      longitude,
      imagem_url: imagemUrl,
      ordem,
      ativo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar igreja:", error);
    throw error;
  }

  return data;
}

/**
 * Deleta uma igreja
 */
export async function deletarIgreja(id: string): Promise<void> {
  const { error } = await supabase.from("igrejas").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar igreja:", error);
    throw error;
  }
}
