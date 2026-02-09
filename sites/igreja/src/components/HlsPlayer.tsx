import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  url: string;
  autoPlay?: boolean;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export default function HlsPlayer({
  url,
  autoPlay = true,
  onReady,
  onError,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs para callbacks (evitar re-criação do hls)
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  // Pular para a borda ao vivo
  const seekToLive = useCallback(() => {
    const video = videoRef.current;
    const hls = hlsRef.current;
    if (!video) return;

    if (hls && hls.liveSyncPosition) {
      video.currentTime = hls.liveSyncPosition;
    } else if (video.buffered.length > 0) {
      video.currentTime = video.buffered.end(video.buffered.length - 1);
    }
  }, []);

  // Play/Pause com seek to live ao despausar
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      seekToLive();
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [seekToLive]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(() => {});
    }
  }, []);

  // Auto-hide controles
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!videoRef.current?.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  const initHls = useCallback(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);
    setLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferHole: 0.5,
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 10,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 10,
        fragLoadingRetryDelay: 1000,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        console.log("[HlsPlayer] Manifest parsed, stream pronto");
        onReadyRef.current?.();
        if (autoPlay) {
          video.play().catch((e) => {
            console.warn("[HlsPlayer] Autoplay bloqueado:", e.message);
            video.muted = true;
            setMuted(true);
            video.play().catch(() => {});
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("[HlsPlayer] Erro HLS:", data.type, data.details);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("[HlsPlayer] Erro de rede, tentando recuperar...");
              setTimeout(() => {
                if (hlsRef.current) hlsRef.current.startLoad();
              }, 2000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("[HlsPlayer] Erro de mídia, tentando recuperar...");
              hls.recoverMediaError();
              break;
            default:
              setError("Erro ao carregar a transmissão. Verifique se o stream está ativo.");
              setLoading(false);
              onErrorRef.current?.(data.details);
              hls.destroy();
              hlsRef.current = null;
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      const onMetadata = () => {
        setLoading(false);
        onReadyRef.current?.();
        if (autoPlay) {
          video.play().catch(() => {
            video.muted = true;
            setMuted(true);
            video.play().catch(() => {});
          });
        }
      };
      const onNativeError = () => {
        setError("Erro ao carregar a transmissão.");
        setLoading(false);
        onErrorRef.current?.("native-hls-error");
      };
      video.addEventListener("loadedmetadata", onMetadata);
      video.addEventListener("error", onNativeError);
      return () => {
        video.removeEventListener("loadedmetadata", onMetadata);
        video.removeEventListener("error", onNativeError);
      };
    } else {
      setError("Seu navegador não suporta reprodução de streams HLS.");
      setLoading(false);
      onErrorRef.current?.("hls-not-supported");
    }
  }, [url, autoPlay]);

  useEffect(() => {
    initHls();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initHls]);

  // Sincronizar estado de pausa
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    initHls();
  }, [initHls]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black select-none"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={togglePlay}
    >
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">Carregando transmissão...</span>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center p-6">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Video sem controles nativos */}
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
      />

      {/* Controles customizados (sem barra de tempo) */}
      {!loading && !error && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Esquerda: Play/Pause + Mute + Badge AO VIVO */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-white/80 transition-colors"
                aria-label={paused ? "Reproduzir" : "Pausar"}
              >
                {paused ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-white/80 transition-colors"
                aria-label={muted ? "Ativar som" : "Silenciar"}
              >
                {muted ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Badge AO VIVO */}
              <button
                onClick={() => {
                  seekToLive();
                  const video = videoRef.current;
                  if (video?.paused) {
                    video.play().catch(() => {});
                  }
                }}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2 py-1 rounded transition-colors"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                AO VIVO
              </button>
            </div>

            {/* Direita: Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Tela cheia"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Ícone grande de play quando pausado */}
      {paused && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
