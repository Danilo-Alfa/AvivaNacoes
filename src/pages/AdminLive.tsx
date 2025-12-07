import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Radio, Power, PowerOff, Clock, Users, RefreshCw, User, Mail, Monitor } from "lucide-react";
import ProtectedAdmin from "@/components/ProtectedAdmin";
import { toast } from "@/components/ui/sonner";
import {
  getLiveConfig,
  atualizarLiveConfig,
  ligarLive,
  desligarLive,
  getViewersAtivos,
  getTodosViewers,
  limparViewersInativos,
  type LiveConfig,
  type LiveViewer,
} from "@/services/liveService";

function AdminLiveContent() {
  const [config, setConfig] = useState<LiveConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Viewers
  const [viewers, setViewers] = useState<LiveViewer[]>([]);
  const [viewersAtivos, setViewersAtivos] = useState<LiveViewer[]>([]);
  const [mostrarTodosViewers, setMostrarTodosViewers] = useState(false);
  const [loadingViewers, setLoadingViewers] = useState(false);

  // Formulário
  const [ativa, setAtiva] = useState(false);
  const [urlStream, setUrlStream] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagemOffline, setMensagemOffline] = useState("");
  const [proximaLiveTitulo, setProximaLiveTitulo] = useState("");
  const [proximaLiveData, setProximaLiveData] = useState("");
  const [proximaLiveHora, setProximaLiveHora] = useState("10:00");
  const [proximaLiveDescricao, setProximaLiveDescricao] = useState("");
  const [mostrarContadorViewers, setMostrarContadorViewers] = useState(true);
  const [corBadge, setCorBadge] = useState("#ef4444");

  const carregarViewers = useCallback(async () => {
    setLoadingViewers(true);
    try {
      const [ativos, todos] = await Promise.all([
        getViewersAtivos(),
        getTodosViewers(),
      ]);
      setViewersAtivos(ativos);
      setViewers(todos);
    } catch (error) {
      console.error("Erro ao carregar viewers:", error);
    } finally {
      setLoadingViewers(false);
    }
  }, []);

  useEffect(() => {
    carregarConfig();
    carregarViewers();

    // Atualizar viewers a cada 30 segundos
    const interval = setInterval(carregarViewers, 30000);
    return () => clearInterval(interval);
  }, [carregarViewers]);

  const handleLimparInativos = async () => {
    try {
      await limparViewersInativos();
      toast.success("Viewers inativos removidos!");
      carregarViewers();
    } catch (error) {
      console.error("Erro ao limpar viewers:", error);
      toast.error("Erro ao limpar viewers inativos");
    }
  };

  const carregarConfig = async () => {
    try {
      setLoading(true);
      const data = await getLiveConfig();

      if (data) {
        setConfig(data);
        setAtiva(data.ativa);
        // Se não tiver URL no banco, usa a do .env como padrão
        setUrlStream(data.url_stream || import.meta.env.VITE_STREAM_URL || "");
        setTitulo(data.titulo);
        setDescricao(data.descricao || "");
        setMensagemOffline(data.mensagem_offline);
        setProximaLiveTitulo(data.proxima_live_titulo || "");
        setProximaLiveDescricao(data.proxima_live_descricao || "");
        setMostrarContadorViewers(data.mostrar_contador_viewers);
        setCorBadge(data.cor_badge);

        if (data.proxima_live_data) {
          const dataObj = new Date(data.proxima_live_data);
          setProximaLiveData(dataObj.toISOString().split("T")[0]);
          setProximaLiveHora(dataObj.toTimeString().slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
      toast.error("Erro ao carregar configuração", {
        description: "Não foi possível carregar as configurações da live. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLigarLive = async () => {
    if (!urlStream) {
      toast.error("URL do stream obrigatória", {
        description: "Por favor, preencha a URL do stream antes de ligar a live.",
      });
      return;
    }

    try {
      await ligarLive(urlStream, titulo, descricao || null);
      toast.success("Live ligada!", {
        description: "A transmissão ao vivo está agora ativa na página pública.",
      });
      carregarConfig();
    } catch (error) {
      console.error("Erro ao ligar live:", error);
      toast.error("Erro ao ligar live", {
        description: "Não foi possível ativar a transmissão. Tente novamente.",
      });
    }
  };

  const handleDesligarLive = async () => {
    try {
      await desligarLive();
      toast.success("Live desligada!", {
        description: "A transmissão ao vivo foi desativada.",
      });
      carregarConfig();
    } catch (error) {
      console.error("Erro ao desligar live:", error);
      toast.error("Erro ao desligar live", {
        description: "Não foi possível desativar a transmissão. Tente novamente.",
      });
    }
  };

  const handleSalvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !mensagemOffline) {
      toast.error("Campos obrigatórios faltando", {
        description: "Por favor, preencha título e mensagem offline",
      });
      return;
    }

    const proximaLiveDataCompleta =
      proximaLiveData && proximaLiveHora
        ? `${proximaLiveData}T${proximaLiveHora}:00`
        : null;

    try {
      await atualizarLiveConfig(
        ativa,
        urlStream || null,
        titulo,
        descricao || null,
        mensagemOffline,
        proximaLiveTitulo || null,
        proximaLiveDataCompleta,
        proximaLiveDescricao || null,
        mostrarContadorViewers,
        corBadge
      );

      toast.success("Configurações salvas!", {
        description: "As configurações da live foram atualizadas com sucesso.",
      });

      carregarConfig();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações", {
        description: "Não foi possível salvar as configurações. Tente novamente.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Transmissão ao Vivo</h1>
        <p className="text-muted-foreground">
          Controle a transmissão ao vivo e configure as informações exibidas
        </p>
      </div>

      {/* Controle Rápido - Ligar/Desligar Live */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Controle da Transmissão
          </CardTitle>
          <CardDescription>
            Ligue ou desligue a transmissão ao vivo rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  ativa ? "bg-red-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              <div>
                <p className="font-semibold">
                  Status: {ativa ? "AO VIVO" : "Offline"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ativa ? "Transmissão ativa" : "Nenhuma transmissão no momento"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!ativa ? (
                <Button onClick={handleLigarLive} className="gap-2">
                  <Power className="w-4 h-4" />
                  Ligar Live
                </Button>
              ) : (
                <Button onClick={handleDesligarLive} variant="destructive" className="gap-2">
                  <PowerOff className="w-4 h-4" />
                  Desligar Live
                </Button>
              )}
            </div>
          </div>

          {ativa && urlStream && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400 mb-2 font-semibold">
                ✅ Live ativa no site
              </p>
              <p className="text-xs text-muted-foreground">
                Os visitantes podem assistir em:{" "}
                <a
                  href="/AvivaNacoes/live"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  /live
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Viewers */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Viewers da Live
              </CardTitle>
              <CardDescription>
                Pessoas que estão ou estiveram assistindo a transmissão
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={carregarViewers}
                disabled={loadingViewers}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loadingViewers ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLimparInativos}
              >
                Limpar Inativos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {viewersAtivos.length}
              </p>
              <p className="text-sm text-muted-foreground">Assistindo agora</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{viewers.length}</p>
              <p className="text-sm text-muted-foreground">Total registrados</p>
            </div>
          </div>

          {/* Toggle para mostrar todos */}
          <div className="flex items-center gap-2 mb-4">
            <Switch
              id="mostrarTodos"
              checked={mostrarTodosViewers}
              onCheckedChange={setMostrarTodosViewers}
            />
            <Label htmlFor="mostrarTodos" className="cursor-pointer">
              Mostrar todos os viewers (incluindo inativos)
            </Label>
          </div>

          {/* Lista de Viewers */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-1">Status</div>
                <div className="col-span-3">Nome</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Entrou em</div>
                <div className="col-span-3">Ultima atividade</div>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {(mostrarTodosViewers ? viewers : viewersAtivos).length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  {mostrarTodosViewers
                    ? "Nenhum viewer registrado ainda"
                    : "Nenhum viewer assistindo no momento"}
                </div>
              ) : (
                (mostrarTodosViewers ? viewers : viewersAtivos).map((viewer) => {
                  const isAtivo =
                    viewer.assistindo &&
                    new Date(viewer.ultima_atividade) >
                      new Date(Date.now() - 2 * 60 * 1000);

                  return (
                    <div
                      key={viewer.id}
                      className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/30"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center text-sm">
                        <div className="col-span-1">
                          {isAtivo ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              Online
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Offline
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium truncate">
                            {viewer.nome || "Anonimo"}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">
                            {viewer.email || "-"}
                          </span>
                        </div>
                        <div className="col-span-2 text-muted-foreground text-xs">
                          {new Date(viewer.entrou_em).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="col-span-3 text-muted-foreground text-xs flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {new Date(viewer.ultima_atividade).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Atualiza automaticamente a cada 30 segundos. Viewers sao considerados inativos apos 2 minutos sem atividade.
          </p>
        </CardContent>
      </Card>

      {/* Formulário de Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Live</CardTitle>
          <CardDescription>
            Configure os detalhes da transmissão e mensagens exibidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvarConfig} className="space-y-6">
            {/* URL do Stream */}
            <div className="space-y-2">
              <Label htmlFor="urlStream">URL do Stream *</Label>
              <Input
                id="urlStream"
                value={urlStream}
                onChange={(e) => setUrlStream(e.target.value)}
                placeholder="https://seu-servidor.com/live/stream.m3u8"
              />
              <p className="text-xs text-muted-foreground">
                URL do stream HLS (.m3u8), RTMP ou link do YouTube
              </p>
            </div>

            {/* Título da Live */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da Live *</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Culto de Domingo - Ao Vivo"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição da Live</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição que aparece enquanto a live está ativa..."
                rows={3}
              />
            </div>

            {/* Mensagem Offline */}
            <div className="space-y-2">
              <Label htmlFor="mensagemOffline">Mensagem Offline *</Label>
              <Textarea
                id="mensagemOffline"
                value={mensagemOffline}
                onChange={(e) => setMensagemOffline(e.target.value)}
                placeholder="Mensagem exibida quando a live está desligada..."
                rows={2}
                required
              />
            </div>

            {/* Próxima Live Agendada */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Próxima Live Agendada (Opcional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proximaLiveTitulo">Título da Próxima Live</Label>
                  <Input
                    id="proximaLiveTitulo"
                    value={proximaLiveTitulo}
                    onChange={(e) => setProximaLiveTitulo(e.target.value)}
                    placeholder="Ex: Culto de Domingo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="proximaLiveData">Data</Label>
                    <Input
                      id="proximaLiveData"
                      type="date"
                      value={proximaLiveData}
                      onChange={(e) => setProximaLiveData(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proximaLiveHora">Hora</Label>
                    <Input
                      id="proximaLiveHora"
                      type="time"
                      value={proximaLiveHora}
                      onChange={(e) => setProximaLiveHora(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="proximaLiveDescricao">Descrição</Label>
                  <Textarea
                    id="proximaLiveDescricao"
                    value={proximaLiveDescricao}
                    onChange={(e) => setProximaLiveDescricao(e.target.value)}
                    placeholder="Ex: Culto de Celebração - 10:00h"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Configurações Visuais */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Configurações Visuais</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mostrarContadorViewers">
                      Mostrar Contador de Viewers
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Exibe quantas pessoas estão assistindo (simulado)
                    </p>
                  </div>
                  <Switch
                    id="mostrarContadorViewers"
                    checked={mostrarContadorViewers}
                    onCheckedChange={setMostrarContadorViewers}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corBadge">Cor do Badge "AO VIVO"</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="corBadge"
                      type="color"
                      value={corBadge}
                      onChange={(e) => setCorBadge(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={corBadge}
                      onChange={(e) => setCorBadge(e.target.value)}
                      placeholder="#ef4444"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <Button type="submit" className="w-full">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">ℹ️ Informações</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Última atualização:</strong>{" "}
            {config?.updated_at
              ? new Date(config.updated_at).toLocaleString("pt-BR")
              : "Nunca"}
          </p>
          <p>
            <strong>Página pública:</strong>{" "}
            <a href="/AvivaNacoes/live" target="_blank" className="text-primary hover:underline">
              /AvivaNacoes/live
            </a>
          </p>
          <p className="text-xs pt-2 border-t">
            💡 <strong>Dica:</strong> Use o botão "Ligar Live" para ativar rapidamente a
            transmissão. As configurações podem ser editadas a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLive() {
  return (
    <ProtectedAdmin>
      <AdminLiveContent />
    </ProtectedAdmin>
  );
}
