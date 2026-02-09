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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Usar refs para callbacks para evitar re-criação do hls quando pai re-renderiza
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  const initHls = useCallback(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    // Limpar instância anterior
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
        // Live: manter sincronizado perto do "ao vivo"
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: true,
        // Buffer
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferHole: 0.5,
        // Retry para streams instáveis
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
              // Para live, tentar recarregar o source
              setTimeout(() => {
                if (hlsRef.current) {
                  hlsRef.current.startLoad();
                }
              }, 2000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("[HlsPlayer] Erro de mídia, tentando recuperar...");
              hls.recoverMediaError();
              break;
            default:
              console.error("[HlsPlayer] Erro fatal irrecuperável");
              setError(
                "Erro ao carregar a transmissão. Verifique se o stream está ativo."
              );
              setLoading(false);
              onErrorRef.current?.(data.details);
              hls.destroy();
              hlsRef.current = null;
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari suporta HLS nativamente
      video.src = url;

      const onMetadata = () => {
        setLoading(false);
        console.log("[HlsPlayer] Safari: metadata carregada");
        onReadyRef.current?.();
        if (autoPlay) {
          video.play().catch(() => {
            video.muted = true;
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

  // Inicializar HLS — só depende de url e autoPlay, NÃO dos callbacks
  useEffect(() => {
    initHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initHls]);

  const handleRetry = useCallback(() => {
    setError(null);
    initHls();
  }, [initHls]);

  return (
    <div className="relative w-full h-full bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">Carregando transmissão...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center p-6">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-200 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        controlsList="nodownload"
      />
    </div>
  );
}
