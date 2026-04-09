#!/bin/bash
# Converte gravacao FLV para HLS VOD com multiplas qualidades
# Usa nice + limitacao de threads para nao saturar CPU durante proxima live

INPUT=$1
BASENAME=$(basename "$INPUT" .flv)
REC_DIR="/var/www/html/recordings"
HLS_DIR="${REC_DIR}/${BASENAME}"

mkdir -p "$HLS_DIR"

# 1. MP4 original (copy, sem re-encode) - rapido
OUTPUT_MP4="${REC_DIR}/${BASENAME}.mp4"
ffmpeg -y -i "$INPUT" -c copy -movflags +faststart "$OUTPUT_MP4"
chown www-data:www-data "$OUTPUT_MP4"

# 2. HLS multi-qualidade - com nice 19 (prioridade minima) e max 2 threads
# Isso evita saturar os 4 cores, deixando headroom para live/nginx
nice -n 19 ffmpeg -y -i "$OUTPUT_MP4" -threads 2 \
  -filter_complex "[0:v]split=3[v1][v2][v3]; \
    [v1]scale=-2:1080[v1out]; \
    [v2]scale=-2:720[v2out]; \
    [v3]scale=-2:480[v3out]" \
  -map "[v1out]" -map 0:a -c:v:0 libx264 -preset fast -crf 23 -c:a:0 aac -b:a:0 128k \
  -map "[v2out]" -map 0:a -c:v:1 libx264 -preset fast -crf 25 -c:a:1 aac -b:a:1 96k \
  -map "[v3out]" -map 0:a -c:v:2 libx264 -preset fast -crf 28 -c:a:2 aac -b:a:2 64k \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_flags independent_segments \
  -hls_segment_filename "${HLS_DIR}/seg_%v_%03d.ts" \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p" \
  "${HLS_DIR}/%v.m3u8"

chown -R www-data:www-data "$HLS_DIR"

# Remover FLV original
rm -f "$INPUT"

# Atualizar info de disco
/usr/local/bin/disk-usage.sh 2>/dev/null

echo "$(date): Conversao completa: $BASENAME" >> /var/log/recording-convert.log
