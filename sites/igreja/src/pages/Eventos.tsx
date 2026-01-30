import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star, X } from "lucide-react";
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
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

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
    // Formato esperado: "2026-12-14T09:00:00" ou "2026-12-14T09:00:00.000Z"
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
    // Formato esperado: "2026-12-14T09:00:00" ou "2026-12-14T09:00:00.000Z"
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

  // Skeleton para o calendário - mantém o mesmo tamanho do calendário real
  const CalendarioSkeleton = () => (
    <section className="mb-16">
      <div className="flex flex-col items-center mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 min-h-[400px]">
        <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="py-4 flex justify-center">
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 p-3">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );

  // Skeleton para eventos em destaque
  const EventoDestaqueSkeleton = () => (
    <section className="mb-16">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8" />
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="aspect-video md:aspect-auto md:h-80 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="md:col-span-2 p-6 md:p-8 space-y-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

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
        <>
          <EventoDestaqueSkeleton />
          <CalendarioSkeleton />
        </>
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
                        <div className="aspect-video md:aspect-auto md:h-80">
                          {evento.imagem_url ? (
                            <img
                              src={evento.imagem_url}
                              alt={evento.titulo}
                              width={400}
                              height={320}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full min-h-[200px] md:h-80 bg-gradient-accent flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-accent-foreground" aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        {/* Informações do Evento */}
                        <div className="md:col-span-2 p-6 md:p-8">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                            <Star className="w-3 h-3" aria-hidden="true" />
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
                                <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
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
                                <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
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
                                  <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
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
            <div className="flex flex-col items-center mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Calendário
                </h2>
              </div>

              {/* Navegação do Mês - Centralizado */}
              <div className="flex items-center justify-center gap-1 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                <button
                  onClick={() => mudarMes(-1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Mês anterior"
                >
                  <span className="text-gray-600 dark:text-gray-400 text-lg">‹</span>
                </button>
                <span className="font-semibold text-sm sm:text-base min-w-[130px] sm:min-w-[160px] text-center capitalize px-2">
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
                  <span className="text-gray-600 dark:text-gray-400 text-lg">›</span>
                </button>
              </div>
            </div>

            {/* Grade do Calendário */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px]">
              {/* Dias da semana */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (dia) => (
                    <div
                      key={dia}
                      className="py-4 text-center font-medium text-sm tracking-wide text-indigo-600/80 dark:text-indigo-400"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                    >
                      {dia}
                    </div>
                  )
                )}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-2 p-3">
                {gerarCalendario().map((dia, index) => {
                  const isToday = dia &&
                    new Date().getDate() === dia &&
                    new Date().getMonth() === mesAtual.getMonth() &&
                    new Date().getFullYear() === mesAtual.getFullYear();

                  if (!dia) {
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded-2xl bg-gray-100/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800"
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
                  const isLeftEdge = posicaoNaSemana <= 1;
                  const isRightEdge = posicaoNaSemana >= 5;
                  const isTopRows = linhaNoCalendario <= 1;

                  return (
                    <button
                      type="button"
                      key={index}
                      aria-label={temEvento
                        ? `${dia} de ${mesAtual.toLocaleDateString("pt-BR", { month: "long" })}, ${eventosNoDia.length} ${eventosNoDia.length === 1 ? "evento" : "eventos"}`
                        : `${dia} de ${mesAtual.toLocaleDateString("pt-BR", { month: "long" })}`}
                      className={`aspect-square p-2 sm:p-2.5 rounded-2xl relative group transition-all duration-200 ease-out flex flex-col cursor-pointer border text-left
                        hover:bg-white hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 hover:z-10 dark:hover:bg-gray-800
                        ${isToday
                          ? "ring-2 ring-indigo-400 bg-indigo-50/60 dark:bg-indigo-900/30 shadow-md border-indigo-200 dark:border-indigo-700"
                          : "bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-lg border-gray-200 dark:border-gray-700"
                        }`}
                      onClick={() => temEvento && setDiaSelecionado(dia)}
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
                      <div className="flex-1 space-y-1 overflow-hidden">
                        {eventosVisiveis.map((evento) => {
                          const cor = evento.cor || "#6366f1";
                          return (
                            <div
                              key={evento.id}
                              className="text-[8px] sm:text-[10px] font-medium pl-2 sm:pl-2.5 pr-1.5 py-1 sm:py-1.5 rounded-r-md truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all bg-gray-50/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-l-[3px]"
                              style={{
                                borderLeftColor: cor
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

                      {/* Tooltip com todos os eventos - Mobile: posição fixa fora do grid / Desktop: posição relativa ao dia */}
                      {temEvento && (
                        <>
                          {/* Tooltip - apenas desktop (hover não funciona bem em touch) */}
                          <div className={`absolute z-[100] w-72 pointer-events-none hidden sm:group-hover:block ${
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
                                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    {dia} de {mesAtual.toLocaleDateString("pt-BR", { month: "long" })}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-300">
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
                                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                                        {evento.descricao}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600 dark:text-gray-300">
                                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                      <span>{formatarHorario(evento.data_inicio, evento.data_fim)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                        </>
                      )}
                    </button>
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
                          <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
                          <span>{formatarPeriodo(evento.data_inicio, evento.data_fim)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                          <span>
                            {formatarHorario(evento.data_inicio, evento.data_fim)}
                          </span>
                        </div>
                        {evento.local && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
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
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-lg text-muted-foreground">
                Nenhum evento futuro agendado no momento
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de eventos do dia (mobile-friendly) */}
      {diaSelecionado && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setDiaSelecionado(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white dark:bg-gray-800 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <div id="modal-title" className="font-bold text-white text-lg">
                    {diaSelecionado} de {mesAtual.toLocaleDateString("pt-BR", { month: "long" })}
                  </div>
                  <div className="text-white/80 text-sm">
                    {getEventosDoDia(diaSelecionado).length} {getEventosDoDia(diaSelecionado).length === 1 ? "evento" : "eventos"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDiaSelecionado(null)}
                aria-label="Fechar modal de eventos"
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* Lista de eventos */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {getEventosDoDia(diaSelecionado).map((evento) => (
                <div
                  key={evento.id}
                  className="p-4 rounded-xl border-l-4"
                  style={{
                    borderLeftColor: evento.cor || "#3b82f6",
                    backgroundColor: `${evento.cor || "#3b82f6"}10`
                  }}
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {evento.titulo}
                  </div>
                  {evento.descricao && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {evento.descricao}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{formatarHorario(evento.data_inicio, evento.data_fim)}</span>
                  </div>
                  {evento.local && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>{evento.local}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
