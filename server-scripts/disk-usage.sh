#!/bin/bash
# Gera JSON com informacoes de uso de disco do servidor
# Executar via cron a cada minuto:
# * * * * * /usr/local/bin/disk-usage.sh

OUTPUT_FILE="/var/www/html/disk-usage.json"
RECORDINGS_DIR="/var/www/html/recordings"

# Info do disco principal (particao onde /var/www/html esta)
DISK_INFO=$(df -B1 "$RECORDINGS_DIR" | tail -1)
TOTAL=$(echo "$DISK_INFO" | awk '{print $2}')
USED=$(echo "$DISK_INFO" | awk '{print $3}')
AVAILABLE=$(echo "$DISK_INFO" | awk '{print $4}')
PERCENT=$(echo "$DISK_INFO" | awk '{print $5}' | tr -d '%')

# Tamanho total das gravacoes
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
