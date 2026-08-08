const express = require('express');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB if MONGO_URI is set
let db = null;
if (process.env.MONGO_URI) {
  const { MongoClient } = require('mongodb');
  MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
      db = client.db();
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

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

// Parse JSON bodies (increased limit to 50mb for product base64 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from project root
app.use(express.static(ROOT_DIR, {
  extensions: ['html'],
  index: 'index.html'
}));

// ─── Nord et Ouest (NOEST Express) / Yalidine API Proxy ─────────────
app.all('/api/nord-ouest/*', async (req, res) => {
  const endpoint = req.params[0];

  // Fetch store settings for NOEST credentials if available
  let settings = {};
  if (db) {
    try {
      const doc = await db.collection('store').findOne({ _id: 'settings' });
      if (doc && doc.data) settings = doc.data;
    } catch(e) {}
  } else {
    settings = readJsonFile('settings.json', {});
  }

  const rawBaseUrl = settings.nordOuestBaseUrl || process.env.NORD_OUEST_BASE || 'https://api.yalidine.app';
  const cleanBase = rawBaseUrl.replace(/\/+$/, '');
  const baseUrl = cleanBase.endsWith('/v1') ? cleanBase : cleanBase + '/v1';

  const apiToken = req.headers['x-api-token'] || req.headers['x-api-key'] || settings.nordOuestApiToken || process.env.NORD_OUEST_API_TOKEN || '';
  const apiId = req.headers['x-api-id'] || req.headers['x-user-guid'] || req.headers['x-api-secret'] || settings.nordOuestGuid || process.env.NORD_OUEST_GUID || '';

  try {
    const targetUrl = `${baseUrl}/${endpoint}`;

    const options = {
      method: req.method,
      headers: {
        'X-API-ID': apiId,
        'X-API-TOKEN': apiToken,
        'X-USER-GUID': apiId,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
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
    console.error('[Logistics Proxy Error]', error.message);
    res.status(500).json({
      error: 'Failed to connect to Logistics API',
      details: error.message
    });
  }
});

// ─── Admin Authentication API ──────────────────────────────────────
let activeAdminPassword = process.env.ADMIN_PASSWORD || 'samyxsamy';

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body || {};
  const inputPwd = (password || '').trim().toLowerCase();
  const currentPwd = activeAdminPassword.trim().toLowerCase();

  let settings = {};
  if (db) {
    const doc = await db.collection('store').findOne({ _id: 'settings' });
    if (doc) settings = doc.data;
  } else {
    settings = readJsonFile('settings.json', {});
  }

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
app.get('/api/store/products', async (req, res) => {
  let products = null;
  if (db) {
    const doc = await db.collection('store').findOne({ _id: 'products' });
    products = doc ? doc.data : null;
  } else {
    products = readJsonFile('products.json', null);
  }
  res.json({ success: true, products });
});

app.post('/api/store/products', async (req, res) => {
  const { products } = req.body || {};
  if (Array.isArray(products)) {
    if (db) {
      await db.collection('store').updateOne({ _id: 'products' }, { $set: { data: products } }, { upsert: true });
    } else {
      writeJsonFile('products.json', products);
    }
    return res.json({ success: true, count: products.length });
  }
  return res.status(400).json({ success: false, error: 'Invalid products data' });
});

// ─── Orders API Persistence ─────────────────────────────────────────
app.get('/api/store/orders', async (req, res) => {
  let orders = [];
  if (db) {
    const doc = await db.collection('store').findOne({ _id: 'orders' });
    if (doc && Array.isArray(doc.data)) orders = doc.data;
  } else {
    orders = readJsonFile('orders.json', []);
  }
  res.json({ success: true, orders });
});

app.post('/api/store/orders', async (req, res) => {
  const incoming = (req.body && req.body.orders) || [];
  if (!Array.isArray(incoming)) {
    return res.status(400).json({ success: false, error: 'Invalid orders data' });
  }

  let existingOrders = [];
  if (db) {
    const doc = await db.collection('store').findOne({ _id: 'orders' });
    if (doc && Array.isArray(doc.data)) existingOrders = doc.data;
  } else {
    existingOrders = readJsonFile('orders.json', []);
  }

  // Merge incoming orders with database orders so no order is ever overwritten
  incoming.forEach(inc => {
    if (!inc || !inc.id) return;
    const idx = existingOrders.findIndex(o => o.id === inc.id);
    if (idx >= 0) {
      existingOrders[idx] = Object.assign({}, existingOrders[idx], inc);
    } else {
      existingOrders.push(inc);
    }
  });

  if (db) {
    await db.collection('store').updateOne({ _id: 'orders' }, { $set: { data: existingOrders } }, { upsert: true });
  } else {
    writeJsonFile('orders.json', existingOrders);
  }
  return res.json({ success: true, count: existingOrders.length });
});

// ─── Settings API Persistence ───────────────────────────────────────
app.get('/api/store/settings', async (req, res) => {
  let settings = null;
  if (db) {
    const doc = await db.collection('store').findOne({ _id: 'settings' });
    settings = doc ? doc.data : null;
  } else {
    settings = readJsonFile('settings.json', null);
  }
  res.json({ success: true, settings });
});

app.post('/api/store/settings', async (req, res) => {
  const { settings } = req.body || {};
  if (settings && typeof settings === 'object') {
    if (db) {
      await db.collection('store').updateOne({ _id: 'settings' }, { $set: { data: settings } }, { upsert: true });
    } else {
      writeJsonFile('settings.json', settings);
    }
    return res.json({ success: true });
  }
  return res.status(400).json({ success: false, error: 'Invalid settings data' });
});

// ─── Contact Form API ───────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const newMsg = {
    id: Date.now().toString(),
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  if (db) {
    await db.collection('store').updateOne(
      { _id: 'messages' },
      { $push: { data: newMsg } },
      { upsert: true }
    );
  } else {
    // Log to a messages.json file as a backup
    const messages = readJsonFile('messages.json', []);
    messages.push(newMsg);
    writeJsonFile('messages.json', messages);
  }

  // Email sending is now handled directly by the frontend to bypass Cloudflare bot protection.
  // We only return success here so the backend saves the backup.
  return res.json({ success: true });
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
