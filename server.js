const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = __dirname;
const submissionsPath = path.join(root, 'submissions.json');

function loadSubmissions() {
  if (!fs.existsSync(submissionsPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(submissionsPath, 'utf8'));
  } catch {
    return [];
  }
}

function saveSubmission(payload) {
  const submissions = loadSubmissions();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...payload,
  };
  submissions.push(entry);
  fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));
  return entry;
}

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/api/submit-intake' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const requiredFields = ['name', 'email', 'phone', 'caseType', 'summary'];
        const missing = requiredFields.filter(field => !String(data[field] || '').trim());
        if (missing.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, message: 'Please complete all required fields.', missing }));
          return;
        }

        const entry = saveSubmission(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Intake submitted successfully.', submission: entry }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: 'Invalid submission payload.' }));
      }
    });
    return;
  }

  if (pathname === '/api/submissions') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(loadSubmissions()));
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    serveFile(path.join(root, 'colorado-legal-service.html'), 'text/html', res);
    return;
  }

  if (pathname === '/styles.css') {
    serveFile(path.join(root, 'styles.css'), 'text/css', res);
    return;
  }

  serveFile(path.join(root, pathname), 'application/octet-stream', res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
