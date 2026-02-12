import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTilt } from "@/hooks/useTilt";
import { getProjetosAtivos, type Projeto } from "@/services/projetoService";

// Skeleton para um card de projeto - mantém o mesmo tamanho do card real
function ProjetoCardSkeleton({ index }: { index: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
        {/* Imagem Skeleton */}
        <div
          className={`aspect-video md:aspect-auto min-h-[200px] md:min-h-[300px] bg-gray-200 dark:bg-gray-700 animate-pulse ${index % 2 === 1 ? "md:col-start-2" : ""}`}
        />
        {/* Conteúdo Skeleton */}
        <div
          className={`p-8 flex flex-col justify-center space-y-4 ${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}
        >
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
            className={`overflow-hidden ${index % 2 === 1 ? "md:col-start-2" : ""}`}
          >
            {projeto.imagem_url ? (
              <img
                src={projeto.imagem_url}
                alt={projeto.nome}
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full block"
              />
            ) : (
              <div className="h-full bg-gradient-accent flex items-center justify-center min-h-[200px] md:min-h-[300px]">
                <span className="text-xl text-accent-foreground font-semibold">
                  {projeto.nome}
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

            <h2 className="text-3xl font-bold mb-4">{projeto.nome}</h2>

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

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
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
        {loading ? (
          // Skeleton loaders enquanto carrega
          <>
            <ProjetoCardSkeleton index={0} />
            <ProjetoCardSkeleton index={1} />
            <ProjetoCardSkeleton index={2} />
          </>
        ) : (
          <>
            {projetos.map((projeto, index) => (
              <ProjetoCard key={projeto.id} projeto={projeto} index={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
