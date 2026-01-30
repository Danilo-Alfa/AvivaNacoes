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

// Extrai o ID do vídeo do YouTube de uma URL
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Gera a URL do thumbnail do YouTube
const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
};

export default function Videos() {
  const [videoDestaque, setVideoDestaque] = useState<Video | null>(null);
  const [videosRecentes, setVideosRecentes] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  // Pré-carrega o thumbnail do vídeo em destaque para melhorar o LCP
  useEffect(() => {
    if (videoDestaque) {
      const thumbnailUrl = videoDestaque.thumbnail_url || getYouTubeThumbnail(videoDestaque.url_video);
      if (thumbnailUrl) {
        // Remove preload anterior se existir
        const existingPreload = document.querySelector('link[data-video-preload]');
        if (existingPreload) {
          existingPreload.remove();
        }

        // Adiciona novo preload
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = thumbnailUrl;
        link.setAttribute('data-video-preload', 'true');
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);

        return () => {
          link.remove();
        };
      }
    }
  }, [videoDestaque]);

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

  // Skeleton components
  const VideoCardSkeleton = () => (
    <div className="bg-card rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );

  const FeaturedVideoSkeleton = () => (
    <div className="bg-card rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-3 sm:p-4 md:p-6 space-y-3">
        <div className="h-7 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );

  const PlaylistSkeleton = () => (
    <div className="bg-card rounded-lg shadow overflow-hidden h-full">
      <div className="flex h-full">
        <div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
        <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-3">
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 min-h-[calc(100vh-200px)]">
        {/* Hero Section Skeleton */}
        <div className="mb-6 sm:mb-8 md:mb-16 text-center">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-3" />
          <div className="h-5 w-80 max-w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
        </div>

        {/* Featured Video Skeleton */}
        <section className="mb-6 sm:mb-8 md:mb-16">
          <FeaturedVideoSkeleton />
        </section>

        {/* Video Grid Skeleton */}
        <section className="mb-6 sm:mb-8 md:mb-16">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 sm:mb-6 md:mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
            <VideoCardSkeleton />
          </div>
        </section>

        {/* Playlist Skeleton */}
        <section>
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 sm:mb-6 md:mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <PlaylistSkeleton />
            <PlaylistSkeleton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 min-h-[calc(100vh-200px)]">
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
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" aria-hidden="true" />
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
                      controls
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
              <a
                key={playlist.id}
                href={playlist.url_playlist}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                  <CardContent className="p-0 h-full">
                    <div className="flex h-full">
                      <div className="w-24 sm:w-32 bg-gradient-hero flex items-center justify-center p-4 flex-shrink-0 transition-all duration-300 group-hover:w-28 sm:group-hover:w-36">
                        <div className="text-center text-primary-foreground">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 transition-transform duration-300 group-hover:scale-110">
                            {playlist.quantidade_videos}
                          </div>
                          <div className="text-[10px] sm:text-xs opacity-90">vídeos</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-center min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 truncate group-hover:text-primary transition-colors duration-300">
                          {playlist.nome}
                        </h3>
                        {playlist.descricao && (
                          <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                            {playlist.descricao}
                          </p>
                        )}
                        <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-primary flex items-center gap-1 w-fit transition-all duration-300 group-hover:gap-2">
                          Ver Playlist
                          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
