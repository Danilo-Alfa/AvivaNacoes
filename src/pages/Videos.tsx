import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play } from "lucide-react";
import ReactPlayer from "react-player";
import {
  getVideoDestaque,
  getVideosRecentes,
  getPlaylistsAtivas,
  type Video,
  type Playlist,
} from "@/services/videoService";

export default function Videos() {
  const [videoDestaque, setVideoDestaque] = useState<Video | null>(null);
  const [videosRecentes, setVideosRecentes] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [destaque, recentes, playlistsData] = await Promise.all([
        getVideoDestaque(),
        getVideosRecentes(9),
        getPlaylistsAtivas(),
      ]);

      setVideoDestaque(destaque);
      setVideosRecentes(recentes);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarDataRelativa = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return "Hoje";
    if (diffDias === 1) return "Ontem";
    if (diffDias < 7) return `${diffDias} dias atrás`;
    if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
    if (diffDias < 365) return `${Math.floor(diffDias / 30)} meses atrás`;
    return data.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Carregando vídeos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      {/* Hero Section */}
      <div className="mb-6 sm:mb-8 md:mb-16 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Vídeos
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
          Assista às mensagens, testemunhos e momentos especiais da nossa igreja
        </p>
      </div>

      {/* Vídeo em Destaque */}
      {videoDestaque && (
        <section className="mb-6 sm:mb-8 md:mb-16">
          <Card className="shadow-medium">
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                <ReactPlayer
                  src={videoDestaque.url_video}
                  width="100%"
                  height="100%"
                  controls
                  light={videoDestaque.thumbnail_url || true}
                  playing={false}
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                  {videoDestaque.titulo}
                </h2>
                {videoDestaque.descricao && (
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4">
                    {videoDestaque.descricao}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  {videoDestaque.duracao && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      {videoDestaque.duracao}
                    </span>
                  )}
                  {videoDestaque.duracao && videoDestaque.data_publicacao && (
                    <span className="hidden sm:inline">•</span>
                  )}
                  {videoDestaque.data_publicacao && (
                    <span>
                      {new Date(videoDestaque.data_publicacao).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Grid de Vídeos */}
      {videosRecentes.length > 0 && (
        <section className="mb-6 sm:mb-8 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
            Vídeos Recentes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {videosRecentes.map((video) => (
              <Card
                key={video.id}
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                    <ReactPlayer
                      src={video.url_video}
                      width="100%"
                      height="100%"
                      controls={false}
                      light={video.thumbnail_url || true}
                      playing={false}
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 line-clamp-2">
                      {video.titulo}
                    </h3>
                    {video.descricao && (
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                        {video.descricao}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                      <span className="truncate mr-2">
                        {video.pregador || "AvivaNações"}
                      </span>
                      {video.data_publicacao && (
                        <span className="whitespace-nowrap">
                          {formatarDataRelativa(video.data_publicacao)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Séries de Vídeos */}
      {playlists.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
            Séries e Playlists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="shadow-soft hover:shadow-medium transition-all"
              >
                <CardContent className="p-0">
                  <div className="flex sm:grid sm:grid-cols-3 gap-0">
                    <div className="w-20 sm:w-auto sm:col-span-1 bg-gradient-hero flex items-center justify-center p-3 sm:p-4 flex-shrink-0">
                      <div className="text-center text-primary-foreground">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                          {playlist.quantidade_videos}
                        </div>
                        <div className="text-[10px] sm:text-xs">vídeos</div>
                      </div>
                    </div>
                    <div className="flex-1 sm:col-span-2 p-3 sm:p-4 md:p-6 flex flex-col justify-center min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 truncate">
                        {playlist.nome}
                      </h3>
                      {playlist.descricao && (
                        <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-4 line-clamp-2">
                          {playlist.descricao}
                        </p>
                      )}
                      <a
                        href={playlist.url_playlist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] sm:text-xs md:text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 w-fit"
                      >
                        Ver Playlist
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
