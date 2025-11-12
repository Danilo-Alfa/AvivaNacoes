import { Card, CardContent } from "@/components/ui/card";

export default function Projetos() {
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
        {[1, 2, 3, 4].map((projeto, index) => (
          <Card
            key={projeto}
            className="shadow-soft hover:shadow-medium transition-shadow overflow-hidden"
          >
            <CardContent className="p-0">
              <div
                className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
              >
                {/* Imagem */}
                <div
                  className={`aspect-video md:aspect-auto ${index % 2 === 1 ? "md:col-start-2" : ""}`}
                >
                  <div className="h-full bg-gradient-accent flex items-center justify-center">
                    <span className="text-xl text-accent-foreground font-semibold">
                      Imagem do Projeto
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div
                  className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}
                >
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 w-fit">
                    Projeto Social
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    Nome do Projeto {projeto}
                  </h2>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    [Descrição detalhada do projeto, explicando seus objetivos,
                    público-alvo, e o impacto que tem causado na comunidade.
                    Inclua informações sobre como as pessoas podem participar ou
                    apoiar.]
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <p className="text-sm font-medium">
                        Objetivo principal do projeto
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <p className="text-sm font-medium">
                        Público-alvo atendido
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <p className="text-sm font-medium">
                        Frequência das atividades
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <section className="mt-16">
        <Card className="shadow-medium bg-gradient-hero">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
              Faça Parte da Transformação
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Você pode ajudar a fazer a diferença! Entre em contato para saber
              como participar dos nossos projetos.
            </p>
            <button className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Entre em Contato
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
