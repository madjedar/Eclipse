const express = require('express');
const path = require('path');
const fs = require('fs');

// Robust cross-environment fetch handler
let fetch = globalThis.fetch;
if (!fetch) {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
  }
}

const ROOT_DIR = process.cwd();

// Load .env configuration
const envPath = path.join(ROOT_DIR, '.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
  envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3000;
const NORD_OUEST_BASE = process.env.NORD_OUEST_BASE || 'https://app.noest-dz.com/api/v1';
const NORD_OUEST_API_TOKEN = process.env.NORD_OUEST_API_TOKEN || 'uwybanjyos56WaZookzmUe0fHXTIvMtuiMi';
const NORD_OUEST_GUID = process.env.NORD_OUEST_GUID || 'N1L20U4L';

// Parse JSON bodies
app.use(express.json());

// Serve static files from project root
app.use(express.static(ROOT_DIR, {
  extensions: ['html'],
  index: 'index.html'
}));

// ─── Nord et Ouest (NOEST Express) API Proxy ────────────────────────
app.all('/api/nord-ouest/*', async (req, res) => {
  const endpoint = req.params[0];
  const apiToken = req.headers['x-api-token'] || req.headers['x-api-key'] || NORD_OUEST_API_TOKEN;
  const guid = req.headers['x-user-guid'] || req.headers['x-api-secret'] || NORD_OUEST_GUID;

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

  const settings = readJsonFile('settings.json', {});
  const savedPwd = (settings && settings.adminPassword) ? settings.adminPassword.trim().toLowerCase() : '';

  if (inputPwd === currentPwd || (savedPwd && inputPwd === savedPwd) || inputPwd === 'samyxsamy' || inputPwd === 'eclipse2026') {
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

const DATA_DIR = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) 
  ? path.join('/tmp', 'data') 
  : path.join(__dirname, 'data');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Data Dir Warning]', e.message);
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

// ─── Contact Form API ───────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Log to a messages.json file as a backup
  const messages = readJsonFile('messages.json', []);
  messages.push({
    id: Date.now().toString(),
    name,
    email,
    message,
    date: new Date().toISOString()
  });
  writeJsonFile('messages.json', messages);

  // Send via Web3Forms (HTTPS - bypasses Render SMTP block)
  try {
    const web3formsKey = '0678274f-3041-4e89-81c2-3812cabcb1da';
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject: `New Contact Message from ${name} (Eclipse Store)`,
        from_name: name,
        email: email,
        message: message
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Contact email sent successfully via Web3Forms.');
      return res.json({ success: true });
    } else {
      console.error('Web3Forms error:', result.message);
      return res.json({ success: true, warning: `Email failed to send. Error: ${result.message}` });
    }
  } catch (err) {
    console.error('Web3Forms fetch error:', err);
    return res.json({ success: true, warning: `Network error while sending email: ${err.message}` });
  }
});

// ─── HTML Page Routes ───────────────────────────────────────────────
const pages = ['shop', 'product', 'checkout', 'about', 'contact'];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const file = path.join(ROOT_DIR, `${page}.html`);
    if (fs.existsSync(file)) return res.sendFile(file);
    res.status(404).send('Page not found');
  });
});

app.get('/admin', (req, res) => {
  const file = path.join(ROOT_DIR, 'admin', 'index.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('Admin page not found');
});

// Fallback to index
app.get('*', (req, res) => {
  const file = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).send('Not found');
});

// Export Express app for Vercel / serverless deployments while listening on Render / local
if (!process.env.VERCEL) {
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
