import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function Jornal() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Jornal Aviva News
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe as notícias, reflexões e atualizações da nossa igreja
        </p>
      </div>

      {/* Visualizador de Jornal (Estilo Vertical) */}
      <section className="mb-16">
        <Card className="shadow-medium overflow-hidden">
          <CardContent className="p-0">
            {/* Área de Visualização - Formato Vertical */}
            <div className="bg-muted flex items-center justify-center py-12 px-4">
              <div className="max-w-3xl w-full">
                <div className="aspect-[9/16] bg-background rounded-lg shadow-soft flex items-center justify-center">
                  <p className="text-muted-foreground">
                    [Visualização do Jornal em formato vertical - similar a
                    apresentação de slides]
                  </p>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="p-6 border-t border-border bg-background">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edição Dezembro 2024</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm font-medium">
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="text-sm text-muted-foreground">
                  Página{" "}
                  <span className="font-semibold text-foreground">1</span> de{" "}
                  <span className="font-semibold text-foreground">8</span>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm font-medium">
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Edições Anteriores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Edições Anteriores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => {
            const mes = new Date(2024, 11 - index, 1).toLocaleDateString(
              "pt-BR",
              { month: "long", year: "numeric" },
            );

            return (
              <Card
                key={index}
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-gradient-hero rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-xs text-primary-foreground font-semibold text-center px-2">
                      Capa
                      <br />
                      Jornal
                    </span>
                  </div>
                  <p className="text-xs font-medium text-center capitalize">
                    {mes}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Destaques da Edição Atual */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Destaques desta Edição</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Mensagem do Pastor",
            "Testemunho do Mês",
            "Eventos em Destaque",
          ].map((destaque, index) => (
            <Card
              key={destaque}
              className="shadow-soft hover:shadow-medium transition-all"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-xl font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{destaque}</h3>
                <p className="text-sm text-muted-foreground">
                  Breve descrição do conteúdo desta seção do jornal e por que
                  você deve ler.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA para Assinar */}
      <section className="mt-16">
        <Card className="shadow-medium bg-gradient-hero">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">
              Receba o Jornal por E-mail
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber as próximas edições do Aviva News
              diretamente no seu e-mail
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground"
              />
              <button className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap">
                Assinar Agora
              </button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
