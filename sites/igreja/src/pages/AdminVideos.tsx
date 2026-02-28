import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Video as VideoIcon, List, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  getTodosVideos,
  criarVideo,
  atualizarVideo,
  deletarVideo,
  getTodasPlaylists,
  criarPlaylist,
  atualizarPlaylist,
  deletarPlaylist,
  type Video,
  type Playlist,
} from "@/services/videoService";

export default function AdminVideosContent() {
  // Estados para Vídeos
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [editandoVideo, setEditandoVideo] = useState<string | null>(null);

  // Estados para Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [editandoPlaylist, setEditandoPlaylist] = useState<string | null>(null);

  // Formulário de Vídeo
  const [tituloVideo, setTituloVideo] = useState("");
  const [descricaoVideo, setDescricaoVideo] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duracao, setDuracao] = useState("");
  const [pregador, setPregador] = useState("");
  const [categoriaVideo, setCategoriaVideo] = useState("");
  const [destaqueVideo, setDestaqueVideo] = useState(false);
  const [ordemVideo, setOrdemVideo] = useState(0);
  const [ativoVideo, setAtivoVideo] = useState(true);
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [horaPublicacao, setHoraPublicacao] = useState("19:00");

  // Formulário de Playlist
  const [nomePlaylist, setNomePlaylist] = useState("");
  const [descricaoPlaylist, setDescricaoPlaylist] = useState("");
  const [urlPlaylist, setUrlPlaylist] = useState("");
  const [quantidadeVideos, setQuantidadeVideos] = useState(0);
  const [categoriaPlaylist, setCategoriaPlaylist] = useState("");
  const [ordemPlaylist, setOrdemPlaylist] = useState(0);
  const [ativoPlaylist, setAtivoPlaylist] = useState(true);

  useEffect(() => {
    carregarVideos();
    carregarPlaylists();
  }, []);

  // =====================================================
  // FUNÇÕES PARA VÍDEOS
  // =====================================================

  const carregarVideos = async () => {
    try {
      setLoadingVideos(true);
      const data = await getTodosVideos();
      setVideos(data);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      toast.error("Erro ao carregar vídeos", {
        description: "Não foi possível carregar a lista de vídeos. Tente novamente.",
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tituloVideo || !urlVideo) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha título e URL do vídeo",
      });
      return;
    }

    const dataPublicacaoCompleta = dataPublicacao && horaPublicacao
      ? `${dataPublicacao}T${horaPublicacao}:00`
      : null;

    try {
      if (editandoVideo) {
        await atualizarVideo(
          editandoVideo,
          tituloVideo,
          descricaoVideo || null,
          urlVideo,
          thumbnailUrl || null,
          duracao || null,
          pregador || null,
          categoriaVideo || null,
          destaqueVideo,
          ordemVideo,
          ativoVideo,
          dataPublicacaoCompleta
        );
        toast.success("Vídeo atualizado!", {
          description: destaqueVideo
            ? `"${tituloVideo}" agora é o vídeo em destaque. Os outros destaques foram removidos automaticamente.`
            : `O vídeo "${tituloVideo}" foi atualizado com sucesso.`,
        });
      } else {
        await criarVideo(
          tituloVideo,
          descricaoVideo || null,
          urlVideo,
          thumbnailUrl || null,
          duracao || null,
          pregador || null,
          categoriaVideo || null,
          destaqueVideo,
          ordemVideo,
          ativoVideo,
          dataPublicacaoCompleta
        );
        toast.success("Vídeo criado!", {
          description: destaqueVideo
            ? `"${tituloVideo}" foi criado como destaque. Os outros destaques foram removidos automaticamente.`
            : `O vídeo "${tituloVideo}" foi criado com sucesso.`,
        });
      }

      limparFormularioVideo();
      carregarVideos();
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      toast.error("Erro ao salvar vídeo", {
        description: "Não foi possível salvar o vídeo. Tente novamente.",
      });
    }
  };

  const limparFormularioVideo = () => {
    setTituloVideo("");
    setDescricaoVideo("");
    setUrlVideo("");
    setThumbnailUrl("");
    setDuracao("");
    setPregador("");
    setCategoriaVideo("");
    setDestaqueVideo(false);
    setOrdemVideo(0);
    setAtivoVideo(true);
    setDataPublicacao("");
    setHoraPublicacao("19:00");
    setEditandoVideo(null);
  };

  const handleEditarVideo = (video: Video) => {
    setEditandoVideo(video.id);
    setTituloVideo(video.titulo);
    setDescricaoVideo(video.descricao || "");
    setUrlVideo(video.url_video);
    setThumbnailUrl(video.thumbnail_url || "");
    setDuracao(video.duracao || "");
    setPregador(video.pregador || "");
    setCategoriaVideo(video.categoria || "");
    setDestaqueVideo(video.destaque);
    setOrdemVideo(video.ordem);
    setAtivoVideo(video.ativo);

    if (video.data_publicacao) {
      const dataObj = new Date(video.data_publicacao);
      setDataPublicacao(dataObj.toISOString().split("T")[0]);
      setHoraPublicacao(dataObj.toTimeString().slice(0, 5));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletarVideo = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja deletar o vídeo "${titulo}"?`)) {
      return;
    }

    try {
      await deletarVideo(id);
      toast.success("Vídeo deletado!", {
        description: `O vídeo "${titulo}" foi deletado com sucesso.`,
      });
      carregarVideos();
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error);
      toast.error("Erro ao deletar vídeo", {
        description: "Não foi possível deletar o vídeo. Tente novamente.",
      });
    }
  };

  // =====================================================
  // FUNÇÕES PARA PLAYLISTS
  // =====================================================

  const carregarPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      const data = await getTodasPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Erro ao carregar playlists:", error);
      toast.error("Erro ao carregar playlists", {
        description: "Não foi possível carregar a lista de playlists. Tente novamente.",
      });
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleSubmitPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomePlaylist || !urlPlaylist) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha nome e URL da playlist",
      });
      return;
    }

    try {
      if (editandoPlaylist) {
        await atualizarPlaylist(
          editandoPlaylist,
          nomePlaylist,
          descricaoPlaylist || null,
          urlPlaylist,
          quantidadeVideos,
          categoriaPlaylist || null,
          ordemPlaylist,
          ativoPlaylist
        );
        toast.success("Playlist atualizada!", {
          description: `A playlist "${nomePlaylist}" foi atualizada com sucesso.`,
        });
      } else {
        await criarPlaylist(
          nomePlaylist,
          descricaoPlaylist || null,
          urlPlaylist,
          quantidadeVideos,
          categoriaPlaylist || null,
          ordemPlaylist,
          ativoPlaylist
        );
        toast.success("Playlist criada!", {
          description: `A playlist "${nomePlaylist}" foi criada com sucesso.`,
        });
      }

      limparFormularioPlaylist();
      carregarPlaylists();
    } catch (error) {
      console.error("Erro ao salvar playlist:", error);
      toast.error("Erro ao salvar playlist", {
        description: "Não foi possível salvar a playlist. Tente novamente.",
      });
    }
  };

  const limparFormularioPlaylist = () => {
    setNomePlaylist("");
    setDescricaoPlaylist("");
    setUrlPlaylist("");
    setQuantidadeVideos(0);
    setCategoriaPlaylist("");
    setOrdemPlaylist(0);
    setAtivoPlaylist(true);
    setEditandoPlaylist(null);
  };

  const handleEditarPlaylist = (playlist: Playlist) => {
    setEditandoPlaylist(playlist.id);
    setNomePlaylist(playlist.nome);
    setDescricaoPlaylist(playlist.descricao || "");
    setUrlPlaylist(playlist.url_playlist);
    setQuantidadeVideos(playlist.quantidade_videos);
    setCategoriaPlaylist(playlist.categoria || "");
    setOrdemPlaylist(playlist.ordem);
    setAtivoPlaylist(playlist.ativo);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletarPlaylist = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar a playlist "${nome}"?`)) {
      return;
    }

    try {
      await deletarPlaylist(id);
      toast.success("Playlist deletada!", {
        description: `A playlist "${nome}" foi deletada com sucesso.`,
      });
      carregarPlaylists();
    } catch (error) {
      console.error("Erro ao deletar playlist:", error);
      toast.error("Erro ao deletar playlist", {
        description: "Não foi possível deletar a playlist. Tente novamente.",
      });
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Vídeos e Playlists</h1>
        <p className="text-muted-foreground">
          Adicione, edite ou remova vídeos e playlists do YouTube
        </p>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <VideoIcon className="w-4 h-4" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Playlists
          </TabsTrigger>
        </TabsList>

        {/* =====================================================
            ABA: VÍDEOS
        ===================================================== */}
        <TabsContent value="videos" className="space-y-6">
          {/* Formulário de Vídeo */}
          <Card>
            <CardHeader>
              <CardTitle>{editandoVideo ? "Editar Vídeo" : "Novo Vídeo"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitVideo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="md:col-span-2">
                    <Label htmlFor="tituloVideo">Título *</Label>
                    <Input
                      id="tituloVideo"
                      value={tituloVideo}
                      onChange={(e) => setTituloVideo(e.target.value)}
                      placeholder="Ex: Mensagem Poderosa sobre Fé"
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div className="md:col-span-2">
                    <Label htmlFor="descricaoVideo">Descrição</Label>
                    <Textarea
                      id="descricaoVideo"
                      value={descricaoVideo}
                      onChange={(e) => setDescricaoVideo(e.target.value)}
                      placeholder="Descrição do vídeo..."
                      rows={3}
                    />
                  </div>

                  {/* URL do Vídeo */}
                  <div className="md:col-span-2">
                    <Label htmlFor="urlVideo">URL do YouTube *</Label>
                    <Input
                      id="urlVideo"
                      value={urlVideo}
                      onChange={(e) => setUrlVideo(e.target.value)}
                      placeholder="https://youtu.be/xxxxx ou https://www.youtube.com/watch?v=xxxxx"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole a URL do vídeo do YouTube
                    </p>
                  </div>

                  {/* URL da Thumbnail (Opcional) */}
                  <div className="md:col-span-2">
                    <Label htmlFor="thumbnailUrl">URL da Thumbnail (Opcional)</Label>
                    <Input
                      id="thumbnailUrl"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://exemplo.com/thumbnail.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Deixe em branco para usar a thumbnail padrão do YouTube
                    </p>
                  </div>

                  {/* Duração */}
                  <div>
                    <Label htmlFor="duracao">Duração</Label>
                    <Input
                      id="duracao"
                      value={duracao}
                      onChange={(e) => setDuracao(e.target.value)}
                      placeholder="Ex: 1h 15min ou 45min"
                    />
                  </div>

                  {/* Pregador */}
                  <div>
                    <Label htmlFor="pregador">Pregador/Orador</Label>
                    <Input
                      id="pregador"
                      value={pregador}
                      onChange={(e) => setPregador(e.target.value)}
                      placeholder="Ex: Pastor João Silva"
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <Label htmlFor="categoriaVideo">Categoria</Label>
                    <Input
                      id="categoriaVideo"
                      value={categoriaVideo}
                      onChange={(e) => setCategoriaVideo(e.target.value)}
                      placeholder="Ex: Culto, Pregação, Testemunho"
                    />
                  </div>

                  {/* Ordem */}
                  <div>
                    <Label htmlFor="ordemVideo">Ordem de Exibição</Label>
                    <Input
                      id="ordemVideo"
                      type="number"
                      value={ordemVideo}
                      onChange={(e) => setOrdemVideo(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Menor número aparece primeiro
                    </p>
                  </div>

                  {/* Data e Hora de Publicação */}
                  <div>
                    <Label htmlFor="dataPublicacao">Data de Publicação</Label>
                    <Input
                      id="dataPublicacao"
                      type="date"
                      value={dataPublicacao}
                      onChange={(e) => setDataPublicacao(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="horaPublicacao">Hora de Publicação</Label>
                    <Input
                      id="horaPublicacao"
                      type="time"
                      value={horaPublicacao}
                      onChange={(e) => setHoraPublicacao(e.target.value)}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="destaqueVideo"
                          checked={destaqueVideo}
                          onCheckedChange={(checked) => setDestaqueVideo(checked as boolean)}
                        />
                        <Label htmlFor="destaqueVideo" className="cursor-pointer">
                          Marcar como vídeo em destaque (aparece no topo da página)
                        </Label>
                      </div>
                      {destaqueVideo && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 ml-6">
                          ⚠️ Ao marcar este vídeo como destaque, todos os outros destaques serão removidos automaticamente
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ativoVideo"
                        checked={ativoVideo}
                        onCheckedChange={(checked) => setAtivoVideo(checked as boolean)}
                      />
                      <Label htmlFor="ativoVideo" className="cursor-pointer">
                        Vídeo ativo (visível na página pública)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editandoVideo ? "Atualizar Vídeo" : "Criar Vídeo"}
                  </Button>
                  {editandoVideo && (
                    <Button type="button" variant="outline" onClick={limparFormularioVideo}>
                      Cancelar Edição
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Vídeos */}
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Cadastrados ({videos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingVideos ? (
                <p className="text-center text-muted-foreground py-8">Carregando vídeos...</p>
              ) : videos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum vídeo cadastrado ainda.
                </p>
              ) : (
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="border rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{video.titulo}</h3>
                          {video.destaque && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Destaque
                            </span>
                          )}
                          {!video.ativo && (
                            <span className="text-xs bg-gray-500/20 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Inativo
                            </span>
                          )}
                        </div>
                        {video.descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {video.descricao}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {video.pregador && <span>👤 {video.pregador}</span>}
                          {video.categoria && <span>📁 {video.categoria}</span>}
                          {video.duracao && <span>⏱️ {video.duracao}</span>}
                          {video.data_publicacao && (
                            <span>
                              📅 {new Date(video.data_publicacao).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                          <span>🔢 Ordem: {video.ordem}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditarVideo(video)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletarVideo(video.id, video.titulo)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =====================================================
            ABA: PLAYLISTS
        ===================================================== */}
        <TabsContent value="playlists" className="space-y-6">
          {/* Formulário de Playlist */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editandoPlaylist ? "Editar Playlist" : "Nova Playlist"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPlaylist} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="md:col-span-2">
                    <Label htmlFor="nomePlaylist">Nome da Playlist *</Label>
                    <Input
                      id="nomePlaylist"
                      value={nomePlaylist}
                      onChange={(e) => setNomePlaylist(e.target.value)}
                      placeholder="Ex: Série: Fundamentos da Fé"
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div className="md:col-span-2">
                    <Label htmlFor="descricaoPlaylist">Descrição</Label>
                    <Textarea
                      id="descricaoPlaylist"
                      value={descricaoPlaylist}
                      onChange={(e) => setDescricaoPlaylist(e.target.value)}
                      placeholder="Descrição da série ou playlist..."
                      rows={3}
                    />
                  </div>

                  {/* URL da Playlist */}
                  <div className="md:col-span-2">
                    <Label htmlFor="urlPlaylist">URL da Playlist do YouTube *</Label>
                    <Input
                      id="urlPlaylist"
                      value={urlPlaylist}
                      onChange={(e) => setUrlPlaylist(e.target.value)}
                      placeholder="https://www.youtube.com/playlist?list=xxxxx"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Cole a URL completa da playlist do YouTube
                    </p>
                  </div>

                  {/* Quantidade de Vídeos */}
                  <div>
                    <Label htmlFor="quantidadeVideos">Quantidade de Vídeos</Label>
                    <Input
                      id="quantidadeVideos"
                      type="number"
                      value={quantidadeVideos}
                      onChange={(e) => setQuantidadeVideos(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <Label htmlFor="categoriaPlaylist">Categoria</Label>
                    <Input
                      id="categoriaPlaylist"
                      value={categoriaPlaylist}
                      onChange={(e) => setCategoriaPlaylist(e.target.value)}
                      placeholder="Ex: Série, Testemunhos, Estudos"
                    />
                  </div>

                  {/* Ordem */}
                  <div>
                    <Label htmlFor="ordemPlaylist">Ordem de Exibição</Label>
                    <Input
                      id="ordemPlaylist"
                      type="number"
                      value={ordemPlaylist}
                      onChange={(e) => setOrdemPlaylist(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Menor número aparece primeiro
                    </p>
                  </div>

                  {/* Checkbox Ativo */}
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ativoPlaylist"
                        checked={ativoPlaylist}
                        onCheckedChange={(checked) => setAtivoPlaylist(checked as boolean)}
                      />
                      <Label htmlFor="ativoPlaylist" className="cursor-pointer">
                        Playlist ativa (visível na página pública)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editandoPlaylist ? "Atualizar Playlist" : "Criar Playlist"}
                  </Button>
                  {editandoPlaylist && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={limparFormularioPlaylist}
                    >
                      Cancelar Edição
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Playlists */}
          <Card>
            <CardHeader>
              <CardTitle>Playlists Cadastradas ({playlists.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPlaylists ? (
                <p className="text-center text-muted-foreground py-8">
                  Carregando playlists...
                </p>
              ) : playlists.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma playlist cadastrada ainda.
                </p>
              ) : (
                <div className="space-y-3">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="border rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{playlist.nome}</h3>
                          {!playlist.ativo && (
                            <span className="text-xs bg-gray-500/20 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              Inativo
                            </span>
                          )}
                        </div>
                        {playlist.descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {playlist.descricao}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>🎬 {playlist.quantidade_videos} vídeos</span>
                          {playlist.categoria && <span>📁 {playlist.categoria}</span>}
                          <span>🔢 Ordem: {playlist.ordem}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditarPlaylist(playlist)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletarPlaylist(playlist.id, playlist.nome)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

