import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RedesSociais() {
  const socialNetworks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "#",
      description: "Acompanhe nossas postagens diárias, eventos e transmissões ao vivo dos cultos.",
      followers: "10K+ seguidores",
      color: "from-blue-600 to-blue-400"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#",
      description: "Versículos inspiradores, stories dos eventos e momentos da nossa comunidade.",
      followers: "8K+ seguidores",
      color: "from-pink-600 via-purple-600 to-orange-500"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "#",
      description: "Assista aos cultos completos, pregações, louvores e testemunhos.",
      followers: "15K+ inscritos",
      color: "from-red-600 to-red-400"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "#",
      description: "Entre no nosso grupo para receber mensagens, avisos e oração.",
      followers: "Comunidade ativa",
      color: "from-green-600 to-green-400"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 pb-2">
              Nossas Redes Sociais
            </h1>
            <p className="text-lg text-muted-foreground">
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
              <Card key={network.name} className="group hover:shadow-xl transition-all duration-300 border-2">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${network.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <network.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">{network.name}</h3>
                  <p className="text-muted-foreground mb-4">{network.description}</p>
                  <p className="text-sm font-semibold text-primary mb-4">{network.followers}</p>
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
                <h3 className="font-bold mb-2 text-foreground">Versículos Diários</h3>
                <p className="text-sm text-muted-foreground">
                  Palavras de fé e esperança para o seu dia
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground">Transmissões Ao Vivo</h3>
                <p className="text-sm text-muted-foreground">
                  Cultos e eventos transmitidos em tempo real
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-bold mb-2 text-foreground">Eventos e Avisos</h3>
                <p className="text-sm text-muted-foreground">
                  Fique por dentro de tudo que acontece
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-hero p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4 text-foreground pb-2">
              Faça Parte da Nossa Comunidade
            </h2>
            <p className="text-muted-foreground mb-8">
              Não perca nenhuma novidade! Siga-nos em todas as redes sociais e 
              fortaleça sua fé junto conosco.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                Seguir Agora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
