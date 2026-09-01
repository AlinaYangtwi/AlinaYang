// 零依赖静态文件服务器：支持 --port / --host / -p 及 PORT 环境变量
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function argValue(names, fallback) {
  for (let i = 0; i < args.length; i++) {
    for (const n of names) {
      if (args[i] === n && args[i + 1]) return args[i + 1];
      if (args[i].startsWith(n + '=')) return args[i].slice(n.length + 1);
    }
  }
  return fallback;
}

const port = parseInt(argValue(['--port', '-p'], process.env.PORT || '7100'), 10);
const host = argValue(['--host', '-h'], process.env.HOST || '0.0.0.0');
const root = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`Alina Yang resume site → http://localhost:${port}/`);
});
