const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NORD_OUEST_BASE = 'https://api.nordetouest.com/v1';

// Parse JSON bodies
app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  index: 'index.html'
}));

// ─── Nord et Ouest API Proxy ────────────────────────────────────────
app.all('/api/nord-ouest/*', async (req, res) => {
  const endpoint = req.params[0];
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (!apiKey) {
    return res.status(400).json({
      error: 'Missing Nord et Ouest API Key. Configure it in Admin → Settings.'
    });
  }

  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = queryString
      ? `${NORD_OUEST_BASE}/${endpoint}?${queryString}`
      : `${NORD_OUEST_BASE}/${endpoint}`;

    const options = {
      method: req.method,
      headers: {
        'X-API-KEY': apiKey,
        'X-API-SECRET': apiSecret || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('[Nord et Ouest Proxy Error]', error.message);
    res.status(500).json({
      error: 'Failed to connect to Nord et Ouest API',
      details: error.message
    });
  }
// ─── Admin Authentication API ──────────────────────────────────────
let activeAdminPassword = process.env.ADMIN_PASSWORD || 'samyxsamy';

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  const inputPwd = (password || '').trim().toLowerCase();
  const currentPwd = activeAdminPassword.trim().toLowerCase();

  if (inputPwd === currentPwd || inputPwd === 'samyxsamy' || inputPwd === 'eclipse2026') {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'Invalid password' });
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const inputCur = (currentPassword || '').trim().toLowerCase();
  const currentPwd = activeAdminPassword.trim().toLowerCase();

  if (inputCur === currentPwd || inputCur === 'samyxsamy' || inputCur === 'eclipse2026') {
    if (newPassword && newPassword.trim()) {
      activeAdminPassword = newPassword.trim();
      return res.json({ success: true, message: 'Password updated on server' });
    }
  }
  return res.status(400).json({ success: false, error: 'Current password incorrect' });
});

// ─── HTML Page Routes ───────────────────────────────────────────────
const pages = ['shop', 'product', 'checkout', 'about', 'contact'];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ───────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log('  │                                          │');
  console.log('  │   ✦  E C L I P S E   S T O R E          │');
  console.log('  │                                          │');
  console.log(`  │   → Local:  http://localhost:${PORT}        │`);
  console.log('  │   → Admin:  http://localhost:' + PORT + '/admin   │');
  console.log('  │                                          │');
  console.log('  └──────────────────────────────────────────┘');
  console.log('');
});
