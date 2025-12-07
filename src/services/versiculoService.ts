import { supabase, Versiculo } from '@/lib/supabase';

export const versiculoService = {
  // Buscar o versículo do dia (mais recente)
  async getVersiculoDoDia(): Promise<Versiculo | null> {
    const { data, error } = await supabase
      .from('versiculos')
      .select('*')
      .eq('ativo', true)
      .order('data', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Erro ao buscar versículo do dia:', error);
      return null;
    }

    return data;
  },

  // Buscar versículos anteriores (exceto o mais recente)
  async getVersiculosAnteriores(limit: number = 6): Promise<Versiculo[]> {
    const { data, error } = await supabase
      .from('versiculos')
      .select('*')
      .eq('ativo', true)
      .order('data', { ascending: false })
      .range(1, limit); // Pula o primeiro (versículo do dia)

    if (error) {
      console.error('Erro ao buscar versículos anteriores:', error);
      return [];
    }

    return data || [];
  },

  // Buscar todos os versículos (para o admin)
  async getTodosVersiculos(): Promise<Versiculo[]> {
    const { data, error } = await supabase
      .from('versiculos')
      .select('*')
      .order('data', { ascending: false });

    if (error) {
      console.error('Erro ao buscar todos os versículos:', error);
      return [];
    }

    return data || [];
  },

  // Criar novo versículo
  async criarVersiculo(
    url_post: string,
    url_imagem: string,
    titulo: string,
    data: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('versiculos').insert([
      {
        url_post: url_post || null,
        url_imagem: url_imagem || null,
        titulo: titulo || null,
        data,
        ativo: true,
      },
    ]);

    if (error) {
      console.error('Erro ao criar versículo:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Atualizar versículo
  async atualizarVersiculo(
    id: string,
    url_post: string,
    url_imagem: string,
    titulo: string,
    data: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('versiculos')
      .update({
        url_post: url_post || null,
        url_imagem: url_imagem || null,
        titulo: titulo || null,
        data
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar versículo:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Deletar versículo
  async deletarVersiculo(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('versiculos').delete().eq('id', id);

    if (error) {
      console.error('Erro ao deletar versículo:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Ativar/Desativar versículo
  async toggleAtivo(
    id: string,
    ativo: boolean
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('versiculos')
      .update({ ativo })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};
