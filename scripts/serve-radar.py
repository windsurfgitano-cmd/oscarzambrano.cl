"""Vista local del sitio y endpoint real de Radar Oscar, solo en localhost."""
import json
import sys
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
from radar_core import build_payload

ROOT=Path(__file__).resolve().parents[1]/'public'
class Preview(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        if urlsplit(self.path).path=='/api/radar':
            payload=build_payload();body=json.dumps(payload,ensure_ascii=False).encode()
            self.send_response(200 if any(s['status']=='ok'for s in payload['sources'])else 503)
            self.send_header('Content-Type','application/json; charset=utf-8');self.end_headers();self.wfile.write(body)
        else:super().do_GET()

if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1])if len(sys.argv)>1 else 8772),Preview).serve_forever()
