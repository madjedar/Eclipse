const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NORD_OUEST_BASE = process.env.NORD_OUEST_BASE || 'https://app.noest-dz.com/api/v1';

// Parse JSON bodies
app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  index: 'index.html'
}));

// ─── Nord et Ouest (NOEST Express) API Proxy ────────────────────────
app.all('/api/nord-ouest/*', async (req, res) => {
  const endpoint = req.params[0];
  const apiToken = req.headers['x-api-token'] || req.headers['x-api-key'] || 'uwybanjyos56WaZookzmUe0fHXTIvMtuiMi';
  const guid = req.headers['x-user-guid'] || req.headers['x-api-secret'] || 'N1L20U4L';

  try {
    const queryParams = new URLSearchParams(req.query);
    if (!queryParams.has('api_token')) queryParams.set('api_token', apiToken);
    if (!queryParams.has('user_guid')) queryParams.set('user_guid', guid);

    const targetUrl = `${NORD_OUEST_BASE}/${endpoint}?${queryParams.toString()}`;

    const options = {
      method: req.method,
      headers: {
        'X-API-TOKEN': apiToken,
        'X-USER-GUID': guid,
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const payload = Object.assign({}, req.body, {
        api_token: apiToken,
        user_guid: guid,
        guid: guid
      });
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(targetUrl, options);
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
});

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
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile(filename, defaultVal = []) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return defaultVal;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultVal;
  }
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`[FS Write Error ${filename}]`, e);
    return false;
  }
}

// ─── Products API Persistence ───────────────────────────────────────
app.get('/api/store/products', (req, res) => {
  const products = readJsonFile('products.json', null);
  res.json({ success: true, products });
});

app.post('/api/store/products', (req, res) => {
  const { products } = req.body || {};
  if (Array.isArray(products)) {
    writeJsonFile('products.json', products);
    return res.json({ success: true, count: products.length });
  }
  return res.status(400).json({ success: false, error: 'Invalid products data' });
});

// ─── Orders API Persistence ─────────────────────────────────────────
app.get('/api/store/orders', (req, res) => {
  const orders = readJsonFile('orders.json', []);
  res.json({ success: true, orders });
});

app.post('/api/store/orders', (req, res) => {
  const { orders } = req.body || {};
  if (Array.isArray(orders)) {
    writeJsonFile('orders.json', orders);
    return res.json({ success: true, count: orders.length });
  }
  return res.status(400).json({ success: false, error: 'Invalid orders data' });
});

// ─── Settings API Persistence ───────────────────────────────────────
app.get('/api/store/settings', (req, res) => {
  const settings = readJsonFile('settings.json', null);
  res.json({ success: true, settings });
});

app.post('/api/store/settings', (req, res) => {
  const { settings } = req.body || {};
  if (settings && typeof settings === 'object') {
    writeJsonFile('settings.json', settings);
    return res.json({ success: true });
  }
  return res.status(400).json({ success: false, error: 'Invalid settings data' });
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

// Export Express app for Vercel / serverless deployments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
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
}

module.exports = app;
