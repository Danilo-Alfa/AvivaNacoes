import { useState } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
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
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  );
}
