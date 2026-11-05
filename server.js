// Server lokal tanpa dependensi: menyajikan file statis dan meneruskan /api/extract ke api/extract.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Muat .env.local / .env (tanpa paket tambahan)
for (const f of ['.env.local', '.env']) {
  try {
    fs.readFileSync(path.join(__dirname, f), 'utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
  } catch (e) {}
}

const extract = require('./api/extract.js');
const PORT = process.env.PORT || 3000;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.ico':'image/x-icon' };
const PUBLIC = new Set(['/index.html', '/app.js', '/style.css']);

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

  const p = url === '/' ? '/index.html' : url;
  if (!PUBLIC.has(p) && !p.startsWith('/assets/')) { res.statusCode = 404; return res.end('Tidak ditemukan'); }
  const file = path.join(__dirname, p);
  if (!file.startsWith(__dirname)) { res.statusCode = 403; return res.end(); }
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
