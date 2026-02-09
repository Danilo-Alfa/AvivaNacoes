import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
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
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
        // Retry configs para streams instáveis
        manifestLoadingMaxRetry: 6,
        levelLoadingMaxRetry: 6,
        fragLoadingMaxRetry: 6,
      });

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        console.log("[HlsPlayer] Manifest parsed, stream pronto");
        onReady?.();
        if (autoPlay) {
          video.play().catch((e) => {
            console.warn("[HlsPlayer] Autoplay bloqueado:", e.message);
            // Tenta com muted (autoplay policy)
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
              hls.startLoad();
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
              onError?.(data.details);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari suporta HLS nativamente
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        console.log("[HlsPlayer] Safari: metadata carregada");
        onReady?.();
        if (autoPlay) {
          video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      });
      video.addEventListener("error", () => {
        setError("Erro ao carregar a transmissão.");
        setLoading(false);
        onError?.("native-hls-error");
      });
    } else {
      setError("Seu navegador não suporta reprodução de streams HLS.");
      setLoading(false);
      onError?.("hls-not-supported");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, autoPlay, onReady, onError]);

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
              onClick={() => {
                setError(null);
                setLoading(true);
                // Re-trigger useEffect mudando nada (forçar reload)
                if (hlsRef.current) {
                  hlsRef.current.destroy();
                  hlsRef.current = null;
                }
                const video = videoRef.current;
                if (video && url) {
                  if (Hls.isSupported()) {
                    const hls = new Hls({
                      enableWorker: true,
                      lowLatencyMode: true,
                    });
                    hlsRef.current = hls;
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                      setLoading(false);
                      setError(null);
                      video.play().catch(() => {
                        video.muted = true;
                        video.play().catch(() => {});
                      });
                    });
                    hls.on(Hls.Events.ERROR, (_event, data) => {
                      if (data.fatal) {
                        setError("Erro ao carregar a transmissão.");
                        setLoading(false);
                      }
                    });
                  }
                }
              }}
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
