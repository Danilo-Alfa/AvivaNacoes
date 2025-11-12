import { Card, CardContent } from "@/components/ui/card";

export default function QuemSomos() {
  return (
    <div className="container mx-auto px-4 py-12">
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
            <h2 className="text-3xl font-bold mb-6 text-primary">Nossa História</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                [Aqui você pode adicionar a história de como a igreja surgiu, os marcos importantes, 
                e a jornada de fé que trouxe a igreja até hoje]
              </p>
              <p>
                [Continue contando a história da igreja, mencionando momentos significativos 
                e o crescimento ao longo dos anos]
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
              <h2 className="text-2xl font-bold mb-4 text-primary">Nossa Missão</h2>
              <p className="text-muted-foreground">
                [Descreva a missão da igreja - o propósito e objetivo principal 
                da comunidade de fé]
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-accent">Nossa Visão</h2>
              <p className="text-muted-foreground">
                [Descreva a visão da igreja - aonde vocês querem chegar e o impacto 
                que desejam causar]
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
            <Card key={item} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-foreground">{item}</span>
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
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((pastor) => (
            <Card key={pastor} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="aspect-square bg-gradient-hero rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-primary-foreground font-bold">Foto</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Pastor(a) Nome</h3>
                <p className="text-sm text-accent font-medium mb-3">Cargo/Função</p>
                <p className="text-sm text-muted-foreground">
                  [Breve biografia e informações sobre o pastor(a)]
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ministérios */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Ministérios</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Louvor", "Jovens", "Infantil", "Intercessão"].map((ministerio) => (
            <Card key={ministerio} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">Ícone</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{ministerio}</h3>
                <p className="text-sm text-muted-foreground">
                  [Descrição do ministério]
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
