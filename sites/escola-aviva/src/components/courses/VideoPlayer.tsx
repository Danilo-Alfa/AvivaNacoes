import { useState, useEffect, useRef, useCallback } from "react";
import { Play } from "lucide-react";

// Tipos para a YouTube IFrame API
interface YTPlayer {
  destroy: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  getPlayerState: () => number;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data?: number;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    rel?: number;
    modestbranding?: number;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
}

// Declaração global para a API do YouTube
declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onProgressUpdate?: (watchedPercentage: number) => void;
  requiredPercentage?: number; // Porcentagem mínima para considerar assistido (default: 80)
}

export function VideoPlayer({
  videoId,
  title,
  onProgressUpdate,
  requiredPercentage = 80
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedTime, setWatchedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(0);

  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Carregar a API do YouTube
  useEffect(() => {
    if (!isPlaying) return;

    // Se a API já está carregada
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Carregar o script da API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Callback quando a API estiver pronta
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, videoId]);

  const initializePlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          const player = event.target;
          const videoDuration = player.getDuration();
          setDuration(videoDuration);
        },
        onStateChange: (event) => {
          handleStateChange(event.data);
        },
      },
    });
  }, [videoId]);

  const handleStateChange = (state: number) => {
    // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (state === 1) {
      // Vídeo está tocando - iniciar rastreamento
      startTracking();
    } else {
      // Vídeo pausado/parado - parar rastreamento
      stopTracking();
    }
  };

  const startTracking = () => {
    if (intervalRef.current) return;

    lastTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;

      const now = Date.now();
      const elapsed = (now - lastTimeRef.current) / 1000;

      // Só conta o tempo se o usuário não pulou mais de 2 segundos
      if (elapsed < 3) {
        setWatchedTime(prev => prev + elapsed);
      }

      lastTimeRef.current = now;
    }, 1000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Calcular e reportar progresso
  useEffect(() => {
    if (duration > 0) {
      const percentage = Math.min((watchedTime / duration) * 100, 100);
      setCurrentPercentage(percentage);
      onProgressUpdate?.(percentage);
    }
  }, [watchedTime, duration, onProgressUpdate]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      stopTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Reset quando o videoId mudar
  useEffect(() => {
    setWatchedTime(0);
    setDuration(0);
    setCurrentPercentage(0);
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  }, [videoId]);

  const isComplete = currentPercentage >= requiredPercentage;

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-medium bg-foreground/5">
        {!isPlaying ? (
          <button
            type="button"
            className="absolute inset-0 cursor-pointer group w-full h-full border-0 p-0 bg-transparent"
            onClick={() => setIsPlaying(true)}
            aria-label={`Reproduzir vídeo: ${title}`}
          >
            {/* Thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 gradient-hero rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-glow">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground ml-1" aria-hidden="true" />
              </div>
            </div>
          </button>
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* Barra de progresso de visualização */}
      {isPlaying && duration > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso de visualização</span>
            <span className={isComplete ? "text-green-600 font-medium" : ""}>
              {Math.round(currentPercentage)}% {isComplete && "✓ Completo"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(currentPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Assista pelo menos {requiredPercentage}% do vídeo para desbloquear a conclusão
          </p>
        </div>
      )}
    </div>
  );
}
