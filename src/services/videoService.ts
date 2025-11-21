import { supabase } from "@/lib/supabase";

// =====================================================
// INTERFACES
// =====================================================

export interface Video {
  id: string;
  titulo: string;
  descricao: string | null;
  url_video: string;
  thumbnail_url: string | null;
  duracao: string | null;
  pregador: string | null;
  categoria: string | null;
  destaque: boolean;
  ordem: number;
  ativo: boolean;
  data_publicacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  nome: string;
  descricao: string | null;
  url_playlist: string;
  quantidade_videos: number;
  categoria: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// FUNÇÕES PARA VÍDEOS
// =====================================================

/**
 * Busca todos os vídeos ativos, ordenados por ordem e data
 * Usado na página pública de vídeos
 */
export async function getVideosAtivos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .order("data_publicacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar vídeos ativos:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca o vídeo em destaque
 * Retorna o primeiro vídeo marcado como destaque
 */
export async function getVideoDestaque(): Promise<Video | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", true)
    .order("ordem", { ascending: true })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = nenhum resultado encontrado
    console.error("Erro ao buscar vídeo em destaque:", error);
    throw error;
  }

  return data || null;
}

/**
 * Busca vídeos recentes (exceto o destaque)
 * Usado para exibir grid de vídeos na página pública
 */
export async function getVideosRecentes(limite: number = 9): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("ativo", true)
    .eq("destaque", false)
    .order("data_publicacao", { ascending: false })
    .limit(limite);

  if (error) {
    console.error("Erro ao buscar vídeos recentes:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todos os vídeos (incluindo inativos)
 * Usado na tela de admin
 */
export async function getTodosVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("ordem", { ascending: true })
    .order("data_publicacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar todos os vídeos:", error);
    throw error;
  }

  return data || [];
}

/**
 * Remove o destaque de todos os vídeos
 * Usado quando um novo vídeo é marcado como destaque
 */
async function removerTodosDestaques(): Promise<void> {
  const { error } = await supabase
    .from("videos")
    .update({ destaque: false })
    .eq("destaque", true);

  if (error) {
    console.error("Erro ao remover destaques:", error);
    throw error;
  }
}

/**
 * Cria um novo vídeo
 * Se destaque=true, remove o destaque de todos os outros vídeos antes
 */
export async function criarVideo(
  titulo: string,
  descricao: string | null,
  urlVideo: string,
  thumbnailUrl: string | null,
  duracao: string | null,
  pregador: string | null,
  categoria: string | null,
  destaque: boolean,
  ordem: number,
  ativo: boolean,
  dataPublicacao: string | null
): Promise<Video> {
  // Se este vídeo será destaque, remove o destaque dos outros
  if (destaque) {
    await removerTodosDestaques();
  }

  const { data: video, error } = await supabase
    .from("videos")
    .insert([
      {
        titulo,
        descricao,
        url_video: urlVideo,
        thumbnail_url: thumbnailUrl,
        duracao,
        pregador,
        categoria,
        destaque,
        ordem,
        ativo,
        data_publicacao: dataPublicacao,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar vídeo:", error);
    throw error;
  }

  return video;
}

/**
 * Atualiza um vídeo existente
 * Se destaque=true, remove o destaque de todos os outros vídeos antes
 */
export async function atualizarVideo(
  id: string,
  titulo: string,
  descricao: string | null,
  urlVideo: string,
  thumbnailUrl: string | null,
  duracao: string | null,
  pregador: string | null,
  categoria: string | null,
  destaque: boolean,
  ordem: number,
  ativo: boolean,
  dataPublicacao: string | null
): Promise<Video> {
  // Se este vídeo será destaque, remove o destaque dos outros (exceto este)
  if (destaque) {
    const { error: removeError } = await supabase
      .from("videos")
      .update({ destaque: false })
      .eq("destaque", true)
      .neq("id", id);

    if (removeError) {
      console.error("Erro ao remover destaques:", removeError);
      throw removeError;
    }
  }

  const { data: video, error } = await supabase
    .from("videos")
    .update({
      titulo,
      descricao,
      url_video: urlVideo,
      thumbnail_url: thumbnailUrl,
      duracao,
      pregador,
      categoria,
      destaque,
      ordem,
      ativo,
      data_publicacao: dataPublicacao,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar vídeo:", error);
    throw error;
  }

  return video;
}

/**
 * Deleta um vídeo
 */
export async function deletarVideo(id: string): Promise<void> {
  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar vídeo:", error);
    throw error;
  }
}

// =====================================================
// FUNÇÕES PARA PLAYLISTS
// =====================================================

/**
 * Busca todas as playlists ativas
 * Usado na página pública de vídeos
 */
export async function getPlaylistsAtivas(): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar playlists ativas:", error);
    throw error;
  }

  return data || [];
}

/**
 * Busca todas as playlists (incluindo inativas)
 * Usado na tela de admin
 */
export async function getTodasPlaylists(): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar todas as playlists:", error);
    throw error;
  }

  return data || [];
}

/**
 * Cria uma nova playlist
 */
export async function criarPlaylist(
  nome: string,
  descricao: string | null,
  urlPlaylist: string,
  quantidadeVideos: number,
  categoria: string | null,
  ordem: number,
  ativo: boolean
): Promise<Playlist> {
  const { data: playlist, error } = await supabase
    .from("playlists")
    .insert([
      {
        nome,
        descricao,
        url_playlist: urlPlaylist,
        quantidade_videos: quantidadeVideos,
        categoria,
        ordem,
        ativo,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar playlist:", error);
    throw error;
  }

  return playlist;
}

/**
 * Atualiza uma playlist existente
 */
export async function atualizarPlaylist(
  id: string,
  nome: string,
  descricao: string | null,
  urlPlaylist: string,
  quantidadeVideos: number,
  categoria: string | null,
  ordem: number,
  ativo: boolean
): Promise<Playlist> {
  const { data: playlist, error } = await supabase
    .from("playlists")
    .update({
      nome,
      descricao,
      url_playlist: urlPlaylist,
      quantidade_videos: quantidadeVideos,
      categoria,
      ordem,
      ativo,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar playlist:", error);
    throw error;
  }

  return playlist;
}

/**
 * Deleta uma playlist
 */
export async function deletarPlaylist(id: string): Promise<void> {
  const { error } = await supabase.from("playlists").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar playlist:", error);
    throw error;
  }
}
