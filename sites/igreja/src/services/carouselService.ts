import { supabase } from "@/lib/supabase";

export interface FotoCarousel {
  id: string;
  url_imagem: string;
  titulo: string | null;
  link_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Busca todas as fotos do carrossel para a tela de admin
 */
export async function getTodasFotosCarousel(): Promise<FotoCarousel[]> {
  const { data, error } = await supabase
    .from("fotos_carousel")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar fotos do carrossel:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova foto no carrossel
 */
export async function criarFotoCarousel(
  urlImagem: string,
  titulo: string | null,
  linkUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<FotoCarousel> {
  const { data: foto, error } = await supabase
    .from("fotos_carousel")
    .insert([
      {
        url_imagem: urlImagem,
        titulo: titulo,
        link_url: linkUrl,
        ordem: ordem,
        ativo: ativo,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar foto do carrossel:", error);
    throw error;
  }

  return foto;
}

/**
 * Atualiza uma foto do carrossel existente
 */
export async function atualizarFotoCarousel(
  id: string,
  urlImagem: string,
  titulo: string | null,
  linkUrl: string | null,
  ordem: number,
  ativo: boolean
): Promise<FotoCarousel> {
  const { data: foto, error } = await supabase
    .from("fotos_carousel")
    .update({
      url_imagem: urlImagem,
      titulo: titulo,
      link_url: linkUrl,
      ordem: ordem,
      ativo: ativo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar foto do carrossel:", error);
    throw error;
  }

  return foto;
}

/**
 * Deleta uma foto do carrossel
 */
export async function deletarFotoCarousel(id: string): Promise<void> {
  const { error } = await supabase
    .from("fotos_carousel")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar foto do carrossel:", error);
    throw error;
  }
}
