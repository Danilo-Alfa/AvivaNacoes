import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Users, Loader2 } from "lucide-react";
import { chatClient, type ChatMensagem } from "@/services/chatService";

const PALAVRAS_PROIBIDAS = [
  "puta", "puto", "viado", "buceta", "pau", "piroca", "cu", "merda",
  "filho da puta", "fdp", "vadia", "vagabunda", "vagabundo", "corno",
  "caralho", "porra", "foda", "foder", "desgraça", "lixo",
  "nazi", "nazista", "racista", "negro", "nigga",
  "shit", "fuck", "ass", "bitch", "damn",
];

function validarNome(nome: string): string | null {
  const n = nome.trim();
  if (n.length < 2) return "Nome deve ter pelo menos 2 caracteres.";
  if (n.length > 50) return "Nome muito longo.";
  if (/^[\d\s\W]+$/.test(n)) return "Nome deve conter letras.";
  const lower = n.toLowerCase();
  for (const palavra of PALAVRAS_PROIBIDAS) {
    if (lower.includes(palavra)) return "Nome não permitido.";
  }
  return null;
}

interface LiveChatProps {
  sessionId: string;
  nome: string;
  email?: string;
  isLive: boolean;
  onNomeSet?: (nome: string) => void;
}

export default function LiveChat({
  sessionId,
  nome,
  email,
  isLive,
  onNomeSet,
}: LiveChatProps) {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [usersOnline, setUsersOnline] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [digitando, setDigitando] = useState<string[]>([]);
  const [nomeInput, setNomeInput] = useState("");
  const [nomeError, setNomeError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const digitandoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrar apenas mensagens de hoje
  const filtrarMensagensDeHoje = useCallback((msgs: ChatMensagem[]) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return msgs.filter((msg) => new Date(msg.created_at) >= hoje);
  }, []);

  // Auto scroll para última mensagem
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [mensagens, scrollToBottom]);

  // Conectar ao chat
  useEffect(() => {
    if (!isLive || !sessionId) return;

    setIsConnecting(true);

    // Handlers de eventos
    const handleMensagem = (msg: ChatMensagem) => {
      setMensagens((prev) => [...prev, msg]);
    };

    const handleMensagensAnteriores = (msgs: ChatMensagem[]) => {
      setMensagens(filtrarMensagensDeHoje(msgs));
    };

    const handleUsersOnline = (count: number) => {
      setUsersOnline(count);
    };

    const handleUsuarioDigitando = (data: { nome: string }) => {
      if (data.nome !== nome) {
        setDigitando((prev) =>
          prev.includes(data.nome) ? prev : [...prev, data.nome]
        );
      }
    };

    const handleUsuarioParouDigitar = (data: { nome: string }) => {
      setDigitando((prev) => prev.filter((n) => n !== data.nome));
    };

    const handleMensagemDeletada = (data: { mensagemId: string }) => {
      setMensagens((prev) => prev.filter((m) => m.id !== data.mensagemId));
    };

    const handleChatLimpo = () => {
      setMensagens([]);
    };

    const handleConectado = () => {
      setIsConnected(true);
      setIsConnecting(false);
    };

    const handleDesconectado = () => {
      setIsConnected(false);
    };

    // Registrar handlers
    chatClient.on("conectado", handleConectado);
    chatClient.on("mensagem", handleMensagem);
    chatClient.on("mensagens_anteriores", handleMensagensAnteriores);
    chatClient.on("users_online", handleUsersOnline);
    chatClient.on("usuario_digitando", handleUsuarioDigitando);
    chatClient.on("usuario_parou_digitar", handleUsuarioParouDigitar);
    chatClient.on("mensagem_deletada", handleMensagemDeletada);
    chatClient.on("chat_limpo", handleChatLimpo);
    chatClient.on("desconectado", handleDesconectado);

    // Conectar
    chatClient.connect(sessionId, nome, email);

    // Verificar conexão após um tempo
    const checkConnection = setTimeout(() => {
      setIsConnected(chatClient.isConnected());
      setIsConnecting(false);
    }, 2000);

    // Reconnect when tab becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden && !chatClient.isConnected()) {
        setIsConnecting(true);
        chatClient.connect(sessionId, nome, email);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(checkConnection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Limpar timeout de digitação para evitar memory leak
      if (digitandoTimeoutRef.current) {
        clearTimeout(digitandoTimeoutRef.current);
      }
      chatClient.off("conectado", handleConectado);
      chatClient.off("mensagem", handleMensagem);
      chatClient.off("mensagens_anteriores", handleMensagensAnteriores);
      chatClient.off("users_online", handleUsersOnline);
      chatClient.off("usuario_digitando", handleUsuarioDigitando);
      chatClient.off("usuario_parou_digitar", handleUsuarioParouDigitar);
      chatClient.off("mensagem_deletada", handleMensagemDeletada);
      chatClient.off("chat_limpo", handleChatLimpo);
      chatClient.off("desconectado", handleDesconectado);
      chatClient.disconnect();
    };
  }, [isLive, sessionId, nome, email, filtrarMensagensDeHoje]);

  const handleNomeSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const erro = validarNome(nomeInput);
    if (erro) {
      setNomeError(erro);
      return;
    }
    setNomeError("");
    onNomeSet?.(nomeInput.trim());
  }, [nomeInput, onNomeSet]);

  // Enviar mensagem
  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaMensagem.trim() || !isConnected) return;

    chatClient.enviarMensagem(novaMensagem.trim());
    setNovaMensagem("");
    chatClient.parouDigitar();

    inputRef.current?.focus();
  };

  // Indicador de digitação
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovaMensagem(e.target.value);

    // Emitir que está digitando
    chatClient.digitando();

    // Limpar timeout anterior
    if (digitandoTimeoutRef.current) {
      clearTimeout(digitandoTimeoutRef.current);
    }

    // Parar de digitar após 2 segundos sem atividade
    digitandoTimeoutRef.current = setTimeout(() => {
      chatClient.parouDigitar();
    }, 2000);
  };

  // Formatar hora da mensagem
  const formatarHora = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLive) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat ao Vivo
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {usersOnline}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        {/* Status de conexão */}
        {isConnecting && (
          <div className="p-3 bg-muted/50 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Conectando ao chat...
          </div>
        )}

        {!isConnecting && !isConnected && (
          <div className="p-3 bg-destructive/10 text-center text-sm text-destructive">
            Não foi possível conectar ao chat. Tente recarregar a página.
          </div>
        )}

        {/* Área de mensagens */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {mensagens.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                Seja o primeiro a enviar uma mensagem!
              </p>
            ) : (
              mensagens.map((msg) => {
                const isOwnMessage = msg.session_id === sessionId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-semibold mb-1 opacity-80">
                          {msg.nome}
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.mensagem}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatarHora(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Indicador de digitação */}
            {digitando.length > 0 && (
              <div className="text-xs text-muted-foreground italic">
                {digitando.length === 1
                  ? `${digitando[0]} está digitando...`
                  : `${digitando.slice(0, 2).join(", ")}${digitando.length > 2 ? ` e mais ${digitando.length - 2}` : ""} estão digitando...`}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        {nome ? (
          <form
            onSubmit={handleEnviar}
            className="p-3 border-t flex gap-2"
          >
            <Input
              ref={inputRef}
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={handleInputChange}
              maxLength={500}
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!novaMensagem.trim() || !isConnected}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <div className="border-t">
            <div className="bg-muted/50 px-3 py-2.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-sm">Para enviar mensagens, informe seu nome:</span>
            </div>
            {nomeError && (
              <p className="text-xs text-destructive px-3 pt-1.5">{nomeError}</p>
            )}
            <form
              onSubmit={handleNomeSubmit}
              className="p-3 flex gap-2"
            >
              <Input
                placeholder="Digite seu nome..."
                value={nomeInput}
                onChange={(e) => { setNomeInput(e.target.value); setNomeError(""); }}
                maxLength={50}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!nomeInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
