# Setup n8n Self-Hosted (Servidor VPS)

Guia completo para instalar o n8n em um servidor VPS (Contabo, Oracle Cloud, etc).

## Requisitos

- VPS com Ubuntu 20.04+ ou Debian
- Acesso SSH ao servidor
- Mínimo 1GB RAM

---

## Passo 1: Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Passo 2: Instalar n8n

```bash
sudo npm install n8n -g
```

> Os warnings que aparecem são normais, pode ignorar.

---

## Passo 3: Criar o serviço do n8n

Crie o arquivo de serviço:

```bash
sudo nano /etc/systemd/system/n8n.service
```

Cole este conteúdo (troque `SUA_SENHA_AQUI` por uma senha forte):

```ini
[Unit]
Description=n8n - Workflow Automation
After=network.target

[Service]
Type=simple
User=root
Environment=N8N_BASIC_AUTH_ACTIVE=true
Environment=N8N_BASIC_AUTH_USER=admin
Environment=N8N_BASIC_AUTH_PASSWORD=SUA_SENHA_AQUI
Environment=N8N_HOST=0.0.0.0
Environment=N8N_PORT=5678
Environment=GENERIC_TIMEZONE=America/Sao_Paulo
Environment=N8N_SECURE_COOKIE=false
ExecStart=/usr/bin/n8n
Restart=always

[Install]
WantedBy=multi-user.target
```

Para salvar: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Passo 4: Iniciar o n8n

```bash
sudo systemctl daemon-reload
sudo systemctl enable n8n
sudo systemctl start n8n
```

---

## Passo 5: Liberar porta no firewall

```bash
sudo ufw allow 5678/tcp
sudo ufw enable
sudo ufw reload
```

Se perguntar sobre SSH, digite `y` para confirmar.

---

## Passo 6: Acessar o n8n

1. Descubra o IP do servidor:
   ```bash
   curl -4 ifconfig.me
   ```
   ou
   ```bash
   hostname -I
   ```

2. Acesse no navegador:
   ```
   http://66.94.98.143:5678
   ```

3. Faça login com:
   - **Usuário:** admin
   - **Senha:** A que você definiu no arquivo de serviço (t...10)

---

## Comandos Úteis

### Verificar status do n8n
```bash
sudo systemctl status n8n
```

### Reiniciar n8n
```bash
sudo systemctl restart n8n
```

### Parar n8n
```bash
sudo systemctl stop n8n
```

### Ver logs do n8n
```bash
sudo journalctl -u n8n -f
```

### Atualizar n8n
```bash
sudo npm update n8n -g
sudo systemctl restart n8n
```

---

## Solução de Problemas

### Erro "secure cookie"
Se aparecer erro sobre secure cookie, certifique-se que a variável está no serviço:
```
Environment=N8N_SECURE_COOKIE=false
```

### n8n não inicia
Verifique os logs:
```bash
sudo journalctl -u n8n --no-pager -n 50
```

### Porta bloqueada
Verifique o firewall:
```bash
sudo ufw status
```

Se a porta 5678 não estiver listada:
```bash
sudo ufw allow 5678/tcp
```

---

## Configuração Opcional: HTTPS com Nginx (Recomendado para produção)

Se quiser usar HTTPS, configure o Nginx como proxy reverso:

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Crie o arquivo de configuração:
```bash
sudo nano /etc/nginx/sites-available/n8n
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative e configure SSL:
```bash
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo certbot --nginx -d seu-dominio.com
sudo systemctl restart nginx
```

---

## Próximos Passos

Após instalar o n8n, você pode criar workflows para:
- Atualizar versículo do dia automaticamente (diário)
- Atualizar jornal automaticamente (semanal)

Veja o arquivo `WORKFLOWS-N8N.md` para os workflows prontos.

---

## Prompt para Continuar com Claude

Copie e cole este prompt para continuar a configuração dos workflows:

```
Estou configurando automação com n8n para o projeto AvivaNacoes.

## Status Atual
- n8n instalado e rodando em: http://66.94.98.143:5678
- Login: admin / t...10
- Servidor: VPS Contabo (Ubuntu)
- Firewall configurado (porta 5678 liberada)

## Próxima Etapa
A próxima etapa é configurar a credencial do Supabase no n8n para poder inserir dados nas tabelas.

## O que preciso criar

### Workflow 1: Versículo do Dia (Diário)
- Fonte: Facebook da igreja (posts com imagens de versículos criados manualmente)
- Destino: Tabela `versiculos` no Supabase
- Campos: url_imagem, url_post, titulo, data, ativo
- Frequência: Todo dia (automático)

### Workflow 2: Jornal Semanal (Todo Domingo)
- Fonte: URL do Canva (inserida manualmente ou via webhook)
- Exemplo de URL: https://www.canva.com/design/DAG4tnkAdu0/qjZNIK0IkK3JebEz2sPkQQ/view?utm_content=DAG4tnkAdu0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6eca150978
- Destino: Tabela `jornais` no Supabase
- Campos: url_pdf, titulo, data
- Frequência: Todo domingo

## Supabase
- URL: https://bmfhlfyriudhkjnibayv.supabase.co
- Anon Key já está no projeto React (.env)
- Preciso configurar a Service Role Key no n8n

## Estrutura das Tabelas

### Tabela `versiculos`
- id (UUID)
- url_post (VARCHAR) - URL do post no Facebook
- url_imagem (VARCHAR) - URL da imagem do versículo
- titulo (VARCHAR, nullable)
- data (DATE)
- ativo (BOOLEAN, default true)
- created_at (TIMESTAMP)

### Tabela `jornais`
- id (UUID)
- url_pdf (VARCHAR) - URL do Canva/PDF/Issuu
- titulo (VARCHAR, nullable)
- data (DATE)
- created_at (TIMESTAMP)

Me ajude a:
1. Configurar a credencial do Supabase no n8n
2. Criar os workflows passo a passo
```
