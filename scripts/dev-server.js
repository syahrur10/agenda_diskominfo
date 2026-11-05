// Server lokal (tanpa dependensi): menyajikan folder public/ dan meneruskan /api/extract ke api/extract.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');

for (const f of ['.env.local', '.env']) {
  try {
    fs.readFileSync(path.join(ROOT, f), 'utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
  } catch (e) {}
}

const extract = require('../api/extract.js');
const PORT = process.env.PORT || 3000;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.ico':'image/x-icon' };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/api/extract') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', async () => {
      try { req.body = JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch (e) { req.body = {}; }
      res.status = code => { res.statusCode = code; return res; };
      res.json = obj => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); };
      try { await extract(req, res); } catch (e) { res.status(500).json({ error: e.message }); }
    });
    return;
  }
  const file = path.join(PUB, url === '/' ? 'index.html' : url);
  if (!file.startsWith(PUB)) { res.statusCode = 403; return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.statusCode = 404; return res.end('Tidak ditemukan'); }
    res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log(`\n  Agenda Diskominfo berjalan di http://localhost:${PORT}`);
  console.log(process.env.ANTHROPIC_API_KEY ? '  AI surat: aktif' : '  AI surat: nonaktif (isi ANTHROPIC_API_KEY di .env.local)');
  console.log('');
});
