const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8181;

// Simple CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/ping') {
    res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: '1.0.0', type: 'whitebook-mcp-bridge' }));
    return;
  }

  if (req.method === 'GET' && req.url === '/tools') {
    res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      tools: [
        { name: 'read_file', description: 'Read a local file from the machine running the bridge.', parameters: { path: 'string' } },
        { name: 'list_dir', description: 'List files in a local directory.', parameters: { path: 'string' } }
      ]
    }));
    return;
  }

  if (req.method === 'POST' && req.url === '/execute') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { tool, params } = JSON.parse(body);
        
        if (tool === 'read_file') {
          const content = fs.readFileSync(path.resolve(params.path), 'utf8');
          res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: content.substring(0, 5000) })); // limit output
        } 
        else if (tool === 'list_dir') {
          const files = fs.readdirSync(path.resolve(params.path));
          res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: files }));
        }
        else {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ success: false, error: 'Unknown tool' }));
        }
      } catch (err) {
        res.writeHead(500, headers);
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, headers);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n\x1b[36m========================================\x1b[0m`);
  console.log(`🚀 \x1b[1mWhitebook Local Bridge is running!\x1b[0m`);
  console.log(`\x1b[36m========================================\x1b[0m\n`);
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`Your web app can now securely access local tools.`);
  console.log(`Press Ctrl+C to stop.\n`);
});
