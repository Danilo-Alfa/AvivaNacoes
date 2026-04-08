#!/bin/bash
# Atualiza NGINX config para adicionar CORS em /recordings e endpoint /disk-usage.json
set -e

NGINX_CONF="/etc/nginx/nginx.conf"
cp "$NGINX_CONF" "${NGINX_CONF}.bak"
echo "Backup salvo em ${NGINX_CONF}.bak"

python3 << 'PYEOF'
import re

with open("/etc/nginx/nginx.conf") as f:
    conf = f.read()

new_block = """        # Info de uso de disco
        location = /disk-usage.json {
            root /var/www/html;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, OPTIONS' always;
            add_header Access-Control-Allow-Headers '*' always;
            default_type application/json;
            if ($request_method = OPTIONS) {
                return 204;
            }
        }

        # Listar e servir gravacoes
        location /recordings {
            root /var/www/html;
            autoindex on;
            autoindex_format json;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, DELETE, OPTIONS' always;
            add_header Access-Control-Allow-Headers '*' always;
            if ($request_method = OPTIONS) {
                return 204;
            }
        }"""

# Remove bloco antigo de disk-usage (se existir) e recordings, substitui por novo
pattern = r'(\s*#[^\n]*disk[^\n]*\n\s*location = /disk-usage\.json \{[^}]*\}\s*\n?)?\s*#[^\n]*(?:[Ll]istar|gravac|recordings)[^\n]*\n\s*location /recordings \{[^}]*\}'
conf_new = re.sub(pattern, new_block, conf)

if conf_new == conf:
    print("AVISO: padrao nao encontrado, tentando inserir antes de location /dash")
    conf_new = conf.replace(
        "        # Servir streams DASH",
        new_block + "\n\n        # Servir streams DASH"
    )

with open("/etc/nginx/nginx.conf", "w") as f:
    f.write(conf_new)

print("NGINX config atualizado")
PYEOF

nginx -t && nginx -s reload && echo "NGINX recarregado com sucesso"
