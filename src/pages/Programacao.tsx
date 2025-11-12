import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

const diasSemana = [
  { dia: "Segunda", atividades: [] },
  {
    dia: "Terça",
    atividades: [
      {
        titulo: "Reunião de Oração",
        horario: "19h30",
        local: "Sede Principal",
      },
    ],
  },
  { dia: "Quarta", atividades: [] },
  {
    dia: "Quinta",
    atividades: [
      { titulo: "Estudo Bíblico", horario: "19h30", local: "Todas as Sedes" },
    ],
  },
  {
    dia: "Sexta",
    atividades: [
      { titulo: "Culto de Jovens", horario: "20h", local: "Sede Central" },
    ],
  },
  {
    dia: "Sábado",
    atividades: [
      {
        titulo: "Ministério Infantil",
        horario: "15h",
        local: "Sede Principal",
      },
    ],
  },
  {
    dia: "Domingo",
    atividades: [
      { titulo: "Escola Dominical", horario: "09h", local: "Todas as Sedes" },
      { titulo: "Culto Matinal", horario: "10h", local: "Todas as Sedes" },
      { titulo: "Culto Vespertino", horario: "19h", local: "Todas as Sedes" },
    ],
  },
];

export default function Programacao() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Programação
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Confira nossa programação semanal e participe das nossas atividades
        </p>
      </div>

      {/* Calendário Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {diasSemana.map((dia, index) => (
          <Card
            key={dia.dia}
            className={`shadow-soft hover:shadow-medium transition-all ${
              dia.atividades.length > 0 ? "border-primary/20" : ""
            } ${index === 6 ? "md:col-span-2 lg:col-span-1" : ""}`}
          >
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3
                  className={`text-lg font-bold ${
                    dia.atividades.length > 0
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {dia.dia}
                </h3>
                {dia.atividades.length > 0 && (
                  <div className="w-12 h-1 bg-gradient-accent rounded-full mx-auto mt-2"></div>
                )}
              </div>

              <div className="space-y-3">
                {dia.atividades.length > 0 ? (
                  dia.atividades.map((atividade, idx) => (
                    <div key={idx} className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">
                        {atividade.titulo}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{atividade.horario}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{atividade.local}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    Sem atividades
                    <br />
                    programadas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações Adicionais */}
      <section className="mt-16">
        <Card className="shadow-medium">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Informações Importantes
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Pontualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Chegue alguns minutos antes para aproveitar melhor o culto
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Todas as Sedes</h3>
                <p className="text-sm text-muted-foreground">
                  Confira os horários específicos de cada sede
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="font-semibold mb-2">Louvor</h3>
                <p className="text-sm text-muted-foreground">
                  Momentos especiais de adoração em todos os cultos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Eventos Especiais */}
      <section className="mt-12">
        <Card className="shadow-soft">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Eventos Especiais do Mês
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((evento) => (
                <div
                  key={evento}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="bg-gradient-accent text-accent-foreground rounded-lg p-3 text-center min-w-[70px]">
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-xs">DEZ</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Nome do Evento Especial
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Descrição breve do evento especial que acontecerá
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        19h30
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Sede Principal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
