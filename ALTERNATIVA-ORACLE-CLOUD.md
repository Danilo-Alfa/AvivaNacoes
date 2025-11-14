# 📘 Guia Completo - Oracle Cloud Free Tier (Custo Zero)

Este guia vai te ajudar a configurar um servidor de streaming completamente gratuito usando Oracle Cloud.

---

## 🎯 O que você vai conseguir

- ✅ Servidor de streaming **100% gratuito para sempre**
- ✅ Suporta 100+ viewers simultâneos
- ✅ 24GB RAM + 4 CPUs (Arm)
- ✅ 200GB de armazenamento
- ✅ 10TB de tráfego por mês
- ✅ Sem políticas de conteúdo de terceiros
- ✅ Total controle sobre suas transmissões

---

## 📋 Passo 1: Criar Conta Oracle Cloud

### 1.1 Acessar Oracle Cloud
- Acesse: https://www.oracle.com/cloud/free/
- Clique em **"Start for free"** ou **"Começar gratuitamente"**

### 1.2 Preencher Dados
- **País:** Brasil
- **Email:** Seu email
- **Nome completo**

### 1.3 Verificação
- Confirme seu email
- Preencha os dados pessoais
- **IMPORTANTE:** Será solicitado um cartão de crédito para verificação, mas **não será cobrado nada**

### 1.4 Escolha o Data Center
- Recomendado para Brasil: **São Paulo (GRU)** ou **Santiago (SCL)**

---

## 🖥️ Passo 2: Criar a VM (Máquina Virtual)

### 2.1 Acessar Console
- Faça login em: https://cloud.oracle.com/
- Clique em **"Compute"** → **"Instances"**

### 2.2 Criar Instância
Clique em **"Create Instance"** e configure:

#### Configurações Básicas:
- **Nome:** `streaming-server` (ou qualquer nome)
- **Compartment:** Deixe o padrão

#### Placement:
- **Availability Domain:** Qualquer uma

#### Image and Shape:
1. **Image:**
   - Clique em **"Change Image"**
   - Selecione: **Ubuntu 22.04 Minimal** (Canonical)

2. **Shape:**
   - Clique em **"Change Shape"**
   - Selecione: **Ampere** (Arm-based processor)
   - **Shape:** `VM.Standard.A1.Flex`
   - **OCPUs:** 4 (máximo gratuito)
   - **Memory (GB):** 24 (máximo gratuito)
   - ✅ Certifique-se de que aparece **"Always Free-eligible"**

   **⚠️ SE NÃO ESTIVER DISPONÍVEL:**
   - Tente outra região (Availability Domain)
   - Ou comece com: **2 OCPUs + 12 GB RAM** (ainda gratuito, suficiente para 50+ viewers)
   - Ou use shape alternativo: **VM.Standard.E2.1.Micro** (1 OCPU, 1GB - básico mas funcional)

#### Networking:
- **VCN:** Deixe criar uma nova (padrão)
- **Subnet:** Deixe o padrão
- **Public IP:** ✅ **Assign a public IPv4 address** (MARQUE ESTA OPÇÃO!)

#### Add SSH Keys:
- Selecione **"Generate a key pair for me"**
- Clique em **"Save Private Key"** - GUARDE ESTE ARQUIVO COM SEGURANÇA!
- Clique em **"Save Public Key"** (opcional, mas recomendado)

### 2.3 Criar
- Clique em **"Create"**
- Aguarde 2-5 minutos até o status ficar **"Running"** (verde)

### 2.4 Anotar Informações
Após criar, anote:
- **Public IP Address:** Ex: `150.136.234.123`
- **Username:** `ubuntu`

---

## 🔒 Passo 3: Configurar Firewall (MUITO IMPORTANTE!)

### 3.1 Configurar Security List
1. No console Oracle, vá em: **Networking** → **Virtual Cloud Networks**
2. Clique na VCN criada (geralmente `vcn-xxxxx`)
3. Clique em **"Security Lists"**
4. Clique na Security List padrão (geralmente `Default Security List for vcn-xxxxx`)

### 3.2 Adicionar Regras de Entrada (Ingress Rules)

Clique em **"Add Ingress Rules"** e adicione as seguintes regras:

#### Regra 1 - HTTP (para o player)
- **Source CIDR:** `0.0.0.0/0`
- **IP Protocol:** `TCP`
- **Destination Port Range:** `80`
- **Description:** `HTTP for HLS streaming`
- Clique em **"Add Ingress Rules"**

#### Regra 2 - RTMP (para OBS)
- **Source CIDR:** `0.0.0.0/0`
- **IP Protocol:** `TCP`
- **Destination Port Range:** `1935`
- **Description:** `RTMP for OBS streaming`
- Clique em **"Add Ingress Rules"**

> ⚠️ **ATENÇÃO:** Se você não configurar essas regras, o streaming não vai funcionar!

---

## 🔧 Passo 4: Conectar ao Servidor

### 4.1 Windows (usando PowerShell)

1. Mova o arquivo da chave privada (`.key`) para um local seguro, exemplo:
   ```
   C:\Users\SeuUsuario\.ssh\oracle-streaming.key
   ```

2. Abra o PowerShell e conecte:
   ```powershell
   ssh -i C:\Users\SeuUsuario\.ssh\oracle-streaming.key ubuntu@SEU-IP-PUBLICO
   ```

### 4.2 Mac/Linux

1. Mova a chave privada para `~/.ssh/`:
   ```bash
   mv ~/Downloads/ssh-key-*.key ~/.ssh/oracle-streaming.key
   chmod 400 ~/.ssh/oracle-streaming.key
   ```

2. Conecte:
   ```bash
   ssh -i ~/.ssh/oracle-streaming.key ubuntu@SEU-IP-PUBLICO
   ```

> Substitua `SEU-IP-PUBLICO` pelo IP que você anotou no Passo 2.4

---

## 🚀 Passo 5: Instalar o Servidor de Streaming

### 5.1 Fazer Upload do Script

**Opção A - Windows (PowerShell):**
```powershell
scp -i C:\Users\SeuUsuario\.ssh\oracle-streaming.key setup-streaming-server.sh ubuntu@SEU-IP-PUBLICO:~/
```

**Opção B - Mac/Linux:**
```bash
scp -i ~/.ssh/oracle-streaming.key setup-streaming-server.sh ubuntu@SEU-IP-PUBLICO:~/
```

**Opção C - Copiar e Colar (mais simples):**
1. Conecte ao servidor via SSH
2. Crie o arquivo:
   ```bash
   nano setup-streaming-server.sh
   ```
3. Cole o conteúdo do arquivo `setup-streaming-server.sh`
4. Pressione `Ctrl+X`, depois `Y`, depois `Enter`

### 5.2 Executar o Script

```bash
# Dar permissão de execução
chmod +x setup-streaming-server.sh

# Executar como root
sudo bash setup-streaming-server.sh
```

A instalação leva cerca de 5-10 minutos. O script vai:
- ✅ Instalar Nginx com módulo RTMP
- ✅ Configurar HLS
- ✅ Configurar firewall do servidor
- ✅ Criar página de status

### 5.3 Verificar Instalação

Após a instalação, você verá algo como:

```
======================================
Instalação Concluída com Sucesso!
======================================

IP do Servidor: 150.136.234.123
URL RTMP (OBS): rtmp://150.136.234.123:1935/live
Chave de Stream: stream
URL HLS (Player): http://150.136.234.123/live/stream.m3u8
Página de Status: http://150.136.234.123
```

**Anote essas informações!**

---

## 🧪 Passo 6: Testar o Servidor

### 6.1 Testar no Navegador
Abra o navegador e acesse:
```
http://SEU-IP-PUBLICO
```

Você deve ver a página de status do servidor.

### 6.2 Verificar Serviço
No servidor SSH, execute:
```bash
sudo systemctl status nginx
```

Deve aparecer **"active (running)"** em verde.

---

## ⚙️ Passo 7: Configurar o Site React

### 7.1 Criar arquivo .env

Na raiz do seu projeto React, crie o arquivo `.env`:

```bash
VITE_STREAM_URL=http://SEU-IP-PUBLICO/live/stream.m3u8
```

> Substitua `SEU-IP-PUBLICO` pelo IP do seu servidor Oracle.

### 7.2 Testar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173/live`

---

## 🎬 Próximos Passos

Agora você precisa configurar o OBS Studio para transmitir. Veja o arquivo:
- **`GUIA-OBS-STUDIO.md`** - Como configurar e transmitir

---

## 🔧 Comandos Úteis

### Ver logs do Nginx:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Reiniciar Nginx:
```bash
sudo systemctl restart nginx
```

### Verificar status:
```bash
sudo systemctl status nginx
```

### Ver estatísticas em tempo real:
```
http://SEU-IP-PUBLICO/stat
```

---

## 🔒 Segurança (Opcional mas Recomendado)

### 1. Configurar HTTPS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Configurar domínio (você precisa ter um domínio apontando para o IP)
sudo certbot --nginx -d seu-dominio.com
```

### 2. Restringir quem pode transmitir

Edite `/etc/nginx/nginx.conf` e adicione na seção `application live`:

```nginx
# Permitir apenas o IP do pastor transmitir
allow publish SEU-IP-CASA;
deny publish all;
```

Depois reinicie:
```bash
sudo systemctl restart nginx
```

---

## ❓ Problemas Comuns

### Problema: "Connection refused" ao conectar via SSH
**Solução:** Verifique se a porta 22 está aberta na Security List (geralmente já vem aberta).

### Problema: Stream não aparece no site
**Solução:**
1. Verifique se as portas 80 e 1935 estão abertas na Security List
2. Verifique os logs: `sudo tail -f /var/log/nginx/error.log`
3. Confirme que está transmitindo no OBS

### Problema: "Always Free shape not available"
**Causas:**
- Recursos limitados na região escolhida
- Alta demanda por VMs gratuitas

**Soluções (em ordem de prioridade):**

1. **Tentar outra região/Availability Domain:**
   - São Paulo (Brazil East)
   - Vinhedo (Brazil Southeast)
   - Santiago (Chile)
   - Ashburn (US East)
   - Phoenix (US West)

2. **Reduzir recursos temporariamente:**
   - Em vez de 4 OCPUs + 24GB, use: **2 OCPUs + 12GB** (ainda gratuito)
   - Suficiente para 50-70 viewers simultâneos
   - Você pode aumentar depois

3. **Usar shape alternativo:**
   - `VM.Standard.E2.1.Micro` (1 OCPU, 1GB RAM)
   - Gratuito e sempre disponível
   - Funcional para 20-30 viewers

4. **Criar em horário diferente:**
   - Tente de madrugada ou final de semana
   - Menos pessoas criando VMs

5. **Usar script automático (avançado):**
   ```bash
   # Criar script que tenta criar VM a cada 5 minutos
   # Quando houver disponibilidade, cria automaticamente
   ```

---

## 💰 Custos

**TOTAL: R$ 0,00 (GRÁTIS PARA SEMPRE)**

Oracle Cloud Free Tier é **permanente** e não expira!

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do Nginx
2. Teste a conexão: `curl http://SEU-IP/live/stream.m3u8`
3. Verifique o firewall: `sudo ufw status`

---

## ✅ Checklist Final

- [ ] Conta Oracle Cloud criada
- [ ] VM criada com Ubuntu 22.04 + Ampere A1
- [ ] Security List configurada (portas 80 e 1935)
- [ ] SSH funcionando
- [ ] Script de instalação executado com sucesso
- [ ] Página de status acessível no navegador
- [ ] Arquivo .env criado no projeto React
- [ ] Pronto para configurar OBS! (próximo guia)

---

**🎉 Parabéns! Seu servidor de streaming está pronto!**

Próximo passo: **GUIA-OBS-STUDIO.md**
