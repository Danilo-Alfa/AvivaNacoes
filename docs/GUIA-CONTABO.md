# 📘 Guia Rápido - Contabo VPS

**Custo:** €4.50/mês (~R$ 27/mês) | **Setup:** 30 minutos

---

## 1️⃣ Criar Conta e VPS

### Acesse e configure:
1. https://contabo.com/en/vps/
2. Escolha: **VPS S SSD** (4 CPU, 6GB RAM, €4.50/mês)
3. Sistema: **Ubuntu 22.04 LTS**
4. Região: **Germany** ou **United States**
5. Período: Mensal ou anual
6. Finalize o pedido

### Aguarde o email:
- Chegará em 5-15 minutos
- Anote: **IP, senha root**

---

## 2️⃣ Conectar e Instalar

### Conectar via SSH:
```bash
ssh root@SEU-IP-AQUI
```
Digite a senha do email quando solicitado.

### Mudar senha (recomendado):
```bash
passwd
```

### Instalar Nginx no servidor Contabo:

**IMPORTANTE:** Agora você vai colocar o script de instalação **dentro do servidor Contabo** (não no seu PC).

**Opção 1 - Copiar e colar (recomendado):**

No terminal SSH (já conectado no Contabo), digite:
```bash
nano setup-streaming-server.sh
```

Copie TODO o conteúdo do arquivo `setup-streaming-server.sh` que está no seu projeto e cole no terminal.

Salve: `Ctrl+X`, depois `Y`, depois `Enter`

**Opção 2 - Upload direto:**

Abra um **novo terminal no seu PC** (não feche o SSH) e digite:
```bash
scp setup-streaming-server.sh root@IP-DO-CONTABO:~/
```
> Substitua `IP-DO-CONTABO` pelo IP que você recebeu no email da Contabo.

---

### Executar a instalação:

Volte para o terminal SSH (conectado no Contabo) e execute:
```bash
chmod +x setup-streaming-server.sh
bash setup-streaming-server.sh
```

**Aguarde 5-10 minutos.** O script vai instalar e configurar tudo automaticamente.

---

### No final, anote estas URLs:

- **URL RTMP (para o OBS do pastor):** `rtmp://IP-DO-CONTABO:1935/live`
- **Chave de transmissão:** `stream`
- **URL HLS (para o site):** `http://IP-DO-CONTABO/live/stream.m3u8`

> **IP-DO-CONTABO** = IP que você recebeu no email da Contabo

---

## 3️⃣ Configurar Projeto React

Crie `.env` na raiz do projeto:
```bash
VITE_STREAM_URL=http://SEU-IP/live/stream.m3u8
```

Teste:
```bash
npm run dev
```

Acesse: [http://localhost:5173/live](http://localhost:5173/live)

---

## 4️⃣ Próximo Passo

Configure o OBS: **[GUIA-OBS-STUDIO.md](GUIA-OBS-STUDIO.md)**

---

## 🔧 Comandos Úteis

```bash
# Ver logs
sudo tail -f /var/log/nginx/error.log

# Reiniciar
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# Estatísticas: http://SEU-IP/stat
```

---

## ❓ Problemas

**SSH não conecta:**
- Aguarde 15 minutos (provisionamento)
- Confirme IP e senha

**Stream não aparece:**
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

**Restringir quem transmite:**
```bash
sudo nano /etc/nginx/nginx.conf
```
Adicione na seção `application live`:
```nginx
allow publish SEU-IP-CASA;
deny publish all;
```

---

## 💰 Custo Total

- **VPS S:** R$ 27/mês
- **Com backup:** R$ 33/mês

---

✅ **Pronto! Agora configure o OBS:** [GUIA-OBS-STUDIO.md](GUIA-OBS-STUDIO.md)
