import { supabase } from "@/lib/supabase";

export interface Jornal {
  id: string;
  url_pdf: string;
  titulo: string | null;
  data: string;
  created_at: string;
}

/**
 * Busca os últimos 5 jornais ordenados por data
 */
export async function getUltimosJornais(): Promise<Jornal[]> {
  const { data, error } = await supabase
    .from("jornais")
    .select("*")
    .order("data", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao buscar jornais:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todos os jornais para a tela de admin
 */
export async function getTodosJornais(): Promise<Jornal[]> {
  const { data, error } = await supabase
    .from("jornais")
    .select("*")
    .order("data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar todos os jornais:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria um novo jornal
 */
export async function criarJornal(
  urlPdf: string,
  titulo: string | null,
  data: string
): Promise<Jornal> {
  const { data: jornal, error } = await supabase
    .from("jornais")
    .insert([
      {
        url_pdf: urlPdf,
        titulo: titulo,
        data: data,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar jornal:", error);
    throw error;
  }

  return jornal;
}

/**
 * Atualiza um jornal existente
 */
export async function atualizarJornal(
  id: string,
  urlPdf: string,
  titulo: string | null,
  data: string
): Promise<Jornal> {
  const { data: jornal, error } = await supabase
    .from("jornais")
    .update({
      url_pdf: urlPdf,
      titulo: titulo,
      data: data,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar jornal:", error);
    throw error;
  }

  return jornal;
}

/**
 * Deleta um jornal
 */
export async function deletarJornal(id: string): Promise<void> {
  const { error } = await supabase.from("jornais").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar jornal:", error);
    throw error;
  }
}

/**
 * Faz upload de um PDF para o Supabase Storage e retorna a URL pública
 */
export async function uploadPdfJornal(arquivo: File): Promise<string> {
  const nomeArquivo = `${Date.now()}-${arquivo.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const { error } = await supabase.storage
    .from("jornais")
    .upload(nomeArquivo, arquivo, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload do PDF:", error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("jornais")
    .getPublicUrl(nomeArquivo);

  return urlData.publicUrl;
}
