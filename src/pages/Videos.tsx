import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play } from "lucide-react";
import ReactPlayer from "react-player";

export default function Videos() {
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
      <section className="mb-6 sm:mb-8 md:mb-16">
        <Card className="shadow-medium">
          <CardContent className="p-0">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
              <ReactPlayer
                src="https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW"
                width="100%"
                height="100%"
                controls
                light
                playing={false}
              />
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                Título do Último Culto ou Mensagem
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4">
                Descrição do vídeo, incluindo o tema da mensagem, o pregador e
                pontos principais abordados.
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  1h 15min
                </span>
                <span className="hidden sm:inline">•</span>
                <span>10 de Dezembro, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Grid de Vídeos */}
      <section className="mb-6 sm:mb-8 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Vídeos Recentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  <ReactPlayer
                    src="https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW"
                    width="100%"
                    height="100%"
                    controls={false}
                    light
                    playing={false}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 line-clamp-2">
                    Título do Vídeo - Tema da Mensagem
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                    Breve descrição do conteúdo do vídeo e principais pontos
                    abordados.
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                    <span className="truncate mr-2">Pastor Nome</span>
                    <span className="whitespace-nowrap">5 dias atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Séries de Vídeos */}
      <section>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Séries e Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {[
            {
              nome: "Série: Fundamentos da Fé",
              descricao: "Descrição da série de vídeos e os temas abordados ao longo dos episódios.",
              link: "https://www.youtube.com/playlist?list=EXEMPLO1"
            },
            {
              nome: "Série: Família Abençoada",
              descricao: "Descrição da série de vídeos e os temas abordados ao longo dos episódios.",
              link: "https://www.youtube.com/playlist?list=EXEMPLO2"
            },
            {
              nome: "Testemunhos 2024",
              descricao: "Descrição da série de vídeos e os temas abordados ao longo dos episódios.",
              link: "https://www.youtube.com/playlist?list=EXEMPLO3"
            },
          ].map((serie, index) => (
            <Card
              key={serie.nome}
              className="shadow-soft hover:shadow-medium transition-all"
            >
              <CardContent className="p-0">
                <div className="flex sm:grid sm:grid-cols-3 gap-0">
                  <div className="w-20 sm:w-auto sm:col-span-1 bg-gradient-hero flex items-center justify-center p-3 sm:p-4 flex-shrink-0">
                    <div className="text-center text-primary-foreground">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                        {(index + 1) * 8}
                      </div>
                      <div className="text-[10px] sm:text-xs">vídeos</div>
                    </div>
                  </div>
                  <div className="flex-1 sm:col-span-2 p-3 sm:p-4 md:p-6 flex flex-col justify-center min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 truncate">{serie.nome}</h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3 md:mb-4 line-clamp-2">
                      {serie.descricao}
                    </p>
                    <a
                      href={serie.link}
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
    </div>
  );
}
