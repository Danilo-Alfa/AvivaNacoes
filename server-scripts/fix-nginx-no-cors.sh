#!/bin/bash
# Remove CORS headers do NGINX - Caddy ja cuida disso
set -e

cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak2
echo "Backup salvo"

python3 << 'PYEOF'
import re

with open("/etc/nginx/nginx.conf") as f:
    conf = f.read()

# Substituir bloco disk-usage por versao sem CORS
new_disk = """        # Info de uso de disco
        location = /disk-usage.json {
            root /var/www/html;
            add_header Cache-Control no-cache;
            default_type application/json;
        }"""

# Substituir bloco recordings por versao sem CORS
new_rec = """        # Listar e servir gravacoes
        location /recordings {
            root /var/www/html;
            autoindex on;
            autoindex_format json;
            add_header Cache-Control no-cache;
        }"""

# Remove disk-usage block e recordings block, substitui
conf = re.sub(
    r'\s*#[^\n]*uso de disco[^\n]*\n\s*location = /disk-usage\.json \{[^}]*\}',
    '\n' + new_disk,
    conf
)

conf = re.sub(
    r'\s*#[^\n]*(?:[Ll]istar|gravac)[^\n]*\n\s*location /recordings \{[^}]*\}',
    '\n' + new_rec,
    conf
)

# Also remove CORS from /live block if present
conf = re.sub(
    r'(\s*location /live \{[^}]*?)(\s*add_header Access-Control-Allow-Origin[^\n]*\n\s*add_header Access-Control-Allow-Methods[^\n]*\n\s*add_header Access-Control-Allow-Headers[^\n]*\n\s*add_header Access-Control-Expose-Headers[^\n]*\n)',
    r'\1',
    conf
)

with open("/etc/nginx/nginx.conf", "w") as f:
    f.write(conf)

print("NGINX config atualizado - CORS removido")
PYEOF

nginx -t && nginx -s reload && echo "NGINX recarregado"
