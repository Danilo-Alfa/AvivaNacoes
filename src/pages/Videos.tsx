import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock } from "lucide-react";

export default function Videos() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Vídeos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Assista às mensagens, testemunhos e momentos especiais da nossa igreja
        </p>
      </div>

      {/* Vídeo em Destaque */}
      <section className="mb-16">
        <Card className="shadow-medium overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gradient-hero flex items-center justify-center cursor-pointer group relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-accent-foreground ml-1" fill="currentColor" />
                </div>
                <p className="mt-4 text-primary-foreground font-semibold">Vídeo em Destaque</p>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Título do Último Culto ou Mensagem</h2>
              <p className="text-muted-foreground mb-4">
                Descrição do vídeo, incluindo o tema da mensagem, o pregador e pontos principais abordados.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  1h 15min
                </span>
                <span>•</span>
                <span>10 de Dezembro, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Categorias de Vídeos */}
      <section className="mb-16">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {["Todos", "Cultos", "Estudos", "Testemunhos", "Eventos", "Jovens", "Infantil"].map((categoria) => (
            <button
              key={categoria}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                categoria === "Todos"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Vídeos */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Vídeos Recentes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card 
              key={index} 
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative z-10 w-14 h-14 bg-accent/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-accent-foreground ml-0.5" fill="currentColor" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    45:30
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    Título do Vídeo - Tema da Mensagem
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    Breve descrição do conteúdo do vídeo e principais pontos abordados.
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Pastor Nome</span>
                    <span>5 dias atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Séries de Vídeos */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Séries e Playlists</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {["Série: Fundamentos da Fé", "Série: Família Abençoada", "Testemunhos 2024"].map((serie, index) => (
            <Card key={serie} className="shadow-soft hover:shadow-medium transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-0">
                  <div className="col-span-1 bg-gradient-hero flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <div className="text-3xl font-bold mb-1">{(index + 1) * 8}</div>
                      <div className="text-xs">vídeos</div>
                    </div>
                  </div>
                  <div className="col-span-2 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-2">{serie}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Descrição da série de vídeos e os temas abordados ao longo dos episódios.
                    </p>
                    <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                      Ver Playlist
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
