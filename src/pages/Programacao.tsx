import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import {
  getProgramacaoAtiva,
  DIAS_SEMANA,
  type Programacao as ProgramacaoType,
} from "@/services/programacaoService";

export default function Programacao() {
  const [programacao, setProgramacao] = useState<ProgramacaoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProgramacao = async () => {
      try {
        const data = await getProgramacaoAtiva();
        setProgramacao(data);
      } catch (error) {
        console.error("Erro ao carregar programação:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProgramacao();
  }, []);

  // Agrupar programação por dia
  const diasSemana = DIAS_SEMANA.map((dia) => ({
    dia: dia.nome,
    atividades: programacao
      .filter((p) => p.dia_semana === dia.valor)
      .map((p) => ({
        titulo: p.titulo,
        horario: p.horario,
        local: p.local || "",
      })),
  }));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Carregando programação...</p>
      </div>
    );
  }

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

    </div>
  );
}
