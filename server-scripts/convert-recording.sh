#!/bin/bash
# Converte gravacao FLV para MP4 720p e HLS 720p
# MP4 fica disponivel em ~30s, HLS em background

INPUT=$1
BASENAME=$(basename "$INPUT" .flv)
REC_DIR="/var/www/html/recordings"
HLS_DIR="${REC_DIR}/${BASENAME}"
LOG="/var/log/recording-convert.log"

echo "$(date): INPUT=$INPUT BASENAME=$BASENAME" >> "$LOG" 2>&1

if [ ! -f "$INPUT" ]; then
  echo "$(date): ERRO - arquivo nao encontrado: $INPUT" >> "$LOG"
  exit 1
fi

echo "$(date): Tamanho FLV: $(du -h "$INPUT" | cut -f1)" >> "$LOG"

# 1. MP4 720p (rapido, disponivel em segundos)
OUTPUT_MP4="${REC_DIR}/${BASENAME}.mp4"
ffmpeg -y -i "$INPUT" -vf "scale=-2:720" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart "$OUTPUT_MP4" >> "$LOG" 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "$(date): ERRO ffmpeg MP4 (exit $RESULT)" >> "$LOG"
  exit 1
fi

chown www-data:www-data "$OUTPUT_MP4"
rm -f "$INPUT"
echo "$(date): MP4 720p pronto: $(du -h "$OUTPUT_MP4" | cut -f1)" >> "$LOG"

/usr/local/bin/disk-usage.sh 2>/dev/null

# 2. HLS 720p em BACKGROUND
(
  mkdir -p "$HLS_DIR"

  nice -n 19 ffmpeg -y -i "$OUTPUT_MP4" -threads 2 \
    -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k \
    -f hls \
    -hls_time 6 \
    -hls_playlist_type vod \
    -hls_flags independent_segments \
    -hls_segment_filename "${HLS_DIR}/seg_%03d.ts" \
    "${HLS_DIR}/index.m3u8" >> "$LOG" 2>&1

  # Criar master.m3u8 apontando para o unico stream
  cat > "${HLS_DIR}/master.m3u8" << 'M3U8'
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720
index.m3u8
M3U8

  chown -R www-data:www-data "$HLS_DIR"
  /usr/local/bin/disk-usage.sh 2>/dev/null

  echo "$(date): HLS pronto: $BASENAME" >> "$LOG"
) &

echo "$(date): HLS gerando em background (PID: $!)" >> "$LOG"
