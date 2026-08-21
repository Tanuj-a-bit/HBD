const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const REPLIES_FILE = path.join(__dirname, 'shravani_replies.txt');

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/save-reply') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const timestamp = new Date().toLocaleString();
        const entry = `========================================\nTime: ${timestamp}\nFriend: ${data.friendName}\nReply: ${data.reply}\n========================================\n\n`;

        fs.appendFileSync(REPLIES_FILE, entry, 'utf8');
        console.log(`[SAVED BACKEND REPLY] ${data.friendName}: ${data.reply}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Reply saved to shravani_replies.txt in backend!' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/api/replies') {
    if (fs.existsSync(REPLIES_FILE)) {
      const content = fs.readFileSync(REPLIES_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(content);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No replies submitted yet!');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
  console.log(`📝 Replies will be automatically logged to: ${REPLIES_FILE}`);
});
