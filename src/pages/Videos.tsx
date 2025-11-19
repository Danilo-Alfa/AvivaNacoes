import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play } from "lucide-react";
import ReactPlayer from "react-player";

export default function Videos() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="mb-8 md:mb-16 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Vídeos
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Assista às mensagens, testemunhos e momentos especiais da nossa igreja
        </p>
      </div>

      {/* Vídeo em Destaque */}
      <section className="mb-8 md:mb-16">
        <Card className="shadow-medium">
          <CardContent className="p-0">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <ReactPlayer
                src="https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW"
                width="100%"
                height="100%"
                controls
                light
                playing={false}
              />
            </div>
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Título do Último Culto ou Mensagem
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Descrição do vídeo, incluindo o tema da mensagem, o pregador e
                pontos principais abordados.
              </p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  1h 15min
                </span>
                <span className="hidden sm:inline">•</span>
                <span>10 de Dezembro, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Categorias de Vídeos */}
      <section className="mb-8 md:mb-16">
        <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {[
            "Todos",
            "Cultos",
            "Estudos",
            "Testemunhos",
            "Eventos",
            "Jovens",
            "Infantil",
          ].map((categoria) => (
            <button
              key={categoria}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap font-medium transition-colors ${
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
      <section className="mb-8 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Vídeos Recentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-black overflow-hidden">
                  <ReactPlayer
                    src="https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW"
                    width="100%"
                    height="100%"
                    controls={false}
                    light
                    playing={false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    Título do Vídeo - Tema da Mensagem
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    Breve descrição do conteúdo do vídeo e principais pontos
                    abordados.
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Séries e Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  <div className="w-24 sm:w-auto sm:col-span-1 bg-gradient-hero flex items-center justify-center p-4">
                    <div className="text-center text-primary-foreground">
                      <div className="text-2xl sm:text-3xl font-bold mb-1">
                        {(index + 1) * 8}
                      </div>
                      <div className="text-xs">vídeos</div>
                    </div>
                  </div>
                  <div className="flex-1 sm:col-span-2 p-4 md:p-6 flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{serie.nome}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
                      {serie.descricao}
                    </p>
                    <a
                      href={serie.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 w-fit"
                    >
                      Ver Playlist
                      <Play className="w-3 h-3 md:w-4 md:h-4" />
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
