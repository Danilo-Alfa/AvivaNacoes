import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  MessageCircle,
  Music,
  Newspaper,
  Radio,
  Users,
  Youtube,
} from "lucide-react";

export default function RedesSociais() {
  const socialNetworks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://web.facebook.com/igrejaevangelicaaviva/",
      handle: "@igrejaevangelicaaviva",
      description:
        "Acompanhe nossas postagens diárias, eventos e transmissões ao vivo dos cultos.",
      followers: "Seguidores ativos",
      bgColor: "bg-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/igrejaavivanacoes/",
      handle: "@igrejaavivanacoes",
      description:
        "Versículos inspiradores, stories dos eventos e momentos da nossa comunidade.",
      followers: "Comunidade engajada",
      bgColor: "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400",
    },
    {
      name: "Canal Avivamento para as Nações",
      icon: Youtube,
      url: "https://www.youtube.com/@TvAvivaNacoes",
      handle: "@TvAvivaNacoes",
      description:
        "Assista aos cultos completos, pregações, louvores e testemunhos.",
      followers: "Inscritos no canal",
      bgColor: "bg-red-600",
    },
    {
      name: "WebRádio",
      icon: Radio,
      url: "https://app.mobileradio.com.br/WebRadioAvivaNacoes",
      description:
        "Ouça nossa programação 24 horas com louvores, pregações e conteúdo edificante.",
      followers: "Ouvintes online",
      bgColor: "bg-purple-600",
    },
    {
      name: "Associação Benificiente EL Roi",
      icon: Heart,
      url: "https://www.facebook.com/share/194jRRsrGp/",
      description:
        "Conheça nossos projetos sociais e ações de amor ao próximo na comunidade.",
      followers: "Vidas impactadas",
      bgColor: "bg-pink-500",
    },
    {
      name: "Jornal Aviva News",
      icon: Newspaper,
      url: "https://portaldojoan.my.canva.site/",
      description:
        "Notícias, artigos e conteúdo informativo sobre fé, família e sociedade.",
      followers: "Leitores",
      bgColor: "bg-blue-500",
    },
    {
      name: "Aviva Jovens",
      icon: Users,
      url: "https://www.instagram.com/_aviva.jovens",
      handle: "@_aviva.jovens",
      description:
        "Ministério voltado para jovens com eventos, encontros e conteúdo relevante.",
      followers: "Jovens conectados",
      bgColor: "bg-purple-600",
    },
    {
      name: "Spotify",
      icon: Music,
      url: "https://open.spotify.com/show/6UxigeE1ZivVsJxRdVokSJ",
      description:
        "Ouça nossas playlists, pregações e louvores na maior plataforma de streaming.",
      followers: "Ouvintes mensais",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Círculo grande esquerda */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-sm" />
          {/* Círculo grande direita */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-400/10 rounded-full" />
          {/* Estrelas/pontos decorativos */}
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-20 left-1/3 w-1.5 h-1.5 bg-white/30 rounded-full" />
          <div className="absolute top-16 right-1/4 w-1 h-1 bg-white/50 rounded-full" />
          <div className="absolute top-32 right-1/3 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute bottom-20 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />
          <div className="absolute top-1/3 left-[15%] w-1 h-1 bg-white/50 rounded-full" />
          <div className="absolute top-1/2 right-[20%] w-1 h-1 bg-white/40 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Ícones decorativos no topo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Heart className="w-5 h-5 text-white/80" aria-hidden="true" />
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Users className="w-5 h-5 text-white/80" aria-hidden="true" />
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <MessageCircle className="w-5 h-5 text-white/80" aria-hidden="true" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nossas Redes Sociais
            </h1>
            <p className="text-lg text-blue-100/80">
              Conecte-se conosco e faça parte da nossa comunidade digital.
              <br />
              Acompanhe conteúdos inspiradores, eventos e muito mais!
            </p>

            {/* Linha decorativa */}
            <div className="mt-8 flex justify-center">
              <div className="w-20 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Networks Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {socialNetworks.map((network) => (
              <Card
                key={network.name}
                className="group hover:shadow-lg transition-all duration-300 border border-border/50"
              >
                <CardContent className="p-6">
                  {/* Ícone quadrado arredondado */}
                  <div
                    className={`w-12 h-12 ${network.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md`}
                  >
                    <network.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>

                  {/* Nome */}
                  <h2 className="text-xl font-bold text-foreground">
                    {network.name}
                  </h2>

                  {/* Handle/Arroba */}
                  {network.handle && (
                    <p className="text-sm text-primary font-medium mb-2">
                      {network.handle}
                    </p>
                  )}

                  {/* Descrição */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {network.description}
                  </p>

                  {/* Badge de seguidores */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-xs font-medium text-primary">
                      {network.followers}
                    </span>
                  </div>

                  {/* Botão Seguir */}
                  <div>
                    <a
                      href={network.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Seguir
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Post Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground" id="what-we-post">
              O Que Você Encontra
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground" aria-describedby="what-we-post">
                  Versículos Diários
                </h3>
                <p className="text-sm text-muted-foreground">
                  Palavras de fé e esperança para o seu dia
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground">
                  Transmissões Ao Vivo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cultos e eventos transmitidos em tempo real
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground">
                  Eventos e Avisos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fique por dentro de tudo que acontece
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
