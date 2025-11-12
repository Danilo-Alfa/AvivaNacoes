import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function Gibi() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
          GIBI - Turminha Resgatando
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Histórias bíblicas e valores cristãos de forma divertida para as crianças
        </p>
      </div>

      {/* Visualizador de GIBI */}
      <section className="mb-16">
        <Card className="shadow-medium overflow-hidden">
          <CardContent className="p-0">
            {/* Área de Visualização */}
            <div className="bg-muted flex items-center justify-center py-12 px-4">
              <div className="max-w-3xl w-full">
                <div className="aspect-[9/16] bg-background rounded-lg shadow-soft flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    [Visualização do GIBI em formato vertical]<br/>
                    <span className="text-sm">Histórias ilustradas para crianças</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="p-6 border-t border-border bg-background">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Edição #15 - A Grande Aventura</h2>
                  <p className="text-sm text-muted-foreground">História: David e Golias</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors text-sm font-medium">
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                
                <div className="text-sm text-muted-foreground">
                  Página <span className="font-semibold text-foreground">1</span> de <span className="font-semibold text-foreground">12</span>
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

      {/* Todas as Edições */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Todas as Edições</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 15 }).map((_, index) => {
            const edicao = 15 - index;
            
            return (
              <Card 
                key={index} 
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="aspect-[9/16] bg-gradient-accent rounded-lg mb-3 flex flex-col items-center justify-center group-hover:scale-105 transition-transform p-4">
                    <span className="text-3xl font-bold text-accent-foreground mb-2">#{edicao}</span>
                    <span className="text-xs text-accent-foreground/90 font-medium text-center">
                      Turminha<br/>Resgatando
                    </span>
                  </div>
                  <p className="text-xs font-medium text-center">Edição #{edicao}</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {new Date(2024, 11 - index, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Sobre a Turminha */}
      <section className="mb-16">
        <Card className="shadow-medium">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Conheça a Turminha Resgatando</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { nome: "Lucas", desc: "O corajoso" },
                { nome: "Maria", desc: "A sábia" },
                { nome: "Pedro", desc: "O animado" },
                { nome: "Ana", desc: "A carinhosa" }
              ].map((personagem) => (
                <div key={personagem.nome} className="text-center">
                  <div className="w-24 h-24 bg-gradient-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl text-accent-foreground font-bold">
                      {personagem.nome[0]}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{personagem.nome}</h3>
                  <p className="text-sm text-muted-foreground">{personagem.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Atividades para Imprimir */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Atividades para Imprimir</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Colorir",
            "Caça-Palavras",
            "Ligar Pontos"
          ].map((atividade) => (
            <Card key={atividade} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Atividade de {atividade}</span>
                </div>
                <h3 className="font-bold mb-2">{atividade}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Baixe e imprima atividades de {atividade.toLowerCase()} com temas bíblicos
                </p>
                <button className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <Card className="shadow-medium bg-gradient-accent">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-accent-foreground">
              Nova Edição Todo Mês!
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber notificações quando uma nova edição da Turminha Resgatando estiver disponível
            </p>
            <button className="px-8 py-3 bg-background text-foreground font-semibold rounded-lg hover:bg-background/90 transition-colors">
              Quero Receber Novidades
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
