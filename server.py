from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json, os, urllib.request

BACKEND = os.environ.get('SUMON_BACKEND', 'https://sumon-assistente.onrender.com/api/craft')

class H(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/api/craft':
            return self.send_error(404)
        raw = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        try:
            payload = json.loads(raw.decode('utf-8'))
            req = urllib.request.Request(BACKEND, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=180) as r:
                b = r.read()
        except Exception as e:
            print('erro no backend:', e)
            b = json.dumps({'ok': False, 'error': 'O backend do Sumon não respondeu. Tente novamente.'}).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers(); self.wfile.write(b)

ThreadingHTTPServer(('127.0.0.1', 8080), H).serve_forever()
