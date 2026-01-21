import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTilt } from "@/hooks/useTilt";
import { getProjetosAtivos, type Projeto } from "@/services/projetoService";

function ProjetoCard({ projeto, index }: { projeto: Projeto; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>({
    maxTilt: 5,
    perspective: 2000,
    scale: 1.01,
    speed: 400,
    glare: true,
    maxGlare: 0.15,
    tiltThreshold: 0.5,
  });

  return (
    <Card
      ref={tiltRef}
      className="shadow-soft hover:shadow-medium transition-shadow"
    >
      <CardContent className="p-0">
        <div
          className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
        >
          {/* Imagem */}
          <div
            className={`aspect-video md:aspect-auto ${index % 2 === 1 ? "md:col-start-2" : ""}`}
          >
            {projeto.imagem_url ? (
              <img
                src={projeto.imagem_url}
                alt={projeto.titulo}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full bg-gradient-accent flex items-center justify-center min-h-[200px]">
                <span className="text-xl text-accent-foreground font-semibold">
                  {projeto.titulo}
                </span>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div
            className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}
          >
            {projeto.categoria && (
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 w-fit">
                {projeto.categoria}
              </div>
            )}

            <h2 className="text-3xl font-bold mb-4">{projeto.titulo}</h2>

            {projeto.descricao && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {projeto.descricao}
              </p>
            )}

            <div className="space-y-2">
              {projeto.objetivo && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-sm font-medium">{projeto.objetivo}</p>
                </div>
              )}
              {projeto.publico_alvo && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-sm font-medium">
                    Público: {projeto.publico_alvo}
                  </p>
                </div>
              )}
              {projeto.frequencia && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <p className="text-sm font-medium">{projeto.frequencia}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const data = await getProjetosAtivos();
        setProjetos(data);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProjetos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Projetos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conheça os projetos sociais e iniciativas que transformam vidas
        </p>
      </div>

      {/* Grid de Projetos */}
      <div className="space-y-12">
        {projetos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum projeto cadastrado ainda.
          </p>
        ) : (
          projetos.map((projeto, index) => (
            <ProjetoCard key={projeto.id} projeto={projeto} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
