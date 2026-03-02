import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  deletarMensagem,
  getTodasMensagens,
  marcarComoLida,
  type MensagemContato,
} from "@/services/contatoService";
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Phone,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Reply,
} from "lucide-react";
import { useEffect, useState } from "react";

type Filtro = "todas" | "nao_lidas" | "lidas";

export default function AdminMensagensContent() {
  const [mensagens, setMensagens] = useState<MensagemContato[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");
  const [expandida, setExpandida] = useState<string | null>(null);

  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    try {
      setLoading(true);
      const data = await getTodasMensagens();
      setMensagens(data);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast.error("Erro ao carregar mensagens", {
        description:
          "Não foi possível carregar as mensagens. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarComoLida = async (id: string) => {
    try {
      await marcarComoLida(id);
      setMensagens((prev) =>
        prev.map((m) => (m.id === id ? { ...m, lida: true } : m))
      );
      toast.success("Mensagem marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      toast.error("Erro ao atualizar mensagem");
    }
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar a mensagem de "${nome}"?`)) {
      return;
    }

    try {
      await deletarMensagem(id);
      setMensagens((prev) => prev.filter((m) => m.id !== id));
      if (expandida === id) setExpandida(null);
      toast.success("Mensagem deletada!", {
        description: `A mensagem de "${nome}" foi deletada.`,
      });
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      toast.error("Erro ao deletar mensagem", {
        description: "Não foi possível deletar a mensagem. Tente novamente.",
      });
    }
  };

  const toggleExpandir = (id: string) => {
    setExpandida((prev) => (prev === id ? null : id));
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const naoLidas = mensagens.filter((m) => !m.lida).length;

  const mensagensFiltradas = mensagens.filter((m) => {
    const passaFiltro =
      filtro === "todas" ||
      (filtro === "nao_lidas" && !m.lida) ||
      (filtro === "lidas" && m.lida);

    const passaBusca =
      !busca ||
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.assunto.toLowerCase().includes(busca.toLowerCase()) ||
      m.email.toLowerCase().includes(busca.toLowerCase());

    return passaFiltro && passaBusca;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mensagens - Fale Conosco</h1>
        <p className="text-muted-foreground">
          Gerencie as mensagens recebidas pelo formulário de contato
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{mensagens.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{naoLidas}</p>
            <p className="text-xs text-muted-foreground">Não lidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {mensagens.length - naoLidas}
            </p>
            <p className="text-xs text-muted-foreground">Lidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, assunto ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filtro === "todas" ? "default" : "outline"}
                onClick={() => setFiltro("todas")}
              >
                Todas
              </Button>
              <Button
                size="sm"
                variant={filtro === "nao_lidas" ? "default" : "outline"}
                onClick={() => setFiltro("nao_lidas")}
              >
                Não lidas {naoLidas > 0 && `(${naoLidas})`}
              </Button>
              <Button
                size="sm"
                variant={filtro === "lidas" ? "default" : "outline"}
                onClick={() => setFiltro("lidas")}
              >
                Lidas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>
            Mensagens Recebidas ({mensagensFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">
              Carregando...
            </p>
          ) : mensagensFiltradas.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {busca || filtro !== "todas"
                ? "Nenhuma mensagem encontrada com esses filtros"
                : "Nenhuma mensagem recebida ainda"}
            </p>
          ) : (
            <div className="space-y-3">
              {mensagensFiltradas.map((msg) => (
                <div
                  key={msg.id}
                  className={`border rounded-lg transition-colors ${
                    !msg.lida
                      ? "bg-primary/5 border-primary/20"
                      : "hover:bg-accent/50"
                  }`}
                >
                  {/* Header da mensagem */}
                  <div
                    className="flex items-start gap-4 p-4 cursor-pointer"
                    onClick={() => toggleExpandir(msg.id)}
                  >
                    {msg.lida ? (
                      <MailOpen className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    ) : (
                      <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {msg.assunto}
                        </h3>
                        {!msg.lida && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded flex-shrink-0">
                            Nova
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <User className="w-3 h-3 inline mr-1" />
                        {msg.nome} &bull; {msg.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatarData(msg.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {expandida === msg.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {expandida === msg.id && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-3">
                        {/* Info do remetente */}
                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{msg.nome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-primary hover:underline"
                            >
                              {msg.email}
                            </a>
                          </div>
                          {msg.telefone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{msg.telefone}</span>
                            </div>
                          )}
                        </div>

                        {/* Mensagem */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.mensagem}
                          </p>
                        </div>

                        {/* Ações */}
                        <div className="flex gap-2 pt-2">
                          <a href={`mailto:${msg.email}?subject=Re: ${msg.assunto}`}>
                            <Button size="sm" variant="outline">
                              <Reply className="w-4 h-4 mr-1" />
                              Responder
                            </Button>
                          </a>
                          {!msg.lida && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarcarComoLida(msg.id)}
                            >
                              <MailOpen className="w-4 h-4 mr-1" />
                              Marcar como lida
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletar(msg.id, msg.nome)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Deletar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

