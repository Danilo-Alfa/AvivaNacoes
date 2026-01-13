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
    // Usar UTC para evitar problemas de fuso horário
    const horas = data.getUTCHours().toString().padStart(2, '0');
    const minutos = data.getUTCMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
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

    // Se não tem fim, verifica se é o marcador de dia inteiro (12:00 UTC)
    const hora = dataInicio.getUTCHours();
    const minuto = dataInicio.getUTCMinutes();
    if (hora === 12 && minuto === 0) {
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
              <div className="grid grid-cols-7">
                {gerarCalendario().map((dia, index) => {
                  const isToday = dia &&
                    new Date().getDate() === dia &&
                    new Date().getMonth() === mesAtual.getMonth() &&
                    new Date().getFullYear() === mesAtual.getFullYear();

                  // Função para criar gradiente suave a partir de uma cor
                  const criarGradiente = (cor: string) => {
                    // Converter hex para RGB e criar versão mais clara
                    const hex = cor.replace('#', '');
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    // Versão mais clara (misturar com branco)
                    const lighterR = Math.min(255, r + 40);
                    const lighterG = Math.min(255, g + 40);
                    const lighterB = Math.min(255, b + 40);
                    return `linear-gradient(135deg, rgba(${lighterR},${lighterG},${lighterB},0.9) 0%, rgba(${r},${g},${b},0.85) 100%)`;
                  };

                  if (!dia) {
                    return (
                      <div
                        key={index}
                        className="aspect-square border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30"
                      />
                    );
                  }

                  const eventosNoDia = getEventosDoDia(dia);
                  const temEvento = eventosNoDia.length > 0;
                  const eventosVisiveis = eventosNoDia.slice(0, 3);
                  const eventosExtras = Math.max(0, eventosNoDia.length - 3);

                  // Calcular posição do dia na semana (0-6) para ajustar tooltip
                  const posicaoNaSemana = index % 7;
                  const linhaNoCalendario = Math.floor(index / 7);
                  const isLeftEdge = posicaoNaSemana <= 1; // DOM ou SEG
                  const isRightEdge = posicaoNaSemana >= 5; // SEX ou SAB
                  const isTopRows = linhaNoCalendario <= 1; // Primeiras 2 linhas - tooltip aparece abaixo

                  return (
                    <div
                      key={index}
                      className={`aspect-square p-1.5 sm:p-2 border-b border-r border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30 flex flex-col ${
                        isToday ? "ring-2 ring-inset ring-indigo-400 bg-indigo-50/20 dark:bg-indigo-900/10" : ""
                      }`}
                    >
                      {/* Número do dia e badge de extras */}
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-xs sm:text-sm font-medium ${
                          isToday
                            ? "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-indigo-500 text-white rounded-full text-xs"
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                          {dia}
                        </span>
                        {eventosExtras > 0 && (
                          <span className="text-[8px] sm:text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/50 text-indigo-500 dark:text-indigo-400 px-1 sm:px-1.5 py-0.5 rounded-full">
                            +{eventosExtras}
                          </span>
                        )}
                      </div>

                      {/* Eventos visíveis */}
                      <div className="flex-1 space-y-0.5 overflow-hidden">
                        {eventosVisiveis.map((evento) => {
                          const cor = evento.cor || "#3b82f6";
                          return (
                            <div
                              key={evento.id}
                              className="text-[8px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md truncate cursor-pointer hover:shadow-md transition-all"
                              style={{
                                background: criarGradiente(cor),
                                color: '#ffffff',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                              }}
                              title={evento.titulo}
                            >
                              {evento.titulo}
                            </div>
                          );
                        })}
                      </div>

                      {/* Indicadores de cor dos eventos */}
                      {temEvento && (
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1 mt-1">
                          {eventosNoDia.slice(0, 3).map((evento, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full opacity-70"
                              style={{ backgroundColor: evento.cor || "#3b82f6" }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Tooltip com todos os eventos */}
                      {temEvento && (
                        <div className={`absolute hidden group-hover:block z-[100] w-64 sm:w-72 pointer-events-none ${
                          isTopRows
                            ? isRightEdge
                              ? "top-0 right-full mr-2"
                              : "top-0 left-full ml-2"
                            : isLeftEdge
                              ? "bottom-full mb-2 left-0"
                              : isRightEdge
                                ? "bottom-full mb-2 right-0"
                                : "bottom-full mb-2 left-1/2 -translate-x-1/2"
                        }`}>
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Header do tooltip */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex items-center gap-3">
                              <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                  {dia} de {mesAtual.toLocaleDateString("pt-BR", { month: "long" })}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {eventosNoDia.length} {eventosNoDia.length === 1 ? "evento" : "eventos"}
                                </div>
                              </div>
                            </div>

                            {/* Lista de eventos */}
                            <div className="p-3 space-y-2">
                              {eventosNoDia.map((evento) => (
                                <div
                                  key={evento.id}
                                  className="p-3 rounded-xl border-l-4"
                                  style={{
                                    borderLeftColor: evento.cor || "#3b82f6",
                                    backgroundColor: `${evento.cor || "#3b82f6"}10`
                                  }}
                                >
                                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    {evento.titulo}
                                  </div>
                                  {evento.descricao && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                      {evento.descricao}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{formatarHorario(evento.data_inicio, evento.data_fim)}</span>
                                  </div>
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
            </div>
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
