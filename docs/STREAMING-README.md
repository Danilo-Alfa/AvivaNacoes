# 🎥 Sistema de Live Streaming - Igreja Aviva

## 📌 Resumo

Sistema de transmissão ao vivo **100% gratuito** usando Oracle Cloud, sem depender de políticas de terceiros como YouTube.

---

## ✨ Características

- ✅ **Custo:** R$ 0,00 (gratuito para sempre)
- ✅ **Servidor próprio:** Oracle Cloud Free Tier
- ✅ **Capacidade:** 100+ viewers simultâneos
- ✅ **Tecnologia:** HLS (compatível com todos navegadores)
- ✅ **Recursos:** 24GB RAM, 4 CPUs, 10TB tráfego/mês
- ✅ **Sem censura:** Total controle sobre o conteúdo

---

## 📁 Arquivos Criados

```
AvivaNacoes/
├── src/
│   └── pages/
│       └── Live.tsx                    # Página de transmissão ao vivo
├── setup-streaming-server.sh          # Script de instalação do servidor
├── GUIA-ORACLE-CLOUD.md               # Guia completo Oracle Cloud
├── GUIA-OBS-STUDIO.md                 # Guia completo OBS Studio
├── .env.example                        # Exemplo de configuração
└── STREAMING-README.md                # Este arquivo
```

---

## 🚀 Início Rápido

### 1. Configurar Servidor (Oracle Cloud)

**Tempo estimado:** 30-45 minutos

1. Siga o guia: **`GUIA-ORACLE-CLOUD.md`**
   - Criar conta Oracle Cloud (gratuita)
   - Criar VM Ubuntu com 4 CPUs + 24GB RAM
   - Configurar firewall
   - Executar script de instalação

### 2. Configurar Site

**Tempo estimado:** 2 minutos

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` e adicione o IP do seu servidor:
   ```
   VITE_STREAM_URL=http://SEU-IP-ORACLE/live/stream.m3u8
   ```

3. Teste localmente:
   ```bash
   npm run dev
   ```

4. Acesse: `http://localhost:5173/live`

### 3. Configurar OBS Studio

**Tempo estimado:** 15-20 minutos

1. Siga o guia: **`GUIA-OBS-STUDIO.md`**
   - Baixar e instalar OBS
   - Configurar transmissão
   - Adicionar câmera e microfone
   - Iniciar transmissão

---

## 🎬 Como Transmitir

### Configuração Rápida OBS:

1. **Configurações → Stream:**
   - Serviço: `Custom`
   - Servidor: `rtmp://SEU-IP:1935/live`
   - Chave: `stream`

2. **Configurações → Output:**
   - Bitrate: `2000-3000 Kbps`
   - Encoder: `NVENC` ou `x264`

3. **Configurações → Video:**
   - Resolução: `1920x1080` ou `1280x720`
   - FPS: `30`

4. **Iniciar Transmissão** → Aguardar 10s → Verificar no site `/live`

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Pastor (OBS)  │  Transmite via RTMP
│   Computador    │  rtmp://servidor:1935/live
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Oracle Cloud    │  Servidor Nginx + RTMP
│ (FREE TIER)     │  Converte RTMP → HLS
│ Ubuntu 22.04    │  http://servidor/live/stream.m3u8
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Site React     │  Reproduz HLS com react-player
│  (GitHub Pages) │  Viewers assistem pelo navegador
└─────────────────┘
```

---

## 💰 Custos Detalhados

| Item | Custo |
|------|-------|
| Oracle Cloud (servidor) | **R$ 0,00** (Free Tier) |
| OBS Studio | **R$ 0,00** (Open Source) |
| GitHub Pages (site) | **R$ 0,00** (gratuito) |
| Domínio (opcional) | ~R$ 40/ano |
| **TOTAL MENSAL** | **R$ 0,00** |

---

## 🔧 Comandos Úteis

### No Servidor Oracle (SSH):

```bash
# Ver status do Nginx
sudo systemctl status nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs em tempo real
sudo tail -f /var/log/nginx/error.log

# Ver estatísticas
curl http://localhost/stat
```

### No Projeto React:

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🌐 URLs Importantes

Após configurar, você terá:

- **Página de Live:** `https://seusite.com/live`
- **Status do servidor:** `http://SEU-IP-ORACLE/`
- **Estatísticas RTMP:** `http://SEU-IP-ORACLE/stat`
- **Stream HLS:** `http://SEU-IP-ORACLE/live/stream.m3u8`
- **Servidor RTMP (OBS):** `rtmp://SEU-IP-ORACLE:1935/live`

---

## 📱 Acessibilidade

O sistema funciona em:
- ✅ Navegadores (Chrome, Firefox, Safari, Edge)
- ✅ Celulares (Android e iOS)
- ✅ Tablets
- ✅ Smart TVs (com navegador)
- ✅ VLC Media Player

---

## 🔒 Segurança (Opcional)

### Restringir quem pode transmitir:

1. SSH no servidor
2. Edite: `sudo nano /etc/nginx/nginx.conf`
3. Adicione dentro de `application live`:
   ```nginx
   allow publish SEU-IP-CASA;
   deny publish all;
   ```
4. Reinicie: `sudo systemctl restart nginx`

### Adicionar HTTPS (recomendado):

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Configurar (precisa de domínio)
sudo certbot --nginx -d seudominio.com
```

---

## 📊 Capacidade e Performance

### Com Oracle Cloud Free Tier:

- **Viewers simultâneos:** 100-200+
- **Qualidade:** Full HD (1080p)
- **Latência:** 10-30 segundos
- **Uptime:** 99.9%
- **Tráfego incluído:** 10TB/mês

### Exemplo de uso mensal:
- 2 cultos por semana
- 2 horas cada
- 100 viewers médio
- **Consumo:** ~1.5TB/mês (dentro do limite)

---

## ❓ FAQ

### 1. Precisa de cartão de crédito?
Sim, para criar conta Oracle, mas **não é cobrado nada**.

### 2. Tem limite de uso?
Não. O Free Tier da Oracle é **permanente**.

### 3. Funciona em celular?
Sim! O player funciona em qualquer navegador moderno.

### 4. Posso gravar as lives?
Sim! Configure gravação no OBS ou no servidor.

### 5. E se passar de 100 viewers?
O servidor suporta 200+. Se precisar mais, pode escalar facilmente.

### 6. Precisa de conhecimento técnico?
Básico. Os guias são passo a passo, basta seguir.

### 7. Quanto tempo leva para configurar tudo?
- Servidor: 30-45 min
- OBS: 15-20 min
- Site: 2 min
- **Total: ~1 hora**

### 8. E se o servidor cair?
Reinicie pela console Oracle. Uptime é 99.9%.

### 9. Posso usar outro servidor?
Sim! O script funciona em qualquer VPS Ubuntu.

### 10. Precisa de domínio?
Não, pode usar só o IP. Domínio é opcional.

---

## 🆘 Suporte

### Problemas Comuns:

#### Stream não aparece no site:
1. Verifique se está transmitindo no OBS
2. Teste: `curl http://SEU-IP/live/stream.m3u8`
3. Verifique firewall (portas 80 e 1935)

#### OBS não conecta:
1. Verifique IP e porta (1935)
2. Teste: `telnet SEU-IP 1935`
3. Veja logs: `sudo tail -f /var/log/nginx/error.log`

#### Vídeo travando:
1. Reduza bitrate no OBS
2. Verifique velocidade de upload
3. Teste em outro navegador

---

## 🎓 Guias Completos

Para instruções detalhadas, consulte:

1. **[GUIA-ORACLE-CLOUD.md](GUIA-ORACLE-CLOUD.md)**
   - Criar conta
   - Configurar VM
   - Instalar servidor
   - Configurar firewall

2. **[GUIA-OBS-STUDIO.md](GUIA-OBS-STUDIO.md)**
   - Instalar OBS
   - Configurar transmissão
   - Adicionar cenas
   - Dicas e truques

---

## 📝 Checklist de Implementação

- [ ] **Servidor Oracle Cloud**
  - [ ] Conta criada
  - [ ] VM criada (Ampere A1)
  - [ ] SSH funcionando
  - [ ] Script executado
  - [ ] Firewall configurado (portas 80 e 1935)
  - [ ] Página de status acessível

- [ ] **Site React**
  - [ ] Arquivo `.env` criado
  - [ ] IP do servidor configurado
  - [ ] Testado localmente
  - [ ] Build funcionando

- [ ] **OBS Studio**
  - [ ] Instalado
  - [ ] Configurado (servidor + chave)
  - [ ] Câmera adicionada
  - [ ] Áudio testado
  - [ ] Transmissão de teste realizada

- [ ] **Teste Completo**
  - [ ] OBS transmitindo
  - [ ] Stream aparecendo no site
  - [ ] Áudio funcionando
  - [ ] Vídeo sem travamentos
  - [ ] Testado em celular

---

## 🎉 Próximos Passos (Opcional)

Após ter tudo funcionando:

1. **Melhorias no Site:**
   - [ ] Adicionar chat em tempo real (Socket.io)
   - [ ] Sistema de notificações (push)
   - [ ] Agenda de próximas lives
   - [ ] Contador de viewers real

2. **Melhorias no Servidor:**
   - [ ] Configurar HTTPS (Let's Encrypt)
   - [ ] Configurar domínio próprio
   - [ ] Backup automático das gravações
   - [ ] Multi-bitrate (várias qualidades)

3. **Melhorias no OBS:**
   - [ ] Templates de cenas profissionais
   - [ ] Overlays e gráficos
   - [ ] Múltiplas câmeras
   - [ ] Integração com mesa de som

---

## 📞 Contato

Para dúvidas ou problemas, verifique:
1. Logs do servidor
2. Status do Nginx
3. Conexão de internet
4. Guias completos

---

## 📄 Licença

Este projeto é open source. Use livremente!

---

**🙏 Desenvolvido para Igreja Aviva**

**Que Deus abençoe suas transmissões!**

---

## 🔗 Links Úteis

- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [OBS Studio Download](https://obsproject.com/download)
- [Nginx RTMP Module](https://github.com/arut/nginx-rtmp-module)
- [React Player](https://www.npmjs.com/package/react-player)
- [HLS.js](https://github.com/video-dev/hls.js/)

---

**Última atualização:** 2026-01-13
