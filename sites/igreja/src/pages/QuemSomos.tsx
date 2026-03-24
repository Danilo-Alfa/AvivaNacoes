import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

// Logos dos grupos e ministérios (em public/logos/)
const logoABER = "/logos/ABER (1).png";
const logoWebRadio = "/logos/webradio (1).png";
const logoAvivaJovens = "/logos/avivajovens (1).png";
const logoResgatandoCriancas = "/logos/resgatando (1).png";
const logoTVAvivaNacoes = "/logos/tvaviva (1).png";
const logoJOAN = "/logos/joan (1).png";

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
                  className="absolute inset-0 w-full h-full object-cover object-[center_25%] z-10"
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
    nome: "Rowilson Oliveira",
    cargo: "Apóstolo",
    foto: "/pastores/Apostolo.jpeg",
    descricao: "São mais de 40 anos seguindo uma vida de entrega, visão espiritual e compromisso com o Reino. Ao longo de sua trajetória, tem impactado gerações com sua fé inabalável, liderança inspiradora e coração pastoral. Também é o principal levita do ministério, andando junto com as ovelhas e carregando o que for necessário para a obra crescer.",
  },
  {
    nome: "Cristiane de Oliveira",
    cargo: "Apóstola",
    foto: "/pastores/Apostola.jpeg",
    descricao: "Ao lado do Apóstolo Rowilson, construiu uma aliança firme no ministério e na vida. Juntos, são pais de Isabelle e Samuel, uma família que reflete a presença e a união de Deus em cada detalhe. Sua dedicação e fé têm sido fundamentais na edificação da igreja e no cuidado com cada vida.",
  },
];

export default function QuemSomos() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[var(--content-min-height)]">
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
                A Igreja Evangélica Avivamento para as Nações teve seu início de
                uma forma simples, em um bairro humilde, mas que com o passar
                dos anos foi crescendo e se fortalecendo, dando origem a
                diversos sonhos e projetos que hoje estão se concretizando.
              </p>
              <p className="mb-4">
                Uma viagem à Colômbia foi um marco transformador, onde o modelo
                de igreja em célula foi aprendido. Essa visão transformou nossa
                igreja, trazendo crescimento espiritual, comunhão e
                multiplicação. As células se tornaram locais de cuidado,
                discipulado e fortalecimento da fé.
              </p>
              <p className="mb-4">
                Hoje, com sede na Rua Lucas Padilha, 07, Jardim Ester, Zona
                Oeste de São Paulo, a igreja é o ponto mais ativo do ministério,
                com cultos diários, reuniões, treinamentos, vigílias e a Web
                Rádio. Sempre pensando nas vidas que o Senhor acrescenta e no
                crescimento do ministério, outros espaços surgiram com a direção
                de Deus: um acampamento para retiros espirituais, o espaço em
                Embu das Artes com capacidade para 1.000 pessoas, a área em
                Itapecerica da Serra e a base missionária em Caldas, Minas
                Gerais.
              </p>
              <p>
                O chamado missionário também ultrapassou fronteiras, com missões
                em Israel, Argentina, Estados Unidos, Moçambique e Malawi, levando avivamento e o
                Evangelho aonde o Senhor manda ir.
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
                Prestar culto a Deus, promover a pregação da Palavra de
                Deus, ministrar aos seus discipulos como viver em santidade que os levam a
                viver de conformidade com a vontade de Deus, fazer discípulos e
                instruí-los no ensino e na prática de toda a doutrina bíblica,
                batizando-os em nome do Pai, do Filho e do Espírito Santo,
                levando-os ao crescimento espiritual e estimulando obras de
                caráter social.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-accent">
                Nossa Visão
              </h2>
              <p className="text-muted-foreground">
                Ser uma igreja que rompe barreiras e alcança nações,
                transformando vidas através do poder do Evangelho. Como na visão
                profética do Apóstolo Rowilson, onde pedras eram lançadas por
                todos os lados, cruzando continentes, somos chamados a levar
                avivamento a todas as nações, formando discípulos e expandindo o
                Reino de Deus além das fronteiras.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              titulo: "Fé e Palavra",
              descricao: "Cremos na Bíblia Sagrada como a Palavra de Deus e fundamento de toda doutrina. Nossa fé é inabalável e guia cada passo do ministério.",
            },
            {
              titulo: "Comunhão e Discipulado",
              descricao: "Através das células e do convívio fraterno, cultivamos relacionamentos que fortalecem a fé, promovem o cuidado mútuo e formam discípulos comprometidos.",
            },
            {
              titulo: "Missões e Avivamento",
              descricao: "Somos chamados a alcançar nações. Levamos o Evangelho além das fronteiras, cruzando continentes com o propósito de transformar vidas pelo poder de Deus.",
            },
          ].map((valor, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{valor.titulo}</h3>
                <p className="text-muted-foreground">
                  {valor.descricao}
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
            { nome: "Infantil", emoji: "🧒", logo: logoResgatandoCriancas, descricao: "\"Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.\" - Provérbios 22:6" },
            { nome: "Jovens", emoji: "✨", logo: logoAvivaJovens, descricao: "\"Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, na caridade, no espírito, na fé, na pureza.\" - 1 Timóteo 4:12" },
            { nome: "Intercessão", emoji: "🙏", descricao: "\"Orai sem cessar.\" - 1 Tessalonicenses 5:17" },
          ].map((ministerio) => (
            <Card
              key={ministerio.nome}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full mb-4 flex items-center justify-center overflow-hidden">
                  {ministerio.logo ? (
                    <img src={ministerio.logo} alt={ministerio.nome} className="max-h-14 max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-4xl">{ministerio.emoji}</span>
                  )}
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
            <CardContent className="p-6 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-muted rounded-full mb-4 flex items-center justify-center overflow-hidden">
                <img src={logoABER} alt="ABER - Associação Beneficente" className="max-h-14 max-w-[80%] object-contain" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Associação Beneficente</h3>
              <p className="text-sm text-muted-foreground">
                "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." — 2 Coríntios 9:7
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Equipes */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossas Equipes
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { nome: "Ganhar", emoji: "🎯", descricao: "Alcançar vidas para Cristo, levando o Evangelho a quem ainda não conhece o amor de Deus." },
            { nome: "Consolidar", emoji: "🤝", descricao: "Acolher e fortalecer os novos convertidos, firmando-os na fé e na comunhão com a igreja." },
            { nome: "Treinar", emoji: "📖", descricao: "Capacitar e equipar os membros para o serviço do Reino, através do ensino da Palavra." },
            { nome: "Enviar", emoji: "🚀", descricao: "Levantar e enviar novos líderes e missionários para multiplicar o Evangelho em toda parte." },
          ].map((equipe) => (
            <Card
              key={equipe.nome}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">{equipe.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{equipe.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {equipe.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grupos */}
      {/* Grupos */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossos Grupos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { nome: "TV Avivamento para as Nações", emoji: "📸", logo: logoTVAvivaNacoes, descricao: "Responsável por registrar e transmitir os momentos da igreja, levando a mensagem do Evangelho através das plataformas digitais." },
            { nome: "Web Rádio", emoji: "📻", logo: logoWebRadio, descricao: "Nossa rádio online que leva a Palavra de Deus, louvores e conteúdo edificante para ouvintes em qualquer lugar." },
            { nome: "JOAN - Jornal Online", emoji: "📰", logo: logoJOAN, descricao: "Jornal Online Aviva News — levando informação, edificação e as notícias do ministério para todos os lugares." },
            { nome: "Coreografia", emoji: "💃", descricao: "\"Louvem o seu nome com danças.\" - Salmos 149:3. Adoração ao Senhor através da expressão corporal e da dança." },
          ].map((grupo) => (
            <Card
              key={grupo.nome}
              className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full mb-4 flex items-center justify-center overflow-hidden">
                  {grupo.logo ? (
                    <img src={grupo.logo} alt={grupo.nome} className="max-h-14 max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-4xl">{grupo.emoji}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{grupo.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {grupo.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grupos de Louvor */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossos Grupos de Louvor
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { nome: "Ebenézer", emoji: "🪨", descricao: "\"Até aqui nos ajudou o Senhor.\" Grupo de louvor que levanta pedras de adoração, proclamando a fidelidade de Deus em cada nota." },
            { nome: "Revive", emoji: "🔥", descricao: "Grupo de louvor que busca o avivamento através da adoração, trazendo renovação e o fogo do Espírito Santo a cada ministração." },
            { nome: "Rosas de Saron", emoji: "🌹", descricao: "Grupo de louvor que exala a fragrância da adoração, levando a beleza e a doçura da presença de Deus a cada momento." },
            { nome: "Levitas", emoji: "🛐", descricao: "Grupo de louvor dedicado ao serviço no altar, seguindo o exemplo dos levitas bíblicos na adoração consagrada ao Senhor." },
            { nome: "Emunah", emoji: "🕯️", descricao: "Emunah significa \"fé\" em hebraico. Grupo de louvor que adora com convicção e fidelidade, declarando as promessas de Deus." },
            { nome: "Elohim", emoji: "👑", descricao: "Elohim, um dos nomes de Deus. Grupo de louvor que exalta a grandeza e a soberania do Criador em cada adoração." },
            { nome: "Efraim", emoji: "🌿", descricao: "Efraim significa \"frutífero\". Grupo de louvor que busca produzir frutos de adoração que glorifiquem o nome do Senhor." },
            { nome: "El Elion", emoji: "⭐", descricao: "El Elion, o Deus Altíssimo. Grupo de louvor que eleva a adoração ao lugar mais alto, reconhecendo a majestade de Deus." },
            { nome: "Maranata", emoji: "✝️", descricao: "\"Maranata, ora vem Senhor Jesus!\" Grupo de louvor que vive na expectativa da volta de Cristo, adorando com urgência e paixão." },
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
                  {grupo.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
