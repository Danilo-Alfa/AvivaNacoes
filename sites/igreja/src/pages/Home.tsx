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
      {/* Hero Section - Banner */}
      <section className="relative min-h-[275px] md:min-h-[600px] overflow-hidden">
        <img
          src="/AvivaNacoes/hero-bg.jpg"
          alt="Igreja Aviva Nações"
          width={1920}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[60%_top] md:object-center"
        />
      </section>

      {/* Botões - metade sobre o banner, metade abaixo */}
      <div className="container mx-auto px-4 -mt-4 md:-mt-5 relative z-10">
        <div className="flex flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
          <Link to="/quem-somos" className="flex-1">
            <button className="w-full px-4 py-4 md:px-8 md:py-4 min-h-[48px] text-sm md:text-base bg-background text-foreground font-semibold rounded-lg hover:bg-muted transition-all border-2 border-border shadow-lg">
              Nossa História
            </button>
          </Link>
          <Link to="/programacao" className="flex-1">
            <button className="w-full px-4 py-4 md:px-8 md:py-4 min-h-[48px] text-sm md:text-base bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg">
              Programação
            </button>
          </Link>
        </div>
      </div>

      {/* Espaçamento após os botões */}
      <div className="h-6 md:h-8"></div>

      {/* Próximo Culto */}
      <section className="container mx-auto px-4 pt-2 md:pt-0 md:-mt-4 relative z-10">
        <Card className="shadow-medium max-w-4xl mx-auto">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-row justify-around md:grid md:grid-cols-3 md:gap-6 text-center">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">
                  Próximo Culto
                </p>
                <p className="text-lg md:text-2xl font-bold">{proximoCulto.nome}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Horário</p>
                <p className="text-lg md:text-2xl font-bold">{proximoCulto.horario}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Local</p>
                <p className="text-lg md:text-2xl font-bold">{proximoCulto.local}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sobre Nós */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Uma Igreja que Transforma Vidas
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              Somos uma comunidade de fé comprometida em levar o amor de Cristo
              a todas as pessoas. Através da palavra, do louvor e da comunhão,
              buscamos fazer a diferença na vida de cada pessoa.
            </p>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
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
              <button className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                Saiba Mais
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
            Explore Nossa Igreja
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">{item.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Versículo do Dia */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden="true" />
          <h2 className="text-xl md:text-3xl font-bold text-center">
            Versículo do Dia
          </h2>
        </div>

        {loadingVersiculo ? (
          <Card className="shadow-medium max-w-xl mx-auto">
            <CardContent className="p-0">
              {/* Skeleton com tamanho similar à imagem do versículo */}
              <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4 text-center space-y-2">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              </div>
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
                      width={576}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto"
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
                    <button className="px-6 py-3 min-h-[48px] bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all hover:-translate-y-0.5">
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
                <button className="px-6 py-3 min-h-[48px] bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all">
                  Ver Versículos Anteriores
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <Card className="shadow-medium bg-gradient-accent">
          <CardContent className="p-6 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-accent-foreground">
              Faça Parte da Nossa Família
            </h2>
            <p className="text-base md:text-lg text-accent-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto">
              Venha nos visitar e experimente uma comunidade que te acolhe com
              amor e verdade
            </p>
            <Link to="/fale-conosco">
              <button className="px-6 py-3 md:px-8 md:py-4 min-h-[48px] text-sm md:text-base bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-all hover:-translate-y-0.5 shadow-soft">
                Entre em Contato
              </button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
