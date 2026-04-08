#!/usr/bin/env python3
"""Micro API para deletar gravacoes do servidor de streaming.
Roda na porta 8090, chamado via Caddy reverse proxy.
CORS gerenciado pelo Caddy - nao adicionar headers aqui."""

import os
import shutil
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote

RECORDINGS_DIR = "/var/www/html/recordings"

class Handler(BaseHTTPRequestHandler):
    def do_DELETE(self):
        path = unquote(self.path)
        filename = os.path.basename(path.rstrip("/"))
        if not filename or ".." in filename:
            self.send_response(400)
            self.end_headers()
            return

        filepath = os.path.join(RECORDINGS_DIR, filename)

        deleted = False
        if os.path.isfile(filepath):
            os.remove(filepath)
            deleted = True

        basename = filename.replace(".mp4", "")
        hlsdir = os.path.join(RECORDINGS_DIR, basename)
        if os.path.isdir(hlsdir):
            shutil.rmtree(hlsdir)
            deleted = True

        if deleted:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8090), Handler)
    print("Recordings API rodando na porta 8090")
    server.serve_forever()
