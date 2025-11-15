import { Card, CardContent } from "@/components/ui/card";
import {
  Facebook,
  Heart,
  Instagram,
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
      description:
        "Acompanhe nossas postagens diárias, eventos e transmissões ao vivo dos cultos.",
      followers: "Seguidores ativos",
      color: "from-blue-600 to-blue-400",
      bgColor: "bg-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/igrejaavivanacoes/",
      description:
        "Versículos inspiradores, stories dos eventos e momentos da nossa comunidade.",
      followers: "Comunidade engajada",
      color: "from-pink-600 via-purple-600 to-orange-500",
      bgColor: "bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500",
    },
    {
      name: "Canal Aviva Nações",
      icon: Youtube,
      url: "https://www.youtube.com/@TvAvivaNacoes",
      description:
        "Assista aos cultos completos, pregações, louvores e testemunhos.",
      followers: "Inscritos no canal",
      color: "from-red-600 to-red-400",
      bgColor: "bg-red-600",
    },
    {
      name: "WebRádio",
      icon: Radio,
      url: "https://app.mobileradio.com.br/WebRadioAvivaNacoes",
      description:
        "Ouça nossa programação 24 horas com louvores, pregações e conteúdo edificante.",
      followers: "Ouvintes online",
      color: "from-gray-700 to-gray-500",
      bgColor: "bg-gray-700",
    },
    {
      name: "Associação Benificiente EL Roi",
      icon: Heart,
      url: "https://www.facebook.com/share/194jRRsrGp/",
      description:
        "Conheça nossos projetos sociais e ações de amor ao próximo na comunidade.",
      followers: "Vidas impactadas",
      color: "from-pink-500 to-pink-300",
      bgColor: "bg-pink-500",
    },
    {
      name: "Jornal Aviva News",
      icon: Newspaper,
      url: "https://portaldojoan.my.canva.site/",
      description:
        "Notícias, artigos e conteúdo informativo sobre fé, família e sociedade.",
      followers: "Leitores",
      color: "from-blue-500 to-blue-300",
      bgColor: "bg-blue-500",
    },
    {
      name: "Aviva Jovens",
      icon: Users,
      url: "https://www.instagram.com/_aviva.jovens",
      description:
        "Ministério voltado para jovens com eventos, encontros e conteúdo relevante.",
      followers: "Jovens conectados",
      color: "from-purple-600 to-purple-400",
      bgColor: "bg-purple-600",
    },
    {
      name: "SPOTIFY",
      icon: Music,
      url: "https://open.spotify.com/show/6UxigeE1ZivVsJxRdVokSJ",
      description:
        "Ouça nossas playlists, pregações e louvores na maior plataforma de streaming.",
      followers: "Ouvintes mensais",
      color: "from-green-500 to-green-400",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 pb-2">
              Nossas Redes Sociais
            </h1>
            <p className="text-lg text-slate-300">
              Conecte-se conosco e faça parte da nossa comunidade digital.
              Acompanhe conteúdos inspiradores, eventos e muito mais!
            </p>
          </div>
        </div>
      </section>

      {/* Social Networks Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {socialNetworks.map((network) => (
              <Card
                key={network.name}
                className="group hover:shadow-xl transition-all duration-300 border-2"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${network.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <network.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    {network.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {network.description}
                  </p>
                  <p className="text-sm font-semibold text-primary mb-4">
                    {network.followers}
                  </p>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Seguir
                  </a>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground pb-2">
              O Que Você Encontra
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground">
                  Versículos Diários
                </h3>
                <p className="text-sm text-muted-foreground">
                  Palavras de fé e esperança para o seu dia
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
