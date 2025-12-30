import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users2Icon,
  BookOpen,
  Calendar,
  Heart,
  Users,
} from "lucide-react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { versiculoService } from "@/services/versiculoService";
import { Versiculo } from "@/lib/supabase";

const cultos = [
  {
    dia: 0,
    nome: "Domingo",
    horario: "19:00",
    horaNum: 19,
    minutoNum: 0,
    local: "Igreja Sede e Online",
  },
  {
    dia: 1,
    nome: "Segunda",
    horario: "19:30",
    horaNum: 19,
    minutoNum: 30,
    local: "Igreja Sede e Online",
  },
  {
    dia: 2,
    nome: "Terça",
    horario: "20:00",
    horaNum: 20,
    minutoNum: 0,
    local: "Online",
  },
  {
    dia: 3,
    nome: "Quarta",
    horario: "19:45",
    horaNum: 19,
    minutoNum: 45,
    local: "Igreja Sede e Online",
  },
  {
    dia: 4,
    nome: "Quinta",
    horario: "20:00",
    horaNum: 20,
    minutoNum: 0,
    local: "Online",
  },
  {
    dia: 5,
    nome: "Sexta",
    horario: "20:00",
    horaNum: 20,
    minutoNum: 0,
    local: "Igreja Sede e Online",
  },
  {
    dia: 6,
    nome: "Sábado",
    horario: "20:00",
    horaNum: 20,
    minutoNum: 0,
    local: "Igreja Sede e Online",
  },
];

const getProximoCulto = () => {
  const agora = new Date();
  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();

  // Verifica se o culto de hoje ainda não começou
  const cultoHoje = cultos[diaAtual];
  if (
    horaAtual < cultoHoje.horaNum ||
    (horaAtual === cultoHoje.horaNum && minutoAtual < cultoHoje.minutoNum)
  ) {
    return { ...cultoHoje, nome: "Hoje" };
  }

  // Se o culto de hoje já passou, pega o próximo dia
  const proximoDia = (diaAtual + 1) % 7;
  return cultos[proximoDia];
};

export default function Home() {
  const [versiculoDoDia, setVersiculoDoDia] = useState<Versiculo | null>(null);
  const [loadingVersiculo, setLoadingVersiculo] = useState(true);
  const [proximoCulto, setProximoCulto] = useState(getProximoCulto());

  useEffect(() => {
    carregarVersiculoDoDia();

    // Atualiza o próximo culto a cada minuto
    const interval = setInterval(() => {
      setProximoCulto(getProximoCulto());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const carregarVersiculoDoDia = async () => {
    setLoadingVersiculo(true);
    const versiculo = await versiculoService.getVersiculoDoDia();
    setVersiculoDoDia(versiculo);
    setLoadingVersiculo(false);
  };

  const getTituloVersiculo = (versiculo: Versiculo) => {
    if (versiculo.titulo) return versiculo.titulo;
    const dataObj = new Date(versiculo.data + "T00:00:00");
    const dia = dataObj.getDate();
    const mes = dataObj.toLocaleDateString("pt-BR", { month: "long" });
    return `Versículo do dia ${dia} de ${mes}`;
  };
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative text-primary-foreground py-24 md:py-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/AvivaNacoes/hero-bg.jpg')" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 animate-fade-in">
              Bem-vindo à Aviva Nações
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-fade-in">
              Uma comunidade de fé, esperança e amor transformando vidas através
              da palavra de Deus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/quem-somos">
                <button className="px-8 py-4 bg-blue-900/80 text-white font-semibold rounded-lg hover:bg-blue-900/90 transition-all hover:-translate-y-0.5 shadow-lg backdrop-blur-sm">
                  Conheça Nossa História
                </button>
              </Link>
              <Link to="/programacao">
                <button className="px-8 py-4 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all hover:-translate-y-0.5 border-2 border-white/30 backdrop-blur-sm">
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
                <p className="text-sm text-muted-foreground mb-1">
                  Próximo Culto
                </p>
                <p className="text-2xl font-bold">{proximoCulto.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Horário</p>
                <p className="text-2xl font-bold">{proximoCulto.horario}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Local</p>
                <p className="text-2xl font-bold">{proximoCulto.local}</p>
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
              Somos uma comunidade de fé comprometida em levar o amor de Cristo
              a todas as pessoas. Através da palavra, do louvor e da comunhão,
              buscamos fazer a diferença na vida de cada pessoa.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Cultos dinâmicos e relevantes",
                "Ministérios para todas as idades",
                "Projetos sociais que impactam vidas",
                "Comunidade acolhedora e familiar",
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
          <div className="aspect-video bg-black rounded-lg shadow-medium overflow-hidden">
            <ReactPlayer
              src="https://youtu.be/Nz-EPSwe5as?si=Kwl7A51XJoqx2mcW"
              width="100%"
              height="100%"
              controls
              light
              playing={false}
            />
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
              {
                icon: Users2Icon,
                title: "Quem somos",
                desc: "Venha nos conhecer",
                link: "/quem-somos",
              },
              {
                icon: Calendar,
                title: "Eventos",
                desc: "Participe dos nossos eventos",
                link: "/eventos",
              },
              {
                icon: Users,
                title: "Nossas Igrejas",
                desc: "Encontre a sede mais próxima",
                link: "/nossas-igrejas",
              },
              {
                icon: Heart,
                title: "Projetos",
                desc: "Conheça nossos projetos sociais",
                link: "/projetos",
              },
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
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Versículo do Dia
          </h2>
        </div>

        {loadingVersiculo ? (
          <Card className="shadow-medium max-w-xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </CardContent>
          </Card>
        ) : versiculoDoDia ? (
          <div className="max-w-xl mx-auto">
            {versiculoDoDia.url_imagem ? (
              <Link to="/versiculo-do-dia" className="block">
                <Card className="shadow-medium hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={versiculoDoDia.url_imagem}
                      alt={versiculoDoDia.titulo || "Versículo do dia"}
                      className="w-full"
                    />
                    <div className="p-4 text-center">
                      <p className="font-semibold text-primary mb-2">
                        {getTituloVersiculo(versiculoDoDia)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Clique para ver mais versículos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="shadow-medium max-w-xl mx-auto bg-gradient-hero text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-4 text-primary-foreground">
                    {getTituloVersiculo(versiculoDoDia)}
                  </h3>
                  <p className="text-primary-foreground/90 mb-6">
                    Venha conferir a mensagem do dia
                  </p>
                  <Link to="/versiculo-do-dia">
                    <button className="px-6 py-3 bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all hover:-translate-y-0.5">
                      Ver Mensagem Completa
                    </button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="shadow-medium max-w-xl mx-auto bg-gradient-hero text-primary-foreground">
            <CardContent className="p-12 text-center">
              <p className="text-lg text-primary-foreground/90 mb-6">
                Em breve teremos uma nova mensagem para você!
              </p>
              <Link to="/versiculo-do-dia">
                <button className="px-6 py-3 bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all">
                  Ver Versículos Anteriores
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <Card className="shadow-medium bg-gradient-accent">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
              Faça Parte da Nossa Família
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
              Venha nos visitar e experimente uma comunidade que te acolhe com
              amor e verdade
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
