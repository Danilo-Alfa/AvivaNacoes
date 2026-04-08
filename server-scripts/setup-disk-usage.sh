#!/bin/bash
# Script unico para configurar endpoint de disk usage no servidor de streaming
# Colar e executar via SSH: ssh root@66.94.98.143

set -e

echo "=== Configurando endpoint de disk usage ==="

# 1. Criar script de disk usage
cat > /usr/local/bin/disk-usage.sh << 'SCRIPT'
#!/bin/bash
OUTPUT_FILE="/var/www/html/disk-usage.json"
RECORDINGS_DIR="/var/www/html/recordings"

DISK_INFO=$(df -B1 "$RECORDINGS_DIR" | tail -1)
TOTAL=$(echo "$DISK_INFO" | awk '{print $2}')
USED=$(echo "$DISK_INFO" | awk '{print $3}')
AVAILABLE=$(echo "$DISK_INFO" | awk '{print $4}')
PERCENT=$(echo "$DISK_INFO" | awk '{print $5}' | tr -d '%')

RECORDINGS_SIZE=$(du -sb "$RECORDINGS_DIR" 2>/dev/null | awk '{print $1}')
RECORDINGS_COUNT=$(find "$RECORDINGS_DIR" -name "*.mp4" -o -name "*.flv" 2>/dev/null | wc -l)

cat > "$OUTPUT_FILE" << EOF
{
  "disk_total": $TOTAL,
  "disk_used": $USED,
  "disk_available": $AVAILABLE,
  "disk_percent": $PERCENT,
  "recordings_size": ${RECORDINGS_SIZE:-0},
  "recordings_count": ${RECORDINGS_COUNT:-0},
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

chmod 644 "$OUTPUT_FILE"
SCRIPT

chmod +x /usr/local/bin/disk-usage.sh
echo "[OK] Script criado em /usr/local/bin/disk-usage.sh"

# 2. Executar uma vez para gerar o JSON
/usr/local/bin/disk-usage.sh
echo "[OK] JSON gerado em /var/www/html/disk-usage.json"
cat /var/www/html/disk-usage.json

# 3. Adicionar ao cron (a cada minuto)
CRON_LINE="* * * * * /usr/local/bin/disk-usage.sh"
(crontab -l 2>/dev/null | grep -v "disk-usage.sh"; echo "$CRON_LINE") | crontab -
echo "[OK] Cron configurado (atualiza a cada minuto)"

# 4. Adicionar location no NGINX (se nao existir)
NGINX_CONF="/etc/nginx/nginx.conf"
if grep -q "disk-usage.json" "$NGINX_CONF"; then
    echo "[OK] Location disk-usage.json ja existe no NGINX"
else
    sed -i '/location \/recordings/i \
        # Info de uso de disco\n\
        location = /disk-usage.json {\n\
            root /var/www/html;\n\
            add_header Cache-Control no-cache;\n\
            add_header Access-Control-Allow-Origin * always;\n\
            add_header Access-Control-Allow-Methods '\''GET, OPTIONS'\'' always;\n\
            add_header Access-Control-Allow-Headers '\''*'\'' always;\n\
            default_type application/json;\n\
        }\n' "$NGINX_CONF"
    echo "[OK] Location adicionado ao NGINX"
fi

# 5. Testar e recarregar NGINX
nginx -t && nginx -s reload
echo "[OK] NGINX recarregado"

echo ""
echo "=== Tudo pronto! ==="
echo "Teste: curl http://66.94.98.143/disk-usage.json"
