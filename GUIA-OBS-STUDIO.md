# 📹 Guia Completo - OBS Studio (Transmissão ao Vivo)

Este guia ensina como configurar o OBS Studio para transmitir para seu servidor próprio.

---

## 🎯 O que você vai aprender

- ✅ Baixar e instalar OBS Studio
- ✅ Configurar transmissão para seu servidor
- ✅ Ajustar qualidade de vídeo e áudio
- ✅ Adicionar cenas e fontes
- ✅ Dicas para uma boa transmissão
- ✅ Resolver problemas comuns

---

## 📥 Passo 1: Baixar e Instalar OBS Studio

### 1.1 Download

Acesse: https://obsproject.com/download

- **Windows:** Baixe o instalador `.exe`
- **Mac:** Baixe o `.dmg`
- **Linux:** Use o comando apropriado para sua distro

### 1.2 Instalação

**Windows:**
1. Execute o instalador baixado
2. Clique em "Next" → "I Agree" → "Next" → "Install"
3. Aguarde a instalação
4. Clique em "Finish"

**Mac:**
1. Abra o arquivo `.dmg`
2. Arraste OBS para a pasta Applications
3. Abra o OBS pela primeira vez (pode pedir permissões)

### 1.3 Primeira Execução

Na primeira vez que abrir o OBS:
1. Pode aparecer o "Auto-Configuration Wizard"
2. Clique em **"Cancel"** - vamos configurar manualmente

---

## ⚙️ Passo 2: Configurar Transmissão

### 2.1 Abrir Configurações

- Clique em **"Arquivo"** → **"Configurações"** (ou **"Settings"**)
- Ou pressione **`Ctrl + ,`** (Windows) / **`Cmd + ,`** (Mac)

### 2.2 Aba "Stream" (Transmissão)

1. **Serviço:** Selecione **"Custom..." (Personalizado)**

2. **Servidor:**
   ```
   rtmp://SEU-IP-ORACLE:1935/live
   ```
   > Substitua `SEU-IP-ORACLE` pelo IP do seu servidor (exemplo: `rtmp://150.136.234.123:1935/live`)

3. **Chave de transmissão:**
   ```
   stream
   ```
   > Esta é a chave padrão. Você pode mudá-la depois no servidor.

4. Clique em **"Apply"** (Aplicar)

---

## 🎬 Passo 3: Configurar Saída (Output)

### 3.1 Aba "Output" (Saída)

1. **Output Mode:** Selecione **"Advanced"** (Avançado)

2. Aba **"Streaming":**
   - **Audio Track:** 1
   - **Encoder:**
     - Se tiver placa de vídeo NVIDIA: `NVIDIA NVENC H.264`
     - Se tiver placa AMD: `AMD HW H.264`
     - Se não tiver placa dedicada: `x264`

   - **Rate Control:** `CBR`
   - **Bitrate:**
     - Internet boa (10+ Mbps upload): `3000 Kbps`
     - Internet média (5-10 Mbps upload): `2000 Kbps`
     - Internet fraca (< 5 Mbps upload): `1500 Kbps`

   - **Keyframe Interval:** `2`
   - **Preset:**
     - Para NVENC: `Quality` ou `Max Quality`
     - Para x264: `veryfast` ou `faster`

   - **Profile:** `high`

3. Aba **"Recording"** (Gravação - opcional):
   - Se quiser gravar ao mesmo tempo que transmite
   - **Recording Path:** Escolha onde salvar
   - **Recording Format:** `mp4` ou `mkv`
   - **Encoder:** Igual ao streaming

4. Clique em **"Apply"**

---

## 🎥 Passo 4: Configurar Vídeo

### 4.1 Aba "Video" (Vídeo)

1. **Base (Canvas) Resolution:**
   - `1920x1080` (Full HD - recomendado)
   - ou `1280x720` (HD - para internet mais fraca)

2. **Output (Scaled) Resolution:**
   - Mesmo que o Base: `1920x1080`
   - ou `1280x720` se escolheu HD

3. **Downscale Filter:** `Lanczos` (melhor qualidade)

4. **Common FPS Values:** `30` ou `60`
   - 30 FPS: Economiza banda, suficiente para cultos
   - 60 FPS: Mais fluido, mas usa mais internet

5. Clique em **"Apply"**

---

## 🔊 Passo 5: Configurar Áudio

### 5.1 Aba "Audio" (Áudio)

1. **Sample Rate:** `44.1 kHz` ou `48 kHz`

2. **Channels:** `Stereo`

3. **Desktop Audio Device:**
   - Selecione sua placa de som (para capturar áudio do computador)
   - Ou "Disable" se não quiser capturar

4. **Mic/Auxiliary Audio Device:**
   - Selecione seu microfone
   - Ou "Disable" se não tiver microfone

5. **Mic/Auxiliary Audio Device 2, 3:**
   - Deixe "Disable" (a menos que tenha múltiplos microfones)

6. Clique em **"Apply"** e **"OK"**

---

## 🎨 Passo 6: Criar Cenas e Fontes

### 6.1 Entender o Layout

O OBS tem 3 painéis principais:
- **Scenes (Cenas):** Diferentes "layouts" que você pode alternar
- **Sources (Fontes):** Elementos que aparecem na tela (câmera, texto, imagens, etc.)
- **Mixer:** Controles de volume

### 6.2 Criar Primeira Cena

1. No painel **"Scenes"**, clique no **"+"**
2. Nome: `Culto Principal`
3. Clique em **"OK"**

### 6.3 Adicionar Câmera

1. No painel **"Sources"**, clique no **"+"**
2. Selecione **"Video Capture Device"** (Dispositivo de Captura de Vídeo)
3. Nome: `Câmera` (ou nome da sua câmera)
4. Clique em **"OK"**
5. Selecione sua câmera/webcam no dropdown
6. Clique em **"OK"**
7. Ajuste o tamanho arrastando os cantos vermelhos

### 6.4 Adicionar Texto (Opcional)

1. Clique no **"+"** em Sources
2. Selecione **"Text (GDI+)"** ou **"Text (FreeType 2)"**
3. Nome: `Nome da Igreja`
4. Digite o texto: **"Igreja Aviva"**
5. Escolha fonte, tamanho e cor
6. Clique em **"OK"**
7. Posicione onde quiser

### 6.5 Adicionar Imagem (Logo - Opcional)

1. Clique no **"+"** em Sources
2. Selecione **"Image"** (Imagem)
3. Nome: `Logo`
4. Clique em **"Browse"** e selecione sua imagem
5. Clique em **"OK"**
6. Redimensione e posicione

### 6.6 Criar Cena de Intervalo

1. Crie uma nova cena: `Intervalo`
2. Adicione uma imagem ou texto com avisos
3. Exemplo: "Voltamos logo" ou informações da igreja

---

## 📡 Passo 7: Transmitir

### 7.1 Verificar Conexão com Internet

- Teste sua velocidade de upload: https://www.speedtest.net/
- Upload deve ser **pelo menos 2x o bitrate** que configurou
  - Exemplo: Bitrate 3000 Kbps → Upload mínimo 6 Mbps

### 7.2 Testar Áudio

1. Fale no microfone
2. Verifique se as barras no **Mixer** estão se movendo
3. Ajuste o volume com os sliders
4. **IMPORTANTE:** Mantenha o áudio na área verde/amarela, **nunca no vermelho**

### 7.3 Iniciar Transmissão

1. Clique em **"Start Streaming"** (Iniciar Transmissão)
2. Aguarde 5-10 segundos
3. O botão vai ficar vermelho e mostrar "Stop Streaming"

### 7.4 Verificar se Está Transmitindo

**Opção 1 - No site:**
1. Abra seu site no navegador
2. Acesse `/live`
3. Deve aparecer "AO VIVO" e o vídeo deve carregar

**Opção 2 - Direto no VLC:**
1. Abra o VLC Media Player
2. Media → Open Network Stream
3. Cole: `http://SEU-IP/live/stream.m3u8`
4. Clique em Play

**Opção 3 - Status do servidor:**
1. Acesse: `http://SEU-IP/stat`
2. Deve aparecer informações da stream ativa

### 7.5 Durante a Transmissão

- **Alternar cenas:** Clique na cena desejada no painel Scenes
- **Mutar áudio:** Clique no ícone de alto-falante no Mixer
- **Ajustar volume:** Use os sliders no Mixer
- **Gravar localmente:** Clique em "Start Recording" (opcional)

### 7.6 Encerrar Transmissão

1. Clique em **"Stop Streaming"**
2. Aguarde alguns segundos para finalizar
3. Se gravou, clique em **"Stop Recording"**

---

## 💡 Dicas para uma Boa Transmissão

### Iluminação
- ✅ Luz na frente do pastor (não atrás)
- ✅ Evite janelas atrás (contraluzes)
- ✅ Use luz natural ou lâmpadas LED brancas

### Áudio
- ✅ Microfone próximo da boca (10-15cm)
- ✅ Teste áudio ANTES da live
- ✅ Tenha microfone de backup
- ✅ Evite ventiladores/ar-condicionado perto do microfone

### Internet
- ✅ Use cabo de rede (ethernet) sempre que possível
- ✅ Evite Wi-Fi se possível
- ✅ Feche outros programas que usam internet
- ✅ Peça para não usarem Netflix/downloads durante a live

### Câmera
- ✅ Enquadramento: pastor no centro ou levemente à esquerda
- ✅ Altura: câmera na altura dos olhos
- ✅ Distância: corpo inteiro ou da cintura para cima
- ✅ Foco automático ativado (se disponível)

### Antes de Começar
- [ ] Testar áudio e vídeo 30min antes
- [ ] Verificar internet
- [ ] Ligar todas as fontes (câmera, microfone)
- [ ] Fazer uma transmissão de teste curta
- [ ] Ter um celular como backup

---

## 🔧 Configurações Avançadas (Opcional)

### Adicionar Múltiplas Câmeras

1. Adicione outra fonte "Video Capture Device"
2. Selecione a segunda câmera
3. Crie cenas diferentes para cada ângulo
4. Alterne entre elas durante a transmissão

### Adicionar Mesa de Som

1. Conecte a mesa de som ao computador (USB ou P2)
2. Em Settings → Audio → Mic/Aux, selecione a mesa
3. Ajuste os níveis na mesa E no OBS

### Transmitir Apresentações (PowerPoint)

1. Adicione fonte: **"Window Capture"**
2. Selecione a janela do PowerPoint
3. Entre no modo apresentação
4. A apresentação aparecerá no OBS

### Baixar Latência (Delay)

No seu servidor, edite `/etc/nginx/nginx.conf`:
```nginx
hls_fragment 1;  # De 3 para 1
hls_playlist_length 3;  # De 60 para 3
```

Reinicie: `sudo systemctl restart nginx`

---

## ❌ Problemas Comuns e Soluções

### "Failed to connect to server"
**Causas:**
- IP do servidor errado
- Firewall bloqueando (porta 1935)
- Nginx não está rodando

**Soluções:**
1. Verifique o IP: `ping SEU-IP`
2. Teste a porta: `telnet SEU-IP 1935`
3. No servidor: `sudo systemctl status nginx`

### Stream travando/buffering
**Causas:**
- Internet lenta
- Bitrate muito alto
- CPU sobrecarregada

**Soluções:**
1. Reduza o bitrate (Settings → Output)
2. Reduza a resolução (Settings → Video → 720p)
3. Mude preset para "ultrafast" (Settings → Output)
4. Feche outros programas

### Áudio com eco
**Causas:**
- Áudio do Desktop capturando o próprio som

**Soluções:**
1. Mute o "Desktop Audio" no Mixer
2. Ou Settings → Audio → Desktop Audio Device: Disable

### Áudio dessincronizado
**Causas:**
- Delay entre vídeo e áudio

**Soluções:**
1. Clique com botão direito na fonte de áudio
2. Filters → "+" → Audio/Video Sync
3. Ajuste o Offset (positivo ou negativo)

### Tela preta na câmera
**Causas:**
- Câmera em uso por outro programa
- Driver desatualizado

**Soluções:**
1. Feche Skype, Zoom, Teams
2. Reinicie o OBS
3. Atualize drivers da câmera

---

## 📊 Monitoramento Durante a Live

### Indicadores Importantes

**No OBS (canto inferior direito):**
- **Verde:** Tudo OK
- **Amarelo:** Atenção
- **Vermelho:** PROBLEMA!

**CPU:** Deve ficar abaixo de 80%
**Dropped Frames:** Deve ser 0% ou muito próximo

### O que fazer se Dropped Frames > 5%
1. Reduza bitrate
2. Reduza resolução
3. Mude preset para mais rápido
4. Verifique se outra coisa está usando internet

---

## 🎓 Atalhos Úteis

- **Iniciar/Parar Transmissão:** Não tem padrão (configure em Settings → Hotkeys)
- **Alternar Cenas:** Configure hotkeys (F1, F2, F3, etc.)
- **Mutar Microfone:** Configure hotkey
- **Iniciar/Parar Gravação:** Configure hotkey

**Como configurar:**
1. Settings → Hotkeys
2. Procure a ação desejada
3. Clique e pressione a tecla
4. Apply → OK

---

## 📱 Transmitir pelo Celular (Alternativa)

Se o computador não estiver disponível, use app **Larix Broadcaster** (Android/iOS):

1. Baixe: Larix Broadcaster
2. Settings → Connections → + (novo)
3. Nome: Igreja Aviva
4. URL: `rtmp://SEU-IP:1935/live`
5. Stream name: `stream`
6. Salve e conecte

---

## ✅ Checklist Pré-Live

**1 dia antes:**
- [ ] Testar equipamentos
- [ ] Verificar atualizações do OBS
- [ ] Testar conexão de internet

**30 minutos antes:**
- [ ] Ligar computador e OBS
- [ ] Conectar câmera e microfone
- [ ] Testar áudio (falar e ouvir)
- [ ] Fazer transmissão de teste (1-2 min)
- [ ] Avisar na página/redes sociais que terá live

**Durante a live:**
- [ ] Monitorar Dropped Frames
- [ ] Monitorar uso de CPU
- [ ] Ter celular de backup pronto

**Depois da live:**
- [ ] Parar transmissão
- [ ] Parar gravação (se houver)
- [ ] Backup do arquivo gravado

---

## 🎉 Pronto!

Agora você tem tudo configurado:
- ✅ Servidor Oracle Cloud (gratuito)
- ✅ Site com player de live
- ✅ OBS Studio configurado

**Faça um teste agora!**

1. Inicie transmissão no OBS
2. Acesse seu site `/live`
3. Verifique se aparece o vídeo

---

## 📞 Precisa de Ajuda?

Problemas? Verifique:
1. Logs do servidor: `sudo tail -f /var/log/nginx/error.log`
2. Status OBS: Canto inferior direito
3. Status do servidor: `http://SEU-IP/stat`

---

**🎬 Boa transmissão!**
