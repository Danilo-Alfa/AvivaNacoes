#!/bin/bash

# Script para configurar HTTPS com Let's Encrypt no servidor de streaming
# Domínio: avinanacoes.duckdns.org
# Execute este script no servidor Contabo via SSH

set -e

DOMAIN="avivanacoes.duckdns.org"
EMAIL="seu-email@exemplo.com"  # IMPORTANTE: Mude para seu email real!

echo "============================================"
echo "Configurando HTTPS para $DOMAIN"
echo "============================================"
echo ""

# Instalar Certbot
echo "📦 Instalando Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

echo ""
echo "🔒 Obtendo certificado SSL..."
echo "IMPORTANTE: O Nginx precisa estar rodando na porta 80"
echo ""

# Obter certificado
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

echo ""
echo "✅ Certificado SSL obtido com sucesso!"
echo ""

# Verificar configuração do Nginx para RTMP
echo "📝 Verificando configuração do Nginx..."

# Backup da configuração atual
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-ssl

# Verificar se RTMP está configurado
if grep -q "application live" /etc/nginx/nginx.conf; then
    echo "✅ Configuração RTMP já existe"
else
    echo "⚠️  Configuração RTMP não encontrada. Mantendo configuração atual."
fi

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx

echo ""
echo "============================================"
echo "✅ HTTPS CONFIGURADO COM SUCESSO!"
echo "============================================"
echo ""
echo "📋 URLs atualizadas:"
echo "   Site:     https://$DOMAIN"
echo "   Stream:   https://$DOMAIN/live/stream.m3u8"
echo "   Stats:    https://$DOMAIN/stat"
echo ""
echo "   RTMP (OBS): rtmp://$DOMAIN:1935/live"
echo "   Chave:      stream"
echo ""
echo "🔄 Auto-renovação: Certificado renova automaticamente"
echo ""
echo "🔧 Próximos passos:"
echo "1. Atualize o .env do projeto:"
echo "   VITE_STREAM_URL=https://$DOMAIN/live/stream.m3u8"
echo ""
echo "2. Atualize o secret do GitHub:"
echo "   VITE_STREAM_URL=https://$DOMAIN/live/stream.m3u8"
echo ""
echo "3. Faça novo deploy do site"
echo ""
echo "============================================"
