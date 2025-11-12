import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export default function Eventos() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Eventos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Participe dos nossos próximos eventos e experiências transformadoras
        </p>
      </div>

      {/* Próximos Eventos em Destaque */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Próximos Eventos</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((evento) => (
            <Card key={evento} className="shadow-soft hover:shadow-medium transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Imagem do Evento */}
                  <div className="aspect-video md:aspect-auto">
                    <div className="h-full bg-gradient-accent flex items-center justify-center">
                      <span className="text-xl text-accent-foreground font-semibold">
                        Imagem do Evento
                      </span>
                    </div>
                  </div>

                  {/* Informações do Evento */}
                  <div className="md:col-span-2 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                          DESTAQUE
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Nome do Evento Especial</h3>
                        <p className="text-muted-foreground mb-4">
                          Descrição detalhada do evento, incluindo o que será abordado, 
                          quem pode participar e o que os participantes podem esperar desta experiência única.
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="font-semibold">15 de Dezembro, 2024</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Horário</p>
                          <p className="font-semibold">19h30 às 22h</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Local</p>
                          <p className="font-semibold">Sede Principal</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Público</p>
                          <p className="font-semibold">Todas as idades</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-hero text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                      Quero Participar
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calendário de Eventos */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Calendário do Mês</h2>
        <Card className="shadow-medium">
          <CardContent className="p-8">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div key={dia} className="text-center font-semibold text-sm text-muted-foreground py-2">
                  {dia}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => {
                const dia = index - 2;
                const hasEvent = [5, 12, 19, 26].includes(dia);
                
                return (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                      dia < 1 || dia > 31
                        ? 'text-muted-foreground/30'
                        : hasEvent
                        ? 'bg-primary text-primary-foreground font-semibold cursor-pointer hover:bg-primary/90'
                        : 'hover:bg-muted cursor-pointer'
                    }`}
                  >
                    {dia > 0 && dia <= 31 ? dia : ''}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-muted-foreground">Dia com evento</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Eventos Realizados */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Eventos Realizados</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((evento) => (
            <Card key={evento} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Foto do Evento</span>
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-2">15 de Novembro, 2024</div>
                  <h3 className="font-semibold mb-2">Nome do Evento Passado</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Breve descrição do evento que foi realizado e seu impacto na comunidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
