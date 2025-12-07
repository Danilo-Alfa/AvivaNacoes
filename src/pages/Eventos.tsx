import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import {
  getEventosFuturos,
  getEventosDoMes,
  getEventosDestaque,
  type Evento,
} from "@/services/eventoService";

export default function Eventos() {
  const [eventosFuturos, setEventosFuturos] = useState<Evento[]>([]);
  const [eventosDestaque, setEventosDestaque] = useState<Evento[]>([]);
  const [eventosDoMes, setEventosDoMes] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesAtual, setMesAtual] = useState(new Date());

  useEffect(() => {
    carregarEventos();
  }, []);

  useEffect(() => {
    carregarEventosDoMes();
  }, [mesAtual]);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const [futuros, destaques] = await Promise.all([
        getEventosFuturos(),
        getEventosDestaque(),
      ]);
      setEventosFuturos(futuros);
      setEventosDestaque(destaques);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarEventosDoMes = async () => {
    try {
      const eventos = await getEventosDoMes(
        mesAtual.getFullYear(),
        mesAtual.getMonth()
      );
      setEventosDoMes(eventos);
    } catch (error) {
      console.error("Erro ao carregar eventos do mês:", error);
    }
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatarDataCurta = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatarHora = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarPeriodo = (inicio: string, fim: string | null) => {
    const dataInicio = new Date(inicio);
    const dataFim = fim ? new Date(fim) : null;

    // Se não tem data fim, ou é o mesmo dia
    if (!dataFim ||
        (dataInicio.getDate() === dataFim.getDate() &&
         dataInicio.getMonth() === dataFim.getMonth() &&
         dataInicio.getFullYear() === dataFim.getFullYear())) {
      return formatarData(inicio);
    }

    // Se é mês e ano diferentes
    if (dataInicio.getMonth() !== dataFim.getMonth() ||
        dataInicio.getFullYear() !== dataFim.getFullYear()) {
      return `${formatarData(inicio)} até ${formatarData(fim)}`;
    }

    // Se é o mesmo mês, mostra formato compacto
    return `${dataInicio.getDate()} a ${dataFim.getDate()} de ${dataInicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
  };

  const formatarHorario = (inicio: string, fim: string | null) => {
    const dataInicio = new Date(inicio);
    const horaInicio = formatarHora(inicio);

    // Verificar se é dia inteiro:
    // 1. Hora é 12:00 (marcador usado pelo admin para dia inteiro)
    // 2. Hora início e fim são iguais
    // 3. Não tem hora de fim e início é meio-dia

    if (fim) {
      const horaFim = formatarHora(fim);

      // Se horários são iguais, é dia inteiro
      if (horaInicio === horaFim) {
        return "Dia inteiro";
      }

      return `${horaInicio} às ${horaFim}`;
    }

    // Se não tem fim, verifica se é o marcador de dia inteiro (12:00)
    // Considera uma janela de tolerância por causa de timezone
    const hora = dataInicio.getHours();
    const minuto = dataInicio.getMinutes();
    if ((hora === 12 || hora === 11 || hora === 9) && minuto === 0) {
      return "Dia inteiro";
    }

    return horaInicio;
  };

  // Gerar calendário do mês
  const gerarCalendario = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    const dias = [];
    // Dias vazios antes do primeiro dia
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(null);
    }
    // Dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
      dias.push(dia);
    }

    return dias;
  };

  const getEventosDoDia = (dia: number) => {
    const dataAlvo = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia, 12, 0, 0);

    return eventosDoMes.filter((evento) => {
      const dataInicio = new Date(evento.data_inicio);
      const dataFim = evento.data_fim ? new Date(evento.data_fim) : dataInicio;

      // Normalizar datas para meio-dia para evitar problemas de timezone
      const inicioNormalizado = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate(), 12, 0, 0);
      const fimNormalizado = new Date(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate(), 12, 0, 0);

      // Verificar se a data alvo está entre início e fim (inclusive)
      return dataAlvo >= inicioNormalizado && dataAlvo <= fimNormalizado;
    });
  };

  const temEventoNoDia = (dia: number) => {
    return getEventosDoDia(dia).length > 0;
  };

  const mudarMes = (direcao: number) => {
    setMesAtual(
      new Date(mesAtual.getFullYear(), mesAtual.getMonth() + direcao, 1)
    );
  };

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

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : (
        <>
          {/* Eventos em Destaque */}
          {eventosDestaque.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Eventos em Destaque</h2>
              <div className="space-y-6">
                {eventosDestaque.map((evento) => (
                  <Card
                    key={evento.id}
                    className="shadow-soft hover:shadow-medium transition-all overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-3 gap-0">
                        {/* Imagem do Evento */}
                        <div className="aspect-video md:aspect-auto">
                          {evento.imagem_url ? (
                            <img
                              src={evento.imagem_url}
                              alt={evento.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full bg-gradient-accent flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-accent-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Informações do Evento */}
                        <div className="md:col-span-2 p-6 md:p-8">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                            <Star className="w-3 h-3" />
                            DESTAQUE
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            {evento.titulo}
                          </h3>
                          {evento.descricao && (
                            <p className="text-muted-foreground mb-4">
                              {evento.descricao}
                            </p>
                          )}

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {evento.data_fim && new Date(evento.data_inicio).toDateString() !== new Date(evento.data_fim).toDateString() ? "Período" : "Data"}
                                </p>
                                <p className="font-semibold text-sm">
                                  {formatarPeriodo(evento.data_inicio, evento.data_fim)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Horário
                                </p>
                                <p className="font-semibold text-sm">
                                  {formatarHorario(
                                    evento.data_inicio,
                                    evento.data_fim
                                  )}
                                </p>
                              </div>
                            </div>

                            {evento.local && (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Local
                                  </p>
                                  <p className="font-semibold text-sm">
                                    {evento.local}
                                  </p>
                                </div>
                              </div>
                            )}

                            {evento.tipo && (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">🏷️</span>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Tipo
                                  </p>
                                  <p className="font-semibold text-sm">
                                    {evento.tipo}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Calendário do Mês */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold">Calendário</h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => mudarMes(-1)}
                  className="min-w-[44px] min-h-[44px] p-2 hover:bg-accent rounded-lg transition-colors text-xl sm:text-2xl flex items-center justify-center"
                  aria-label="Mês anterior"
                >
                  ‹
                </button>
                <span className="font-semibold text-sm sm:text-base min-w-[140px] sm:min-w-[160px] text-center">
                  {mesAtual.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => mudarMes(1)}
                  className="min-w-[44px] min-h-[44px] p-2 hover:bg-accent rounded-lg transition-colors text-xl sm:text-2xl flex items-center justify-center"
                  aria-label="Próximo mês"
                >
                  ›
                </button>
              </div>
            </div>

            <Card>
              <CardContent className="p-3 sm:p-4 md:p-6">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (dia) => (
                      <div
                        key={dia}
                        className="text-center font-semibold text-xs sm:text-sm text-muted-foreground"
                      >
                        {dia}
                      </div>
                    )
                  )}
                </div>

                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {gerarCalendario().map((dia, index) => {
                    if (!dia) return <div key={index} />;

                    const eventosNoDia = getEventosDoDia(dia);
                    const temEvento = eventosNoDia.length > 0;
                    const corEvento = temEvento && eventosNoDia[0].cor ? eventosNoDia[0].cor : "#3b82f6";

                    return (
                      <div
                        key={index}
                        className={`aspect-square flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base relative group ${
                          temEvento
                            ? "font-semibold hover:opacity-90 cursor-pointer"
                            : "hover:bg-accent cursor-pointer"
                        }`}
                        style={temEvento ? {
                          backgroundColor: corEvento,
                          color: '#ffffff'
                        } : {}}
                        title={temEvento ? eventosNoDia.map(e => e.titulo).join(', ') : ''}
                      >
                        {dia}
                        {temEvento && eventosNoDia.length > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100] w-max max-w-[90vw] sm:max-w-xs pointer-events-none">
                            <div className="bg-popover text-popover-foreground p-2 sm:p-3 rounded-lg shadow-lg border">
                              <div className="space-y-1">
                                {eventosNoDia.map((evento) => (
                                  <div key={evento.id} className="text-[10px] sm:text-xs">
                                    <div className="font-semibold truncate">{evento.titulo}</div>
                                    {evento.tipo && (
                                      <div className="text-muted-foreground truncate">{evento.tipo}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Próximos Eventos */}
          {eventosFuturos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Próximos Eventos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {eventosFuturos.slice(0, 6).map((evento) => (
                  <Card
                    key={evento.id}
                    className="shadow-soft hover:shadow-medium transition-all"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{evento.titulo}</h3>
                      {evento.descricao && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {evento.descricao}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{formatarPeriodo(evento.data_inicio, evento.data_fim)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>
                            {formatarHorario(evento.data_inicio, evento.data_fim)}
                          </span>
                        </div>
                        {evento.local && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{evento.local}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {eventosFuturos.length === 0 && eventosDestaque.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                Nenhum evento agendado no momento
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
