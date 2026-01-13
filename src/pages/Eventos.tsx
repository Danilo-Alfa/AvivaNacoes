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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Extrair data diretamente da string ISO para evitar problemas de timezone
    const match = dataStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const ano = parseInt(match[1]);
      const mes = parseInt(match[2]) - 1;
      const dia = parseInt(match[3]);
      const data = new Date(ano, mes, dia);
      return data.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    // Fallback
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
    // Extrair hora diretamente da string ISO para evitar problemas de timezone
    // Formato esperado: "2025-12-14T09:00:00" ou "2025-12-14T09:00:00.000Z"
    const match = dataStr.match(/T(\d{2}):(\d{2})/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    // Fallback para o método antigo se não conseguir extrair
    const data = new Date(dataStr);
    // Usar UTC para evitar problemas de fuso horário
    const horas = data.getUTCHours().toString().padStart(2, '0');
    const minutos = data.getUTCMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  const formatarPeriodo = (inicio: string, fim: string | null) => {
    // Extrair datas diretamente da string ISO para evitar problemas de timezone
    const extrairPartes = (dataStr: string) => {
      const match = dataStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return {
          ano: parseInt(match[1]),
          mes: parseInt(match[2]) - 1,
          dia: parseInt(match[3])
        };
      }
      const d = new Date(dataStr);
      return { ano: d.getFullYear(), mes: d.getMonth(), dia: d.getDate() };
    };

    const inicioPartes = extrairPartes(inicio);
    const fimPartes = fim ? extrairPartes(fim) : null;

    // Se não tem data fim, ou é o mesmo dia
    if (!fimPartes ||
        (inicioPartes.dia === fimPartes.dia &&
         inicioPartes.mes === fimPartes.mes &&
         inicioPartes.ano === fimPartes.ano)) {
      return formatarData(inicio);
    }

    // Se é mês e ano diferentes
    if (inicioPartes.mes !== fimPartes.mes ||
        inicioPartes.ano !== fimPartes.ano) {
      return `${formatarData(inicio)} até ${formatarData(fim)}`;
    }

    // Se é o mesmo mês, mostra formato compacto
    const dataRef = new Date(inicioPartes.ano, inicioPartes.mes, inicioPartes.dia);
    return `${inicioPartes.dia} a ${fimPartes.dia} de ${dataRef.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
  };

  const formatarHorario = (inicio: string, fim: string | null) => {
    const horaInicio = formatarHora(inicio);

    // Extrair hora e minuto diretamente da string para evitar problemas de timezone
    const matchInicio = inicio.match(/T(\d{2}):(\d{2})/);
    const horaInicioNum = matchInicio ? parseInt(matchInicio[1]) : 0;
    const minutoInicioNum = matchInicio ? parseInt(matchInicio[2]) : 0;

    // Verificar se é dia inteiro:
    // 1. Hora é 01:23 (marcador usado pelo admin para dia inteiro)
    // 2. Hora início e fim são iguais
    // 3. Não tem hora de fim e início é 01:23

    if (fim) {
      const horaFim = formatarHora(fim);

      // Se horários são iguais ou ambos são 01:23, é dia inteiro
      if (horaInicio === horaFim || (horaInicio === "01:23" && horaFim === "01:23")) {
        return "Dia inteiro";
      }

      return `${horaInicio} às ${horaFim}`;
    }

    // Se não tem fim, verifica se é o marcador de dia inteiro (01:23)
    if (horaInicioNum === 1 && minutoInicioNum === 23) {
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

  // Função auxiliar para extrair ano, mês e dia de uma string ISO sem problemas de timezone
  const extrairDataISO = (dataStr: string) => {
    // Formato esperado: "2025-12-14T09:00:00" ou "2025-12-14T09:00:00.000Z"
    const match = dataStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return {
        ano: parseInt(match[1]),
        mes: parseInt(match[2]) - 1, // Mês em JavaScript é 0-indexed
        dia: parseInt(match[3])
      };
    }
    // Fallback
    const data = new Date(dataStr);
    return {
      ano: data.getFullYear(),
      mes: data.getMonth(),
      dia: data.getDate()
    };
  };

  const getEventosDoDia = (dia: number) => {
    const anoAlvo = mesAtual.getFullYear();
    const mesAlvo = mesAtual.getMonth();

    return eventosDoMes.filter((evento) => {
      const inicio = extrairDataISO(evento.data_inicio);
      const fim = evento.data_fim ? extrairDataISO(evento.data_fim) : inicio;

      // Criar datas normalizadas para comparação (usando apenas ano/mês/dia)
      const dataAlvo = new Date(anoAlvo, mesAlvo, dia);
      const dataInicio = new Date(inicio.ano, inicio.mes, inicio.dia);
      const dataFim = new Date(fim.ano, fim.mes, fim.dia);

      // Verificar se a data alvo está entre início e fim (inclusive)
      return dataAlvo >= dataInicio && dataAlvo <= dataFim;
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
                        <div className="aspect-video md:aspect-auto md:max-h-80">
                          {evento.imagem_url ? (
                            <img
                              src={evento.imagem_url}
                              alt={evento.titulo}
                              className="w-full h-full object-cover max-h-80"
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
            {/* Header do Calendário */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Calendário
                </h2>
              </div>

              {/* Navegação do Mês */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => mudarMes(-1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Mês anterior"
                >
                  <span className="text-gray-600 dark:text-gray-400">‹</span>
                </button>
                <span className="font-semibold text-sm sm:text-base min-w-[140px] text-center capitalize">
                  {mesAtual.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => mudarMes(1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Próximo mês"
                >
                  <span className="text-gray-600 dark:text-gray-400">›</span>
                </button>
              </div>
            </div>

            {/* Grade do Calendário */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              {/* Dias da semana */}
              <div className="grid grid-cols-7 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
                  (dia) => (
                    <div
                      key={dia}
                      className="py-4 text-center font-semibold text-xs tracking-wider text-gray-500 dark:text-gray-400"
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
                Nenhum evento futuro agendado no momento
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
