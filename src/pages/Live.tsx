import { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Radio, Users, User } from "lucide-react";
import LiveChat from "@/components/LiveChat";
import {
  getLiveConfig,
  gerarSessionId,
  registrarViewer,
  atualizarHeartbeat,
  sairDaLive,
  contarViewersAtivos,
  type LiveConfig,
} from "@/services/liveService";

// Declarar gtag para TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (command: string, ...args: any[]) => void;
  }
}

export default function Live() {
  const [config, setConfig] = useState<LiveConfig | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewers, setViewers] = useState(0);
  const [showMixedContentWarning, setShowMixedContentWarning] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState<number>(0);

  // Estados para verificação de usuário
  const [isRegistered, setIsRegistered] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState<string>("");

  const streamUrl = config?.url_stream || import.meta.env.VITE_STREAM_URL || "";

  // Detectar se está em HTTPS e stream é HTTP (mixed content)
  const isHttps = window.location.protocol === "https:";
  const isStreamHttp = streamUrl.startsWith("http:");

  // Carregar configuração do backend
  useEffect(() => {
    const carregarConfig = async () => {
      try {
        const data = await getLiveConfig();
        setConfig(data);

        // Define se está ao vivo com base na configuração do admin
        if (data) {
          setIsLive(data.ativa);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração da live:", error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    carregarConfig();

    // Atualizar a cada 10 segundos
    const interval = setInterval(carregarConfig, 10000);

    return () => clearInterval(interval);
  }, []);

  // Atualizar contador de viewers reais
  const atualizarContadorViewers = useCallback(async () => {
    if (isLive && isRegistered) {
      const count = await contarViewersAtivos();
      setViewers(count);
    }
  }, [isLive, isRegistered]);

  useEffect(() => {
    if (isLive && isRegistered) {
      atualizarContadorViewers();
      const interval = setInterval(atualizarContadorViewers, 15000); // A cada 15 segundos
      return () => clearInterval(interval);
    }
  }, [isLive, isRegistered, atualizarContadorViewers]);

  // Heartbeat para manter o viewer registrado
  useEffect(() => {
    if (isRegistered && sessionId && isLive) {
      const heartbeatInterval = setInterval(() => {
        atualizarHeartbeat(sessionId);
      }, 30000); // A cada 30 segundos

      return () => clearInterval(heartbeatInterval);
    }
  }, [isRegistered, sessionId, isLive]);

  // Registrar saída quando o usuário fecha a página
  useEffect(() => {
    if (isRegistered && sessionId) {
      const handleBeforeUnload = () => {
        sairDaLive(sessionId);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        sairDaLive(sessionId);
      };
    }
  }, [isRegistered, sessionId]);

  // Função para registrar o usuário
  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      return;
    }

    try {
      const newSessionId = gerarSessionId();
      setSessionId(newSessionId);

      await registrarViewer(newSessionId, nome.trim(), email.trim() || undefined);
      setIsRegistered(true);

      // Salvar nome no localStorage para próximas visitas
      localStorage.setItem("live_viewer_nome", nome.trim());
      if (email.trim()) {
        localStorage.setItem("live_viewer_email", email.trim());
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  };

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedNome = localStorage.getItem("live_viewer_nome");
    const savedEmail = localStorage.getItem("live_viewer_email");

    if (savedNome) {
      setNome(savedNome);
    }
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Google Analytics - Rastrear quando usuário começa a assistir
  useEffect(() => {
    if (isLive && !isWatching) {
      setIsWatching(true);
      setWatchStartTime(Date.now());

      // Enviar evento: Usuário começou a assistir
      if (window.gtag) {
        window.gtag('event', 'live_stream_start', {
          event_category: 'Live Stream',
          event_label: 'User started watching',
          value: 1
        });
      }
    }
  }, [isLive, isWatching]);

  // Google Analytics - Rastrear quando usuário para de assistir
  useEffect(() => {
    return () => {
      if (isWatching && watchStartTime > 0) {
        const watchDuration = Math.floor((Date.now() - watchStartTime) / 1000); // em segundos

        // Enviar evento: Usuário parou de assistir + tempo assistido
        if (window.gtag) {
          window.gtag('event', 'live_stream_end', {
            event_category: 'Live Stream',
            event_label: 'User stopped watching',
            value: watchDuration
          });
        }
      }
    };
  }, [isWatching, watchStartTime]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verificando transmissão...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário de registro quando a live está ativa mas usuário não está registrado
  if (isLive && !isRegistered) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Bem-vindo(a) a Live!</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Para assistir a transmissão, por favor informe seus dados
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistrar} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usado apenas para notificações futuras
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Radio className="w-4 h-4 mr-2" />
                Assistir Live
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg flex items-center gap-3">
              <Badge
                variant="destructive"
                className="animate-pulse gap-1.5"
                style={{ backgroundColor: config?.cor_badge || "#ef4444" }}
              >
                <Radio className="h-3 w-3" />
                AO VIVO
              </Badge>
              <span className="text-sm font-medium">
                {config?.titulo || "Transmissão ao Vivo"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Layout com Chat quando ao vivo */}
      {isLive && isRegistered ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      {config?.titulo || "Transmissão ao Vivo"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config?.descricao || "Assista aos cultos e eventos da Igreja Aviva"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {config?.mostrar_contador_viewers && (
                      <Badge variant="secondary" className="gap-1.5">
                        <Users className="h-3 w-3" />
                        {viewers} assistindo
                      </Badge>
                    )}
                    <Badge variant="outline" className="gap-1.5">
                      <User className="h-3 w-3" />
                      {nome}
                    </Badge>
                    <Badge
                      variant="destructive"
                      className="animate-pulse gap-1.5"
                      style={{ backgroundColor: config?.cor_badge || "#ef4444" }}
                    >
                      <Radio className="h-3 w-3" />
                      AO VIVO
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Alerta de Mixed Content */}
                {showMixedContentWarning && isHttps && isStreamHttp && (
                  <Alert variant="destructive">
                    <AlertDescription className="space-y-3">
                      <p className="font-semibold">Conteudo bloqueado pelo navegador</p>
                      <p className="text-sm">
                        O navegador está bloqueando a transmissão porque o site usa HTTPS mas o servidor de streaming usa HTTP.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-semibold">Como permitir:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li><strong>Chrome/Edge:</strong> Clique no ícone de cadeado na barra de endereços - Configuracoes do site - Em Conteudo inseguro, selecione Permitir</li>
                          <li><strong>Firefox:</strong> Clique no ícone de escudo à esquerda da barra - Desative Protecao aprimorada contra rastreamento para este site</li>
                          <li><strong>Safari:</strong> Vá em Preferências - Seguranca - Desmarque Avisar ao visitar um site fraudulento</li>
                        </ol>
                        <p className="mt-2">Após permitir, recarregue a página (F5).</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <ReactPlayer
                    src={streamUrl}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    config={{
                      hls: {
                        enableWorker: true,
                        lowLatencyMode: true,
                        maxBufferLength: 10,
                        maxMaxBufferLength: 30,
                      },
                    }}
                    controlsList="nodownload"
                    onError={(e) => {
                      console.error("Erro no player:", e);
                      setIsLive(false);
                    }}
                  />
                </div>

                <Alert>
                  <Radio className="h-4 w-4" />
                  <AlertDescription>
                    Transmissão ao vivo ativa. Se houver problemas de reprodução,
                    tente recarregar a página ou verificar sua conexão com a internet.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Coluna lateral - Chat */}
          <div className="lg:col-span-1 h-[600px]">
            <LiveChat
              sessionId={sessionId}
              nome={nome}
              email={email}
              isLive={isLive}
            />
          </div>
        </div>
      ) : (
        /* Layout sem chat quando offline */
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {config?.titulo || "Transmissão ao Vivo"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {config?.descricao || "Assista aos cultos e eventos da Igreja Aviva"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mb-4">
                  <Radio className="h-16 w-16 mx-auto text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {config?.mensagem_offline?.split(".")[0] || "Nenhuma transmissão ao vivo no momento"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {config?.mensagem_offline || "Fique atento aos nossos horários de culto e eventos especiais!"}
                </p>

                {config?.proxima_live_titulo && config?.proxima_live_data && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-primary mb-2">📅 Próxima Transmissão:</h4>
                    <p className="font-semibold">{config.proxima_live_titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(config.proxima_live_data).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {config.proxima_live_descricao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.proxima_live_descricao}
                      </p>
                    )}
                  </div>
                )}
                <div className="bg-background rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold mb-3">Horários dos Cultos:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex justify-between">
                      <span>Segunda (Noite):</span>
                      <span className="font-medium">Após live do Youtube</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quarta (Noite):</span>
                      <span className="font-medium">Após live do Youtube</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sexta (Noite):</span>
                      <span className="font-medium">Após live do Youtube</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sabado (Noite):</span>
                      <span className="font-medium">Após live do Youtube</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Seção de informações adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximas Transmissões</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Domingo - Culto de Celebração - 10:00h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Domingo - Culto da Família - 18:00h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Quarta - Culto de Doutrina - 19:30h</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compartilhe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Convide seus amigos e familiares para assistirem conosco!
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=Assista%20a%20live%20da%20Igreja%20Aviva%20${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copiado!");
                      }}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                    >
                      Copiar Link
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
