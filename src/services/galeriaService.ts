import { supabase } from "@/lib/supabase";

export interface Galeria {
  id: string;
  url_album: string;
  titulo: string;
  descricao: string | null;
  data: string;
  capa_url: string | null;
  created_at: string;
}

/**
 * Busca as últimas 10 galerias ordenadas por data
 */
export async function getUltimasGalerias(): Promise<Galeria[]> {
  const { data, error } = await supabase
    .from("galerias")
    .select("*")
    .order("data", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Erro ao buscar galerias:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todas as galerias para a tela de admin
 */
export async function getTodasGalerias(): Promise<Galeria[]> {
  const { data, error } = await supabase
    .from("galerias")
    .select("*")
    .order("data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar todas as galerias:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova galeria
 */
export async function criarGaleria(
  urlAlbum: string,
  titulo: string,
  descricao: string | null,
  data: string,
  capaUrl: string | null
): Promise<Galeria> {
  const { data: galeria, error } = await supabase
    .from("galerias")
    .insert([
      {
        url_album: urlAlbum,
        titulo: titulo,
        descricao: descricao,
        data: data,
        capa_url: capaUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar galeria:", error);
    throw error;
  }

  return galeria;
}

/**
 * Atualiza uma galeria existente
 */
export async function atualizarGaleria(
  id: string,
  urlAlbum: string,
  titulo: string,
  descricao: string | null,
  data: string,
  capaUrl: string | null
): Promise<Galeria> {
  const { data: galeria, error } = await supabase
    .from("galerias")
    .update({
      url_album: urlAlbum,
      titulo: titulo,
      descricao: descricao,
      data: data,
      capa_url: capaUrl,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar galeria:", error);
    throw error;
  }

  return galeria;
}

/**
 * Deleta uma galeria
 */
export async function deletarGaleria(id: string): Promise<void> {
  const { error } = await supabase.from("galerias").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar galeria:", error);
    throw error;
  }
}
