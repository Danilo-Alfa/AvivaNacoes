# ⚡ INÍCIO RÁPIDO - Sistema de Live

**Tempo total:** ~1 hora | **Custo:** R$ 0,00

---

## 📋 O que foi implementado?

✅ Página de Live completa ([src/pages/Live.tsx](src/pages/Live.tsx))
✅ Link no menu lateral (ícone de rádio)
✅ Script de instalação automática do servidor
✅ Guias completos passo a passo

---

## 🚀 3 Passos para ter sua Live funcionando

### PASSO 1: Configurar Servidor (30 min)

**Leia:** [GUIA-CONTABO.md](GUIA-CONTABO.md)

**Resumo:**
1. Criar conta Contabo (€4.50/mês = ~R$ 27/mês)
2. Criar VPS com Ubuntu (4 CPUs + 6GB RAM)
3. Aguardar 5-15 min (email com acesso)
4. Conectar via SSH
5. Executar script: `sudo bash setup-streaming-server.sh`
6. Anotar o IP do servidor

**Resultado:** Servidor de streaming funcionando!

**💡 Por que Contabo?**
- ✅ Disponibilidade imediata (sem depender de sorte)
- ✅ Melhor custo-benefício (R$ 27/mês = menos de R$ 1/dia)
- ✅ 100+ viewers simultâneos
- ✅ Tráfego ilimitado

**🔄 Quer alternativa grátis?**
Veja: [ALTERNATIVAS-SERVIDOR.md](ALTERNATIVAS-SERVIDOR.md) - Oracle Cloud grátis (se conseguir disponibilidade)

---

### PASSO 2: Configurar Site (2 min)

1. Copie o arquivo de configuração:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` e adicione o IP do servidor:
   ```bash
   VITE_STREAM_URL=http://SEU-IP-AQUI/live/stream.m3u8
   ```

3. Teste localmente:
   ```bash
   npm run dev
   ```

4. Acesse: `http://localhost:5173/live`

**Resultado:** Página de live pronta!

---

### PASSO 3: Configurar OBS (15-20 min)

**Leia:** [GUIA-OBS-STUDIO.md](GUIA-OBS-STUDIO.md)

**Resumo:**
1. Baixar OBS: https://obsproject.com/download
2. Configurações → Stream:
   - Serviço: `Custom`
   - Servidor: `rtmp://SEU-IP:1935/live`
   - Chave: `stream`
3. Configurações → Output:
   - Bitrate: `2500 Kbps`
4. Adicionar câmera/microfone
5. Clicar em "Start Streaming"

**Resultado:** Transmitindo ao vivo!

---

## ✅ Checklist Rápido

```
┌─────────────────────────────────────────────┐
│ SERVIDOR (Oracle Cloud)                     │
├─────────────────────────────────────────────┤
│ [ ] Conta criada                            │
│ [ ] VM criada (Ampere A1)                   │
│ [ ] Firewall configurado (portas 80+1935)   │
│ [ ] Script executado                        │
│ [ ] Testado: http://SEU-IP                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ SITE (React)                                │
├─────────────────────────────────────────────┤
│ [ ] Arquivo .env criado                     │
│ [ ] IP configurado                          │
│ [ ] npm run dev funcionando                 │
│ [ ] /live acessível                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ OBS STUDIO                                  │
├─────────────────────────────────────────────┤
│ [ ] OBS instalado                           │
│ [ ] Servidor RTMP configurado               │
│ [ ] Câmera adicionada                       │
│ [ ] Áudio testado                           │
│ [ ] Transmissão iniciada                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TESTE FINAL                                 │
├─────────────────────────────────────────────┤
│ [ ] OBS: "Start Streaming"                  │
│ [ ] Aguardar 10 segundos                    │
│ [ ] Site: aparecer badge "AO VIVO"          │
│ [ ] Vídeo carregando e reproduzindo         │
│ [ ] Áudio funcionando                       │
│ [ ] Testado no celular                      │
└─────────────────────────────────────────────┘
```

---

## 🎯 Teste Rápido (Após Tudo Configurado)

### No OBS:
1. ✅ Clique em "Start Streaming"
2. ✅ Aguarde status ficar verde

### No Navegador:
1. ✅ Acesse: `http://localhost:5173/live` (local)
2. ✅ Ou: `https://seusite.com/live` (produção)
3. ✅ Deve aparecer: Badge vermelho "🔴 AO VIVO"
4. ✅ Vídeo deve carregar em 5-10 segundos

### Em Outro Dispositivo:
1. ✅ Abra o site no celular
2. ✅ Vá em `/live`
3. ✅ Deve funcionar normalmente

---

## 📊 Informações Importantes

### URLs que você vai usar:

```
🖥️  SERVIDOR ORACLE:
    Status:    http://SEU-IP/
    Stream:    http://SEU-IP/live/stream.m3u8
    Stats:     http://SEU-IP/stat

🎥  OBS STUDIO:
    Servidor:  rtmp://SEU-IP:1935/live
    Chave:     stream

🌐  SITE:
    Local:     http://localhost:5173/live
    Produção:  https://seusite.com/live
```

---

## 💡 Dicas Rápidas

### ✅ FAÇA:
- Teste tudo 30 minutos antes da live
- Use cabo de rede (não Wi-Fi)
- Mantenha bitrate em 2000-3000 Kbps
- Feche outros programas durante a live

### ❌ EVITE:
- Wi-Fi durante transmissão
- Bitrate acima de 4000 Kbps
- Múltiplas pessoas usando a internet
- Deixar para testar na hora

---

## 🆘 Problemas Comuns

### "Failed to connect" no OBS
```bash
# Verifique se o Nginx está rodando:
sudo systemctl status nginx

# Teste a porta:
telnet SEU-IP 1935
```

### Stream não aparece no site
```bash
# Verifique se está transmitindo:
curl http://SEU-IP/live/stream.m3u8

# Veja os logs:
sudo tail -f /var/log/nginx/error.log
```

### Vídeo travando
- Reduza bitrate no OBS (2000 Kbps)
- Reduza resolução (720p)
- Teste velocidade: speedtest.net

---

## 📚 Documentação Completa

Para instruções detalhadas:

| Arquivo | O que ensina |
|---------|--------------|
| [STREAMING-README.md](STREAMING-README.md) | Visão geral completa |
| [GUIA-ORACLE-CLOUD.md](GUIA-ORACLE-CLOUD.md) | Configurar servidor |
| [GUIA-OBS-STUDIO.md](GUIA-OBS-STUDIO.md) | Configurar OBS |

---

## 🎬 Fluxo da Transmissão

```
┌──────────────┐
│   Pastor     │  1. Inicia stream no OBS
│  (OBS Studio)│     rtmp://servidor:1935/live
└──────┬───────┘
       │ RTMP
       ↓
┌──────────────┐
│ Oracle Cloud │  2. Recebe RTMP, converte para HLS
│    (Nginx)   │     Gera: stream.m3u8
└──────┬───────┘
       │ HLS
       ↓
┌──────────────┐
│ Site React   │  3. React Player reproduz HLS
│ (react-player)│     Viewers assistem no navegador
└──────────────┘
```

---

## 💰 Custos

```
Oracle Cloud:        R$ 0,00 (Free Forever)
OBS Studio:          R$ 0,00 (Open Source)
Hospedagem Site:     R$ 0,00 (GitHub Pages)
Domínio (opcional):  R$ 40/ano
─────────────────────────────────────────
TOTAL MENSAL:        R$ 0,00 ✨
```

---

## 📱 Recursos da Página /live

✅ Player de vídeo responsivo
✅ Badge "AO VIVO" animado
✅ Contador de viewers
✅ Horários dos cultos
✅ Botões de compartilhamento (WhatsApp)
✅ Funciona em celular/tablet/desktop
✅ Detecção automática de live ativa

---

## 🎓 Próximos Passos (Após Funcionar)

### Básico (Recomendado):
1. Fazer transmissão de teste completa
2. Treinar pastor/operador no OBS
3. Criar backup plan (celular com Larix)
4. Divulgar link nas redes sociais

### Intermediário:
1. Configurar domínio próprio
2. Adicionar HTTPS (Let's Encrypt)
3. Criar templates de cenas no OBS
4. Implementar chat em tempo real

### Avançado:
1. Multi-bitrate (várias qualidades)
2. Sistema de notificações push
3. Gravação automática no servidor
4. Estatísticas de viewers

---

## 🔗 Links Úteis

- [Oracle Cloud Console](https://cloud.oracle.com/)
- [OBS Studio Download](https://obsproject.com/download)
- [Speedtest](https://www.speedtest.net/)
- [VLC Player](https://www.videolan.org/) (para testar stream diretamente)

---

## 📞 Suporte

**Problemas durante implementação?**

1. Verifique os guias detalhados
2. Consulte seção de troubleshooting
3. Verifique logs do servidor
4. Teste conexão de rede

---

## ✨ Funcionalidades Implementadas

### Frontend (React):
- [x] Página `/live` com player
- [x] Detecção automática de live ativa
- [x] Badge "AO VIVO" animado
- [x] Contador de viewers (demo)
- [x] Horários dos cultos
- [x] Botões de compartilhamento
- [x] Design responsivo
- [x] Link no menu lateral

### Backend (Servidor):
- [x] Nginx + RTMP instalado
- [x] Conversão HLS automática
- [x] Página de status
- [x] Estatísticas em tempo real
- [x] CORS configurado
- [x] Systemd service
- [x] Logs configurados

### Documentação:
- [x] Guia Oracle Cloud completo
- [x] Guia OBS Studio completo
- [x] Script de instalação automatizado
- [x] README geral
- [x] Guia de início rápido
- [x] FAQ e troubleshooting

---

**🎉 Tudo pronto! Agora é só seguir os passos e começar a transmitir!**

**Que Deus abençoe suas transmissões! 🙏**

---

**Dúvidas? Comece pelo:** [STREAMING-README.md](STREAMING-README.md)
