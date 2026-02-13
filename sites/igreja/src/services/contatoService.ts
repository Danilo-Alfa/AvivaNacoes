import { supabase } from "@/lib/supabase";

export interface MensagemContato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string;
  mensagem: string;
  lida: boolean;
  created_at: string;
}

export async function salvarMensagemContato(
  nome: string,
  email: string,
  telefone: string | null,
  assunto: string,
  mensagem: string
): Promise<MensagemContato> {
  const { data, error } = await supabase
    .from("mensagens_contato")
    .insert([{ nome, email, telefone, assunto, mensagem }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar mensagem de contato:", error);
    throw error;
  }

  return data;
}

export async function getTodasMensagens(): Promise<MensagemContato[]> {
  const { data, error } = await supabase
    .from("mensagens_contato")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw error;
  }

  return data || [];
}

export async function marcarComoLida(id: string): Promise<void> {
  const { error } = await supabase
    .from("mensagens_contato")
    .update({ lida: true })
    .eq("id", id);

  if (error) {
    console.error("Erro ao marcar mensagem como lida:", error);
    throw error;
  }
}

export async function deletarMensagem(id: string): Promise<void> {
  const { error } = await supabase
    .from("mensagens_contato")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar mensagem:", error);
    throw error;
  }
}
