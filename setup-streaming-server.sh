#!/bin/bash

################################################################################
# Script de Instalação Automática - Servidor de Streaming
# Oracle Cloud + Nginx + RTMP + HLS
# Custo: GRÁTIS (Oracle Cloud Free Tier)
################################################################################

set -e

echo "======================================"
echo "Instalando Servidor de Streaming"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATENÇÃO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    print_error "Por favor, execute este script como root (use: sudo bash setup-streaming-server.sh)"
    exit 1
fi

print_info "Atualizando sistema..."
apt-get update -y
apt-get upgrade -y

print_info "Instalando dependências..."
apt-get install -y build-essential libpcre3 libpcre3-dev libssl-dev zlib1g-dev git

# Criar diretório de trabalho
WORK_DIR="/tmp/nginx-rtmp-build"
mkdir -p $WORK_DIR
cd $WORK_DIR

print_info "Baixando Nginx..."
NGINX_VERSION="1.24.0"
wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz
tar -xzf nginx-${NGINX_VERSION}.tar.gz

print_info "Baixando módulo RTMP..."
git clone https://github.com/arut/nginx-rtmp-module.git

print_info "Compilando Nginx com módulo RTMP..."
cd nginx-${NGINX_VERSION}
./configure \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --with-http_ssl_module \
    --with-http_v2_module \
    --add-module=../nginx-rtmp-module

make -j$(nproc)
make install

print_info "Criando diretórios necessários..."
mkdir -p /var/www/html/live
mkdir -p /var/log/nginx
chown -R www-data:www-data /var/www/html/live
chmod -R 755 /var/www/html/live

print_info "Configurando Nginx..."
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

# Configuração RTMP
rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        application live {
            live on;

            # Gravar lives automaticamente
            record all;
            record_path /var/www/html/recordings;
            record_unique on;
            record_suffix _%Y%m%d_%H%M%S.flv;
            exec_record_done /usr/local/bin/convert-recording.sh $path;

            # Permitir apenas de IPs específicos (adicione o IP do pastor)
            # allow publish 192.168.1.100;
            # deny publish all;

            # Converter para HLS (low latency)
            hls on;
            hls_path /var/www/html/live;
            hls_fragment 1;
            hls_playlist_length 4;

            # Habilitar DASH (opcional)
            dash on;
            dash_path /var/www/html/dash;
        }
    }
}

# Configuração HTTP
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Configuração do servidor HTTP
    server {
        listen 80;
        server_name _;

        # Página de status do RTMP
        location /stat {
            rtmp_stat all;
            rtmp_stat_stylesheet stat.xsl;
        }

        location /stat.xsl {
            root /etc/nginx/;
        }

        # Servir streams HLS
        location /live {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /var/www/html;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
            add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
            add_header Access-Control-Expose-Headers 'Content-Length,Content-Range' always;
        }

        # Info de uso de disco (gerado por cron)
        location = /disk-usage.json {
            root /var/www/html;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, OPTIONS' always;
            add_header Access-Control-Allow-Headers '*' always;
            default_type application/json;
        }

        # Listar e servir gravações
        location /recordings {
            root /var/www/html;
            autoindex on;
            autoindex_format json;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, OPTIONS' always;
            add_header Access-Control-Allow-Headers '*' always;
        }

        # Servir streams DASH (opcional)
        location /dash {
            types {
                application/dash+xml mpd;
            }
            root /var/www/html;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
        }

        # Página inicial
        location / {
            root /var/www/html;
            index index.html;
        }
    }
}
EOF

print_info "Criando página de status..."
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Servidor de Streaming - Aviva Nações</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .status {
            padding: 10px;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            margin: 20px 0;
        }
        .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        code {
            background: #333;
            color: #0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🎥 Servidor de Streaming - Aviva Nações</h1>
        <div class="status">✅ Servidor Online e Funcionando!</div>

        <h2>Informações do Servidor</h2>
        <div class="info">
            <p><strong>Servidor RTMP:</strong> <code>rtmp://SEU-IP:1935/live</code></p>
            <p><strong>Chave de Stream:</strong> <code>stream</code></p>
            <p><strong>URL do Player (HLS):</strong> <code>http://SEU-IP/live/stream.m3u8</code></p>
        </div>

        <h2>Como Transmitir (OBS Studio)</h2>
        <div class="info">
            <ol>
                <li>Abra o OBS Studio</li>
                <li>Vá em: Configurações > Transmissão</li>
                <li>Serviço: Personalizado</li>
                <li>Servidor: <code>rtmp://SEU-IP:1935/live</code></li>
                <li>Chave de transmissão: <code>stream</code></li>
                <li>Clique em "Iniciar Transmissão"</li>
            </ol>
        </div>

        <h2>Monitoramento</h2>
        <p><a href="/stat">Ver estatísticas do servidor RTMP</a></p>
    </div>
</body>
</html>
EOF

print_info "Criando arquivo de serviço systemd..."
cat > /etc/systemd/system/nginx.service << 'EOF'
[Unit]
Description=The NGINX HTTP and reverse proxy server with RTMP module
After=network.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

print_info "Criando usuário www-data se não existir..."
id -u www-data &>/dev/null || useradd -r -s /bin/false www-data

print_info "Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 1935/tcp
    print_info "Firewall UFW configurado"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=1935/tcp
    firewall-cmd --reload
    print_info "Firewall firewalld configurado"
fi

print_info "Iniciando Nginx..."
systemctl daemon-reload
systemctl enable nginx
systemctl start nginx

# Obter IP do servidor
SERVER_IP=$(curl -s ifconfig.me)

echo ""
echo "======================================"
print_info "Instalação Concluída com Sucesso!"
echo "======================================"
echo ""
print_warning "IMPORTANTE: Configure as regras de firewall na Oracle Cloud:"
echo "   1. Acesse o console da Oracle Cloud"
echo "   2. Vá em: Networking > Virtual Cloud Networks"
echo "   3. Selecione sua VCN > Security Lists"
echo "   4. Adicione regras de entrada (Ingress):"
echo "      - Porta 80 (TCP) - Para HTTP/HLS"
echo "      - Porta 1935 (TCP) - Para RTMP"
echo ""
echo "Informações do Servidor:"
echo "========================"
echo "IP do Servidor: $SERVER_IP"
echo "URL RTMP (OBS): rtmp://$SERVER_IP:1935/live"
echo "Chave de Stream: stream"
echo "URL HLS (Player): http://$SERVER_IP/live/stream.m3u8"
echo "Página de Status: http://$SERVER_IP"
echo "Estatísticas RTMP: http://$SERVER_IP/stat"
echo ""
print_warning "Atualize o arquivo .env do seu projeto React com:"
echo "VITE_STREAM_URL=http://$SERVER_IP/live/stream.m3u8"
echo ""
print_info "Para testar, inicie uma transmissão no OBS e acesse:"
echo "http://$SERVER_IP/live/stream.m3u8"
echo ""
