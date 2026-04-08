#!/bin/bash
# Converte gravacao FLV para HLS VOD com multiplas qualidades
# Chamado pelo NGINX-RTMP: exec_record_done /usr/local/bin/convert-recording.sh $path

INPUT=$1
BASENAME=$(basename "$INPUT" .flv)
REC_DIR="/var/www/html/recordings"
HLS_DIR="${REC_DIR}/${BASENAME}"

mkdir -p "$HLS_DIR"

# 1. Gerar MP4 original (copy, rapido) - para download
OUTPUT_MP4="${REC_DIR}/${BASENAME}.mp4"
ffmpeg -y -i "$INPUT" -c copy -movflags +faststart "$OUTPUT_MP4"
chown www-data:www-data "$OUTPUT_MP4"

# 2. Gerar HLS com 3 qualidades (1080p, 720p, 480p)
ffmpeg -y -i "$OUTPUT_MP4" \
  -filter_complex "[0:v]split=3[v1][v2][v3]; \
    [v1]scale=-2:1080[v1out]; \
    [v2]scale=-2:720[v2out]; \
    [v3]scale=-2:480[v3out]" \
  -map "[v1out]" -map 0:a -c:v:0 libx264 -preset fast -crf 21 -c:a:0 aac -b:a:0 128k \
  -map "[v2out]" -map 0:a -c:v:1 libx264 -preset fast -crf 23 -c:a:1 aac -b:a:1 128k \
  -map "[v3out]" -map 0:a -c:v:2 libx264 -preset fast -crf 25 -c:a:2 aac -b:a:2 96k \
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

echo "Conversao completa: $BASENAME (MP4 + HLS 1080p/720p/480p)"
