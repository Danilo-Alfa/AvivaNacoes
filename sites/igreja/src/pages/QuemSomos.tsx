import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface PastorData {
  nome: string;
  cargo: string;
  foto: string;
  descricao: string;
}

function PastorCard({ pastor }: { pastor: PastorData }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative h-[400px] cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
      onMouseEnter={() => {
        // Só ativa hover em telas maiores (não touch)
        if (window.matchMedia('(hover: hover)').matches) {
          setIsFlipped(true);
        }
      }}
      onMouseLeave={() => {
        if (window.matchMedia('(hover: hover)').matches) {
          setIsFlipped(false);
        }
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente do Card - Foto */}
        <Card
          className="absolute inset-0 shadow-soft hover:shadow-medium transition-shadow overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardContent className="p-0 h-full">
            <div className="relative h-full bg-gradient-hero">
              {/* Imagem do pastor (se existir e carregar) */}
              {pastor.foto && (
                <img
                  src={pastor.foto}
                  alt={pastor.nome}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              {/* Placeholder "Foto" no centro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl text-primary-foreground font-bold">
                  Foto
                </span>
              </div>
              {/* Overlay com nome na parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
                <h3 className="text-xl font-bold text-white">{pastor.nome}</h3>
                <p className="text-sm text-white/80 font-medium">
                  {pastor.cargo}
                </p>
              </div>
              {/* Indicador de flip no mobile */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 md:opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verso do Card - Descrição */}
        <Card
          className="absolute inset-0 shadow-soft hover:shadow-medium transition-shadow bg-gradient-to-br from-primary/10 to-accent/10"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">
                  {pastor.nome.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1 text-foreground">{pastor.nome}</h3>
              <p className="text-sm text-accent font-medium mb-4">
                {pastor.cargo}
              </p>
              <div className="w-12 h-1 bg-gradient-hero mx-auto mb-4 rounded-full" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pastor.descricao}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dados dos pastores
const pastores: PastorData[] = [
  {
    nome: "Pastor Nome",
    cargo: "Pastor Presidente",
    foto: "/images/pastor1.jpg", // Substitua pelo caminho real da imagem
    descricao: "Breve biografia do pastor. Sua história de fé, chamado ministerial e visão para a igreja. Compartilhe aqui informações relevantes sobre sua trajetória.",
  },
  {
    nome: "Pastora Nome",
    cargo: "Pastora",
    foto: "/images/pastor2.jpg", // Substitua pelo caminho real da imagem
    descricao: "Breve biografia da pastora. Sua história de fé, chamado ministerial e atuação nos ministérios da igreja. Compartilhe aqui informações relevantes sobre sua trajetória.",
  },
];

export default function QuemSomos() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Quem Somos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conheça nossa história, missão e a equipe que lidera nossa igreja
        </p>
      </div>

      {/* Nossa História */}
      <section className="mb-16">
        <Card className="shadow-medium">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Nossa História
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                [Aqui você pode adicionar a história de como a igreja surgiu, os
                marcos importantes, e a jornada de fé que trouxe a igreja até
                hoje]
              </p>
              <p>
                [Continue contando a história da igreja, mencionando momentos
                significativos e o crescimento ao longo dos anos]
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Nossa Missão e Visão */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Nossa Missão
              </h2>
              <p className="text-muted-foreground">
                [Descreva a missão da igreja - o propósito e objetivo principal
                da comunidade de fé]
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-accent">
                Nossa Visão
              </h2>
              <p className="text-muted-foreground">
                [Descreva a visão da igreja - aonde vocês querem chegar e o
                impacto que desejam causar]
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              className="shadow-soft hover:shadow-medium transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-foreground">
                    {item}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Valor {item}</h3>
                <p className="text-muted-foreground">
                  [Descreva cada valor fundamental da igreja]
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Liderança/Pastores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nossa Liderança</h2>
        <div className="grid md:grid-cols-2 gap-8 md:px-32">
          {pastores.map((pastor, index) => (
            <PastorCard key={index} pastor={pastor} />
          ))}
        </div>
      </section>

      {/* Ministérios */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossos Ministérios
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { nome: "Infantil", emoji: "🧒", descricao: "\"Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.\" — Provérbios 22:6" },
            { nome: "Jovens", emoji: "✨", descricao: "\"Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, na caridade, no espírito, na fé, na pureza.\" — 1 Timóteo 4:12" },
            { nome: "Intercessão", emoji: "🙏", descricao: "\"Orai sem cessar.\" — 1 Tessalonicenses 5:17" },
          ].map((ministerio) => (
            <Card
              key={ministerio.nome}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">{ministerio.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{ministerio.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {ministerio.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Associação */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossa Associação
        </h2>
        <div className="max-w-md mx-auto">
          <Card className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Associação Beneficente</h3>
              <p className="text-sm text-muted-foreground">
                "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." — 2 Coríntios 9:7
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Grupos */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossos Grupos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { nome: "Ebenézer", emoji: "🪨" },
            { nome: "Revive", emoji: "🔥" },
            { nome: "Rosas de Saron", emoji: "🌹" },
            { nome: "Levitas", emoji: "🛐" },
            { nome: "Emunah", emoji: "🕯️" },
          ].map((grupo) => (
            <Card
              key={grupo.nome}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">{grupo.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{grupo.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  [Descrição do grupo]
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
