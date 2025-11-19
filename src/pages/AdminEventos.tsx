import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Calendar } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getTodosEventos,
  criarEvento,
  atualizarEvento,
  deletarEvento,
  type Evento,
} from "@/services/eventoService";

function AdminEventosContent() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("19:00");
  const [dataFim, setDataFim] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [local, setLocal] = useState("");
  const [tipo, setTipo] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [imagemUrl, setImagemUrl] = useState("");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [cor, setCor] = useState("#3b82f6"); // Azul padrão

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const data = await getTodosEventos();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast.error("Erro ao carregar eventos", {
        description: "Não foi possível carregar a lista de eventos. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !dataInicio) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha título e data de início"
      });
      return;
    }

    if (!diaInteiro && !horaInicio) {
      toast.error("Hora de início obrigatória", {
        description: "Por favor, preencha a hora de início ou marque 'Dia Inteiro'"
      });
      return;
    }

    // Se for dia inteiro, usa 12:00 para evitar problemas de timezone
    const horaInicioFinal = diaInteiro ? "12:00" : horaInicio;
    const horaFimFinal = diaInteiro ? "12:00" : horaFim;

    const dataInicioCompleta = `${dataInicio}T${horaInicioFinal}:00`;
    const dataFimCompleta = dataFim && horaFimFinal ? `${dataFim}T${horaFimFinal}:00` : null;

    try {
      if (editando) {
        await atualizarEvento(
          editando,
          titulo,
          descricao || null,
          dataInicioCompleta,
          dataFimCompleta,
          local || null,
          tipo || null,
          destaque,
          imagemUrl || null,
          cor || null
        );
        toast.success("Evento atualizado!", {
          description: `O evento "${titulo}" foi atualizado com sucesso.`
        });
      } else {
        await criarEvento(
          titulo,
          descricao || null,
          dataInicioCompleta,
          dataFimCompleta,
          local || null,
          tipo || null,
          destaque,
          imagemUrl || null,
          cor || null
        );
        toast.success("Evento criado!", {
          description: `O evento "${titulo}" foi criado com sucesso.`
        });
      }

      // Limpar formulário
      limparFormulario();
      carregarEventos();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast.error("Erro ao salvar evento", {
        description: "Não foi possível salvar o evento. Tente novamente."
      });
    }
  };

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setDataInicio("");
    setHoraInicio("19:00");
    setDataFim("");
    setHoraFim("");
    setLocal("");
    setTipo("");
    setDestaque(false);
    setImagemUrl("");
    setDiaInteiro(false);
    setCor("#3b82f6");
    setEditando(null);
  };

  const handleEditar = (evento: Evento) => {
    setEditando(evento.id);
    setTitulo(evento.titulo);
    setDescricao(evento.descricao || "");

    const dataInicioObj = new Date(evento.data_inicio);
    setDataInicio(dataInicioObj.toISOString().split("T")[0]);
    const horaInicioStr = dataInicioObj.toTimeString().slice(0, 5);
    setHoraInicio(horaInicioStr);

    // Detectar se é dia inteiro (usa 12:00 como marcador)
    const isDiaInteiro = horaInicioStr === "12:00" && evento.data_fim && new Date(evento.data_fim).toTimeString().slice(0, 5) === "12:00";
    setDiaInteiro(isDiaInteiro);

    if (evento.data_fim) {
      const dataFimObj = new Date(evento.data_fim);
      setDataFim(dataFimObj.toISOString().split("T")[0]);
      setHoraFim(dataFimObj.toTimeString().slice(0, 5));
    }

    setLocal(evento.local || "");
    setTipo(evento.tipo || "");
    setDestaque(evento.destaque);
    setImagemUrl(evento.imagem_url || "");
    setCor(evento.cor || "#3b82f6");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletar = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja deletar o evento "${titulo}"?`)) {
      return;
    }

    try {
      await deletarEvento(id);
      toast.success("Evento deletado!", {
        description: `O evento "${titulo}" foi deletado com sucesso.`
      });
      carregarEventos();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      toast.error("Erro ao deletar evento", {
        description: "Não foi possível deletar o evento. Tente novamente."
      });
    }
  };

  const formatarDataHora = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDataHoraEvento = (inicio: string, fim: string | null) => {
    const dataInicio = new Date(inicio);
    const horaInicioStr = dataInicio.toTimeString().slice(0, 5);

    const dataFormatada = dataInicio.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Verificar se é evento de dia inteiro
    let isDiaInteiro = false;

    if (fim) {
      const dataFim = new Date(fim);
      const horaFimStr = dataFim.toTimeString().slice(0, 5);

      // Se os horários são iguais OU ambos são 12:00, é evento de dia inteiro
      if (horaInicioStr === horaFimStr || (horaInicioStr === "12:00" && horaFimStr === "12:00")) {
        isDiaInteiro = true;
      }
    } else if (horaInicioStr === "12:00") {
      // Se não tem fim e início é 12:00, é dia inteiro
      isDiaInteiro = true;
    }

    if (isDiaInteiro) {
      if (fim) {
        const dataFim = new Date(fim);
        const dataFimFormatada = dataFim.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        // Se as datas são diferentes, mostra o período
        if (dataFormatada !== dataFimFormatada) {
          return `${dataFormatada} até ${dataFimFormatada} (Dia inteiro)`;
        }
      }
      return `${dataFormatada} (Dia inteiro)`;
    }

    // Se não é dia inteiro, mostra normalmente
    let resultado = formatarDataHora(inicio);
    if (fim) {
      resultado += ` até ${formatarDataHora(fim)}`;
    }
    return resultado;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Eventos</h1>
        <p className="text-muted-foreground">
          Adicione e gerencie os eventos da igreja
        </p>
      </div>

      {/* Formulário */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {editando ? "Editar Evento" : "Adicionar Novo Evento"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Culto de Celebração"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Detalhes sobre o evento..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="diaInteiro"
                checked={diaInteiro}
                onCheckedChange={(checked) => setDiaInteiro(checked as boolean)}
              />
              <Label htmlFor="diaInteiro" className="cursor-pointer">
                Evento de dia inteiro (sem horário específico)
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="horaInicio">Hora de Início {!diaInteiro && "*"}</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required={!diaInteiro}
                  disabled={diaInteiro}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataFim">Data de Término (opcional)</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horaFim">Hora de Término (opcional)</Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  disabled={diaInteiro}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                type="text"
                placeholder="Ex: Igreja Matriz"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Evento</Label>
              <Input
                id="tipo"
                type="text"
                placeholder="Ex: Culto, Conferência, Retiro"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="imagemUrl">URL da Imagem (opcional)</Label>
              <Input
                id="imagemUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cor">Cor do Evento no Calendário</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="cor"
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">{cor}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Escolha uma cor para identificar este evento no calendário
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="destaque"
                checked={destaque}
                onCheckedChange={(checked) => setDestaque(checked as boolean)}
              />
              <Label htmlFor="destaque" className="cursor-pointer">
                Marcar como evento em destaque
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editando ? "Atualizar" : "Adicionar"}
              </Button>
              {editando && (
                <Button type="button" variant="outline" onClick={limparFormulario}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando...
            </p>
          ) : eventos.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhum evento cadastrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {evento.titulo}
                      </h3>
                      {evento.destaque && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Destaque
                        </span>
                      )}
                    </div>
                    {evento.descricao && (
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                        {evento.descricao}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      📅 {formatarDataHoraEvento(evento.data_inicio, evento.data_fim)}
                    </p>
                    {evento.local && (
                      <p className="text-xs text-muted-foreground">
                        📍 {evento.local}
                      </p>
                    )}
                    {evento.tipo && (
                      <p className="text-xs text-muted-foreground">
                        🏷️ {evento.tipo}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditar(evento)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletar(evento.id, evento.titulo)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminEventos() {
  return (
    <ProtectedAdmin>
      <AdminEventosContent />
    </ProtectedAdmin>
  );
}
