"""Endpoint de feeds públicos y fijos. Sin parámetros de URLs ni credenciales."""
import json
from http.server import BaseHTTPRequestHandler
from scripts.radar_core import build_payload

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        payload=build_payload()
        ok=any(s['status']=='ok'for s in payload['sources'])
        body=json.dumps(payload,ensure_ascii=False).encode('utf-8')
        self.send_response(200 if ok else 503)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Cache-Control','public, max-age=0, must-revalidate')
        self.send_header('CDN-Cache-Control','public, s-maxage=900, stale-while-revalidate=60' if ok else 'no-store')
        self.send_header('Content-Length',str(len(body)))
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers()
        self.wfile.write(body)

    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.end_headers()
