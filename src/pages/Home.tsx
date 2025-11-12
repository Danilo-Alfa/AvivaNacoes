import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Users, Heart, Book } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 animate-fade-in">
              Bem-vindo à Igreja Aviva
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-fade-in">
              Uma comunidade de fé, esperança e amor transformando vidas através da palavra de Deus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/quem-somos">
                <button className="px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-all hover:-translate-y-0.5 shadow-soft">
                  Conheça Nossa História
                </button>
              </Link>
              <Link to="/programacao">
                <button className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/20 transition-all hover:-translate-y-0.5 border-2 border-primary-foreground/20">
                  Ver Programação
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Próximo Culto */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <Card className="shadow-medium max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Próximo Culto</p>
                <p className="text-2xl font-bold">Domingo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Horários</p>
                <p className="text-2xl font-bold">09h e 19h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Local</p>
                <p className="text-2xl font-bold">Todas as Sedes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sobre Nós */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Uma Igreja que Transforma Vidas
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Somos uma comunidade de fé comprometida em levar o amor de Cristo a todas as pessoas. 
              Através da palavra, do louvor e da comunhão, buscamos fazer a diferença na vida de cada pessoa.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Cultos dinâmicos e relevantes",
                "Ministérios para todas as idades",
                "Projetos sociais que impactam vidas",
                "Comunidade acolhedora e familiar"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <Link to="/quem-somos">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                Saiba Mais
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
          <div className="aspect-video bg-gradient-accent rounded-lg shadow-medium flex items-center justify-center">
            <span className="text-2xl text-accent-foreground font-semibold">Vídeo/Imagem</span>
          </div>
        </div>
      </section>

      {/* Cards de Navegação */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Explore Nossa Igreja
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: "Eventos", desc: "Participe dos nossos eventos", link: "/eventos" },
              { icon: Users, title: "Nossas Igrejas", desc: "Encontre a sede mais próxima", link: "/nossas-igrejas" },
              { icon: Heart, title: "Projetos", desc: "Conheça nossos projetos sociais", link: "/projetos" },
              { icon: Book, title: "Jornal Aviva", desc: "Leia nossa publicação", link: "/jornal" }
            ].map((item) => (
              <Link key={item.title} to={item.link}>
                <Card className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Versículo do Dia */}
      <section className="container mx-auto px-4 py-20">
        <Card className="shadow-medium max-w-3xl mx-auto bg-gradient-hero text-primary-foreground">
          <CardContent className="p-12 text-center">
            <p className="text-sm font-semibold mb-4 text-primary-foreground/80">VERSÍCULO DO DIA</p>
            <blockquote className="text-2xl md:text-3xl font-serif mb-6 leading-relaxed">
              "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, 
              para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
            </blockquote>
            <p className="text-lg font-semibold text-primary-foreground/90">João 3:16</p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <Card className="shadow-medium bg-gradient-accent">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
              Faça Parte da Nossa Família
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
              Venha nos visitar e experimente uma comunidade que te acolhe com amor e verdade
            </p>
            <Link to="/fale-conosco">
              <button className="px-8 py-4 bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all hover:-translate-y-0.5 shadow-soft">
                Entre em Contato
              </button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
