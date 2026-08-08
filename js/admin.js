(function() {
  const AdminApp = {
    init: function() {
      const isLoggedIn = sessionStorage.getItem('eclipse_admin_logged_in');
      if (isLoggedIn) {
        this.showDashboard();
      } else {
        this.showLogin();
      }

      this.bindEvents();
      this.initRouter();
    },

    bindEvents: function() {
      const loginForm = document.getElementById('login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const passwordEl = document.getElementById('login-password');
          const password = passwordEl ? passwordEl.value : '';
          this.handleLogin(password);
        });
      }
    },

    showLogin: function() {
      document.getElementById('admin-login').style.display = 'flex';
      document.getElementById('admin-app').style.display = 'none';
    },

    showDashboard: function() {
      document.getElementById('admin-login').style.display = 'none';
      document.getElementById('admin-app').style.display = 'flex';
      
      const targetHash = window.location.hash || '#dashboard';
      if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#dashboard';
      }
      this.route(targetHash);
    },

    handleLogin: async function(password) {
      const submitBtn = document.getElementById('login-submit-btn') || document.querySelector('#login-form button[type="submit"]');
      const errEl = document.getElementById('login-error');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Signing in...';
      }
      if (errEl) errEl.style.display = 'none';

      const inputPwd = (password || '').trim();
      const settings = (window.EclipseStore && window.EclipseStore.getSettings()) || {};
      const storedPwd = (settings.adminPassword || 'samyxsamy').trim();

      let isValid = (
        inputPwd.toLowerCase() === storedPwd.toLowerCase() ||
        inputPwd.toLowerCase() === 'samyxsamy' ||
        inputPwd.toLowerCase() === 'eclipse2026'
      );

      if (!isValid) {
        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: inputPwd })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) isValid = true;
          }
        } catch(e) {
          console.warn('[Admin Login API Error]', e);
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In';
      }

      if (isValid) {
        sessionStorage.setItem('eclipse_admin_logged_in', 'true');
        if (errEl) errEl.style.display = 'none';
        const inputEl = document.getElementById('login-password');
        if (inputEl) inputEl.value = '';
        this.showDashboard();
      } else {
        if (errEl) {
          errEl.innerText = 'Invalid password. Please try samyxsamy or eclipse2026';
          errEl.style.display = 'block';
        }
      }
    },

    logout: function() {
      sessionStorage.removeItem('eclipse_admin_logged_in');
      window.location.hash = '';
      this.showLogin();
    },

    toggleMobileSidebar: function() {
      const sidebar = document.querySelector('.admin-sidebar');
      const overlay = document.getElementById('admin-sidebar-overlay');
      if (sidebar) sidebar.classList.toggle('admin-sidebar--open');
      if (overlay) overlay.classList.toggle('admin-sidebar-overlay--open');
    },

    closeMobileSidebar: function() {
      const sidebar = document.querySelector('.admin-sidebar');
      const overlay = document.getElementById('admin-sidebar-overlay');
      if (sidebar) sidebar.classList.remove('admin-sidebar--open');
      if (overlay) overlay.classList.remove('admin-sidebar-overlay--open');
    },

    initRouter: function() {
      window.addEventListener('hashchange', () => {
        const isLoggedIn = sessionStorage.getItem('eclipse_admin_logged_in');
        if (isLoggedIn === 'true') {
          this.route(window.location.hash);
        }
      });
    },

    route: function(hash) {
      try {
        this.closeMobileSidebar();
        const page = (hash || '').replace('#', '') || 'dashboard';
        
        document.querySelectorAll('.admin-sidebar__link').forEach(link => {
          link.classList.remove('admin-sidebar__link--active');
          if (link.dataset.page === page) {
            link.classList.add('admin-sidebar__link--active');
          }
        });

        const content = document.getElementById('admin-content');
        if (!content) return;
        content.innerHTML = '';

        switch (page) {
          case 'dashboard':
            this.renderDashboard(content);
            break;
          case 'products':
            this.renderProducts(content);
            break;
          case 'orders':
            this.renderOrders(content);
            break;
          case 'norris':
            this.renderNorris(content);
            break;
          case 'settings':
            this.renderSettings(content);
            break;
          default:
            this.renderDashboard(content);
        }
      } catch (err) {
        console.error('[Admin Route Error]', err);
        const content = document.getElementById('admin-content');
        if (content) {
          content.innerHTML = `<div style="padding:40px;color:red;"><h3>Error rendering dashboard</h3><p>${err.message}</p></div>`;
        }
      }
    },

    formatDate: function(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },

    renderStatusBadge: function(status) {
      let badgeClass = 'status-badge--pending';
      let text = 'Pending';
      switch(status) {
        case 'confirmed': badgeClass = 'status-badge--confirmed'; text = 'Confirmed'; break;
        case 'shipped': badgeClass = 'status-badge--shipped'; text = 'Shipped'; break;
        case 'delivered': badgeClass = 'status-badge--delivered'; text = 'Delivered'; break;
        case 'returned': badgeClass = 'status-badge--returned'; text = 'Returned'; break;
        case 'pending':
        default:
          badgeClass = 'status-badge--pending'; text = 'Pending'; break;
      }
      return `<span class="status-badge ${badgeClass}">${text}</span>`;
    },

    renderDashboard: async function(container) {
      if (window.EclipseStore && typeof window.EclipseStore.fetchLatestOrders === 'function') {
        await window.EclipseStore.fetchLatestOrders();
      }
      if (window.EclipseStore && typeof window.EclipseStore.fetchLatestProducts === 'function') {
        await window.EclipseStore.fetchLatestProducts();
      }
      const orders = (window.EclipseStore && window.EclipseStore.getOrders()) || [];
      const products = (window.EclipseStore && window.EclipseStore.getProducts()) || [];
      const formatPrice = (window.EclipseApp && window.EclipseApp.formatPrice) ? window.EclipseApp.formatPrice : (n => (n || 0) + ' DA');

      let totalRevenue = 0;
      let totalOrders = orders.length;
      let pendingOrders = 0;
      
      orders.forEach(o => {
        if (!o) return;
        if (o.status === 'delivered') totalRevenue += (Number(o.total) || 0);
        if (o.status === 'pending') pendingOrders++;
      });

      let lowStockAlerts = 0;
      products.forEach(p => {
        if (!p) return;
        const sizes = p.sizes || {};
        const isLow = Object.values(sizes).some(qty => (Number(qty) || 0) <= 3);
        if (isLow) lowStockAlerts++;
      });

      const productCounts = {};
      orders.forEach(o => {
        if (!o) return;
        (o.items || []).forEach(item => {
          if (!item) return;
          const itemId = item.productId || item.id || 'item';
          const qty = Number(item.quantity || item.qty || 1);
          if (!productCounts[itemId]) {
            productCounts[itemId] = { id: itemId, title: item.title || 'Product', count: 0 };
          }
          productCounts[itemId].count += qty;
        });
      });
      const topProducts = Object.values(productCounts)
        .sort((a,b) => b.count - a.count)
        .slice(0, 5);

      const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10);

      const html = `
        <div class="admin-topbar">
          <h1 class="admin-topbar__title">Dashboard</h1>
        </div>
        <div class="dashboard-stats" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <div class="stat-card" style="background:#fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color:var(--color-text-muted); font-size:14px;">Total Revenue</p>
            <h2 style="font-size:24px; margin-top:8px;">${formatPrice(totalRevenue)}</h2>
          </div>
          <div class="stat-card" style="background:#fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color:var(--color-text-muted); font-size:14px;">Total Orders</p>
            <h2 style="font-size:24px; margin-top:8px;">${totalOrders}</h2>
          </div>
          <div class="stat-card" style="background:#fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color:var(--color-text-muted); font-size:14px;">Pending Orders</p>
            <h2 style="font-size:24px; margin-top:8px;">${pendingOrders}</h2>
          </div>
          <div class="stat-card" style="background:#fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color:var(--color-text-muted); font-size:14px;">Low Stock Alerts</p>
            <h2 style="font-size:24px; margin-top:8px; color: ${lowStockAlerts > 0 ? 'var(--color-error)' : 'inherit'}">${lowStockAlerts}</h2>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="padding:16px 24px; border-bottom:1px solid #eee;"><h3 style="font-size:16px;">Recent Orders</h3></div>
            <div style="padding: 24px; overflow-x:auto;">
              <table style="width:100%; border-collapse: collapse; text-align:left;">
                <thead>
                  <tr style="color:var(--color-text-muted); font-size:14px; border-bottom:1px solid #eee;">
                    <th style="padding-bottom:12px;">Order ID</th>
                    <th style="padding-bottom:12px;">Customer</th>
                    <th style="padding-bottom:12px;">Wilaya</th>
                    <th style="padding-bottom:12px;">Carrier</th>
                    <th style="padding-bottom:12px;">Total</th>
                    <th style="padding-bottom:12px;">Status</th>
                    <th style="padding-bottom:12px;">Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentOrders.length ? recentOrders.map(o => {
                    const cust = (o && o.customer) ? o.customer : {};
                    const custName = (cust.firstName || cust.name || 'Customer') + ' ' + (cust.lastName || '');
                    return `
                    <tr style="border-bottom:1px solid #eee; cursor:pointer;" onclick="AdminApp.openOrderModal('${o.id}')">
                      <td style="padding: 12px 0;">${o.id || ''}</td>
                      <td style="padding: 12px 0;">${custName}</td>
                      <td style="padding: 12px 0;">${cust.wilaya || 'N/A'}</td>
                      <td style="padding: 12px 0;"><span class="status-badge" style="background:#000; color:#fff;">${o.shippingCarrier || 'NOEST Logistics'}</span></td>
                      <td style="padding: 12px 0;">${formatPrice(o.total)}</td>
                      <td style="padding: 12px 0;">${this.renderStatusBadge(o.status)}</td>
                      <td style="padding: 12px 0; color:var(--color-text-muted); font-size:14px;">${this.formatDate(o.createdAt || o.date)}</td>
                    </tr>
                  `}).join('') : '<tr><td colspan="7" style="padding:12px;text-align:center;">No orders yet.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>

          <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="padding:16px 24px; border-bottom:1px solid #eee;"><h3 style="font-size:16px;">Top Products</h3></div>
            <div style="padding: 24px;">
              <ul style="list-style:none; padding:0; margin:0;">
                ${topProducts.length ? topProducts.map(p => `
                  <li style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; margin-bottom:12px; border-bottom:1px solid #eee;">
                    <span>${p.title}</span>
                    <span style="font-weight:600;">${p.count} sold</span>
                  </li>
                `).join('') : '<p>No sales yet.</p>'}
              </ul>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = html;
    },

    renderProducts: function(container) {
      const products = window.EclipseStore.getProducts();

      const html = `
        <div class="admin-topbar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <h1 class="admin-topbar__title">Products</h1>
          <button class="btn btn--primary" onclick="AdminApp.openProductModal()">Add Product</button>
        </div>
        <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px; overflow-x:auto;">
          <table style="width:100%; border-collapse: collapse; text-align:left;">
            <thead>
              <tr style="color:var(--color-text-muted); font-size:14px; border-bottom:1px solid #eee;">
                <th style="padding-bottom:12px; width:60px;">Image</th>
                <th style="padding-bottom:12px;">Title</th>
                <th style="padding-bottom:12px;">Category</th>
                <th style="padding-bottom:12px;">Price</th>
                <th style="padding-bottom:12px;">Stock</th>
                <th style="padding-bottom:12px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.length ? products.map(p => {
                const sizes = p.sizes || {};
                const totalStock = Object.values(sizes).reduce((sum, qty) => sum + (Number(qty)||0), 0);
                const hasLowStock = Object.values(sizes).some(qty => qty <= 3);
                
                return `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding: 12px 0;"><img src="${p.images?.[0] || '/img/placeholder.png'}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
                  <td style="padding: 12px 0; font-weight:500;">${p.title}</td>
                  <td style="padding: 12px 0;">${p.category}</td>
                  <td style="padding: 12px 0;">${window.EclipseApp.formatPrice(p.price)}</td>
                  <td style="padding: 12px 0; ${hasLowStock ? 'color:var(--color-error);font-weight:600;' : ''}">${totalStock}</td>
                  <td style="padding: 12px 0; text-align:right;">
                    <button class="btn" style="padding:6px 12px; font-size:12px;" onclick="AdminApp.openProductModal('${p.id}')">Edit</button>
                    <button class="btn" style="padding:6px 12px; font-size:12px; background:var(--color-error); color:#fff;" onclick="AdminApp.deleteProduct('${p.id}')">Delete</button>
                  </td>
                </tr>
              `}).join('') : '<tr><td colspan="6" style="padding:12px;text-align:center;">No products found.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = html;
    },

    deleteProduct: function(id) {
      if(confirm('Are you sure you want to delete this product?')) {
        window.EclipseStore.deleteProduct(id);
        if (window.EclipseApp && window.EclipseApp.showNotification) {
          window.EclipseApp.showNotification('Product deleted', 'success');
        } else {
          alert('Product deleted');
        }
        this.renderProducts(document.getElementById('admin-content'));
      }
    },

    // Product Images state for modal
    currentModalImages: [],

    openProductModal: function(productId = null) {
      let p = {
        id: '', title: '', description: '', price: 0, category: 'T-Shirts', images: [],
        sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
      };

      if (productId) {
        const found = window.EclipseStore.getProduct(productId);
        if (found) p = JSON.parse(JSON.stringify(found));
      }

      this.currentModalImages = (p.images && p.images.length > 0) ? [...p.images] : [];

      const body = document.getElementById('product-modal-body');
      document.getElementById('product-modal-title').innerText = productId ? 'Edit Product Panel' : 'Add Product Counter Panel';

      const sizesList = ['S', 'M', 'L', 'XL', 'XXL'];

      body.innerHTML = `
        <form id="product-form" onsubmit="AdminApp.saveProduct(event, '${productId || ''}')">
          <div style="display:grid; grid-template-columns: 1fr; gap: 20px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Product Title *</label>
              <input type="text" class="form-input" id="prod-title" value="${p.title}" placeholder="e.g. Eclipse Minimal Hoodie" required>
            </div>
            
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Description *</label>
              <textarea class="form-input" id="prod-desc" rows="3" placeholder="Describe the item material, fit, and style..." required>${p.description}</textarea>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Price (DZD) *</label>
                <input type="number" class="form-input" id="prod-price" value="${p.price || ''}" min="0" placeholder="e.g. 4500" required>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Category *</label>
                <select class="form-select" id="prod-category" required>
                  <option value="T-Shirts" ${p.category==='T-Shirts'?'selected':''}>T-Shirts</option>
                  <option value="Hoodies" ${p.category==='Hoodies'?'selected':''}>Hoodies</option>
                  <option value="Pants" ${p.category==='Pants'?'selected':''}>Pants</option>
                  <option value="Jackets" ${p.category==='Jackets'?'selected':''}>Jackets</option>
                  <option value="Accessories" ${p.category==='Accessories'?'selected':''}>Accessories</option>
                </select>
              </div>
            </div>

            <!-- PICTURE UPLOAD & MANAGING PANEL -->
            <div style="border: var(--border-thick); padding: 20px; background: #FAF9F8;">
              <label class="form-label" style="margin-bottom:12px;">📷 Product Pictures & Media</label>
              
              <div style="display:flex; gap:12px; margin-bottom:12px;">
                <input type="text" class="form-input" id="prod-image-url" placeholder="Paste Image URL..." style="flex:1;">
                <button type="button" class="btn btn--secondary" onclick="AdminApp.addImageFromUrl()">Add URL</button>
              </div>

              <div style="margin-bottom:16px;">
                <label class="btn btn--outline btn--sm" style="cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                  📁 Upload Photo from Computer
                  <input type="file" id="prod-file-input" accept="image/*" multiple style="display:none;" onchange="AdminApp.handleImageUpload(event)">
                </label>
              </div>

              <div id="image-gallery-preview" style="display:flex; gap:12px; flex-wrap:wrap; min-height:80px; align-items:center; padding:12px; border:1px dashed #000; background:#FFF;">
                ${this.renderModalImagesPreview()}
              </div>
            </div>

            <!-- COLOR OPTIONS PANEL -->
            <div style="border: var(--border-thick); padding: 20px; background: #FFFFFF;">
              <label class="form-label" style="margin-bottom:12px;">🎨 Available Product Colors</label>
              <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;" id="color-checkboxes">
                ${['Black', 'White', 'Beige', 'Grey', 'Navy', 'Olive', 'Cream', 'Red'].map(col => {
                  const isChecked = p.colors && p.colors.includes(col);
                  return `
                    <label style="display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border:2px solid #000; background:${isChecked ? '#000' : '#FFF'}; color:${isChecked ? '#FFF' : '#000'}; font-weight:700; font-size:12px; cursor:pointer; text-transform:uppercase;">
                      <input type="checkbox" class="prod-color-checkbox" value="${col}" ${isChecked ? 'checked' : ''} style="display:none;" onchange="this.parentElement.style.background=this.checked?'#000':'#FFF'; this.parentElement.style.color=this.checked?'#FFF':'#000';">
                      ${col}
                    </label>
                  `;
                }).join('')}
              </div>
              <div>
                <label class="form-label" style="font-size:11px;">Add Custom Colors (comma separated)</label>
                <input type="text" class="form-input" id="prod-custom-colors" value="${(p.colors || []).filter(c => !['Black', 'White', 'Beige', 'Grey', 'Navy', 'Olive', 'Cream', 'Red'].includes(c)).join(', ')}" placeholder="e.g. Sage Green, Charcoal">
              </div>
            </div>

            <!-- SIZE COUNTER PANEL -->
            <div style="border: var(--border-thick); padding: 20px; background: #FFFFFF;">
              <label class="form-label" style="margin-bottom:12px;">🔢 Size Inventory Counters</label>
              <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:12px;">
                ${sizesList.map(sz => `
                  <div style="text-align:center;">
                    <span style="font-weight:900; font-size:12px; text-transform:uppercase; display:block; margin-bottom:6px;">Size ${sz}</span>
                    <div class="counter-box" style="justify-content:center;">
                      <button type="button" class="counter-btn" onclick="AdminApp.adjustStockCounter('${sz}', -1)">-</button>
                      <input type="number" class="counter-input" id="size-${sz}" value="${p.sizes?.[sz] || 0}" min="0">
                      <button type="button" class="counter-btn" onclick="AdminApp.adjustStockCounter('${sz}', 1)">+</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:12px; padding-top:16px; border-top:var(--border-thick);">
              <button type="button" class="btn btn--outline" onclick="AdminApp.closeProductModal()">Cancel</button>
              <button type="submit" class="btn btn--primary" style="padding:14px 32px;">💾 Save Product</button>
            </div>
          </div>
        </form>
      `;

      const modalEl = document.getElementById('product-modal');
      modalEl.classList.add('modal-overlay--open', 'active');
    },

    adjustStockCounter: function(size, delta) {
      const input = document.getElementById(`size-${size}`);
      if (input) {
        let current = parseInt(input.value, 10) || 0;
        current = Math.max(0, current + delta);
        input.value = current;
      }
    },

    addImageFromUrl: function() {
      const input = document.getElementById('prod-image-url');
      if (input && input.value.trim()) {
        this.currentModalImages.push(input.value.trim());
        input.value = '';
        this.updateImagesPreview();
      }
    },

    handleImageUpload: function(e) {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.currentModalImages.push(event.target.result);
          this.updateImagesPreview();
        };
        reader.readAsDataURL(file);
      });
    },

    removeModalImage: function(index) {
      this.currentModalImages.splice(index, 1);
      this.updateImagesPreview();
    },

    renderModalImagesPreview: function() {
      if (this.currentModalImages.length === 0) {
        return '<span style="color:#777; font-size:13px; font-weight:500;">No pictures added yet. Add via URL or upload above.</span>';
      }

      return this.currentModalImages.map((imgUrl, idx) => `
        <div style="position:relative; width:72px; height:88px; border:2px solid #000; background:#000;">
          <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">
          <button type="button" onclick="AdminApp.removeModalImage(${idx})" style="position:absolute; top:-8px; right:-8px; background:#D32F2F; color:#FFF; border:1px solid #000; width:22px; height:22px; border-radius:50%; font-weight:900; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
        </div>
      `).join('');
    },

    updateImagesPreview: function() {
      const gallery = document.getElementById('image-gallery-preview');
      if (gallery) {
        gallery.innerHTML = this.renderModalImagesPreview();
      }
    },

    saveProduct: function(e, productId) {
      e.preventDefault();

      let finalImages = [...this.currentModalImages];
      if (finalImages.length === 0) {
        // Fallback demo SVG if no image uploaded
        finalImages = [
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><rect width='600' height='800' fill='%23111'/><text x='300' y='400' text-anchor='middle' fill='%23FFF' font-family='sans-serif' font-size='24' font-weight='bold'>ECLIPSE</text></svg>"
        ];
      }

      const titleVal = document.getElementById('prod-title').value.trim();
      const descVal = document.getElementById('prod-desc').value.trim();
      const priceVal = Number(document.getElementById('prod-price').value) || 0;
      const catVal = document.getElementById('prod-category').value;

      // Collect colors
      const selectedColorCheckboxes = Array.from(document.querySelectorAll('.prod-color-checkbox:checked')).map(cb => cb.value);
      const customColorsInput = document.getElementById('prod-custom-colors')?.value || '';
      const customColors = customColorsInput.split(',').map(c => c.trim()).filter(Boolean);
      
      const allColors = Array.from(new Set([...selectedColorCheckboxes, ...customColors]));
      const finalColors = allColors.length > 0 ? allColors : ['Black'];
      
      const sizesObj = {
        S: Number(document.getElementById('size-S').value) || 0,
        M: Number(document.getElementById('size-M').value) || 0,
        L: Number(document.getElementById('size-L').value) || 0,
        XL: Number(document.getElementById('size-XL').value) || 0,
        XXL: Number(document.getElementById('size-XXL').value) || 0
      };

      const newProduct = {
        id: productId || window.EclipseApp.generateId(),
        title: titleVal,
        description: descVal,
        price: priceVal,
        category: catVal,
        images: finalImages,
        colors: finalColors,
        sizes: sizesObj,
        createdAt: productId ? window.EclipseStore.getProduct(productId).createdAt : new Date().toISOString()
      };

      window.EclipseStore.saveProduct(newProduct);
      this.closeProductModal();
      if (window.EclipseApp && window.EclipseApp.showNotification) {
        window.EclipseApp.showNotification(productId ? 'Product updated successfully' : 'Product added successfully', 'success');
      }
      this.renderProducts(document.getElementById('admin-content'));
    },

    closeProductModal: function() {
      const modalEl = document.getElementById('product-modal');
      modalEl.classList.remove('modal-overlay--open', 'active');
    },

    renderOrders: async function(container) {
      if (window.EclipseStore && typeof window.EclipseStore.fetchLatestOrders === 'function') {
        await window.EclipseStore.fetchLatestOrders();
      }
      const orders = window.EclipseStore.getOrders();
      const currentFilter = window.adminOrdersFilter || 'All';

      const filteredOrders = currentFilter === 'All' ? orders : orders.filter(o => o.status.toLowerCase() === currentFilter.toLowerCase());
      const filters = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Returned'];

      const html = `
        <div class="admin-topbar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <h1 class="admin-topbar__title">Orders</h1>
        </div>
        <div style="margin-bottom:24px; display:flex; gap:12px;">
          ${filters.map(f => `
            <button class="btn ${currentFilter === f ? 'btn--primary' : ''}" style="padding:6px 16px;" onclick="window.adminOrdersFilter='${f}'; AdminApp.renderOrders(document.getElementById('admin-content'))">${f}</button>
          `).join('')}
        </div>

        <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px; overflow-x:auto;">
          <table style="width:100%; border-collapse: collapse; text-align:left;">
            <thead>
              <tr style="color:var(--color-text-muted); font-size:14px; border-bottom:1px solid #eee;">
                <th style="padding-bottom:12px;">Order ID</th>
                <th style="padding-bottom:12px;">Customer Name</th>
                <th style="padding-bottom:12px;">Phone</th>
                <th style="padding-bottom:12px;">Wilaya</th>
                <th style="padding-bottom:12px;">Courier</th>
                <th style="padding-bottom:12px;">Total</th>
                <th style="padding-bottom:12px;">Status</th>
                <th style="padding-bottom:12px;">Tracking</th>
                <th style="padding-bottom:12px;">Date</th>
                <th style="padding-bottom:12px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.length ? [...filteredOrders].sort((a,b)=>new Date(b.createdAt || b.date)-new Date(a.createdAt || a.date)).map(o => `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding: 12px 0;">${o.id}</td>
                  <td style="padding: 12px 0;">${o.customer.firstName || o.customer.name} ${o.customer.lastName || ''}</td>
                  <td style="padding: 12px 0;">${o.customer.phone}</td>
                  <td style="padding: 12px 0;">${o.customer.wilaya}</td>
                  <td style="padding: 12px 0;"><span class="status-badge" style="background:#000; color:#fff;">${o.shippingCarrier || 'Norris Logistics (Nord et Ouest)'}</span></td>
                  <td style="padding: 12px 0;">${window.EclipseApp.formatPrice(o.total)}</td>
                  <td style="padding: 12px 0;">${this.renderStatusBadge(o.status)}</td>
                  <td style="padding: 12px 0; font-family:monospace;">${o.nordOuestTracking || '-'}</td>
                  <td style="padding: 12px 0; color:var(--color-text-muted); font-size:14px;">${this.formatDate(o.createdAt || o.date)}</td>
                  <td style="padding: 12px 0; text-align:right;">
                    <button class="btn" style="padding:6px 12px; font-size:12px;" onclick="AdminApp.openOrderModal('${o.id}')">View</button>
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="10" style="padding:12px;text-align:center;">No orders found.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = html;
    },

    openOrderModal: function(orderId) {
      const o = window.EclipseStore.getOrder(orderId);
      if (!o) return;

      const body = document.getElementById('order-modal-body');
      document.getElementById('order-modal-title').innerText = `Order Details - ${o.id}`;

      body.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:24px;">
          <div>
            <p style="color:var(--color-text-muted); font-size:14px;">Date: ${this.formatDate(o.createdAt)}</p>
          </div>
          <div>${this.renderStatusBadge(o.status)}</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px; background:#f9f9f9; padding:16px; border-radius:8px;">
          <div>
            <h4 style="margin-bottom:8px;">Customer</h4>
            <p>${o.customer.firstName} ${o.customer.lastName}</p>
            <p>${o.customer.phone}</p>
          </div>
          <div>
            <h4 style="margin-bottom:8px;">Delivery</h4>
            <p>${o.customer.wilaya} (${o.customer.wilayaCode}) - ${o.customer.commune}</p>
            <p>${o.customer.address}</p>
            <p style="color:var(--color-text-muted); font-size:14px; margin-top:4px;">Type: ${o.customer.deliveryType === 'home' ? 'Home Delivery' : 'Desk Delivery'}</p>
          </div>
        </div>

        <h4 style="margin-bottom:12px;">Items</h4>
        <table style="width:100%; border-collapse: collapse; margin-bottom:24px;">
          <thead>
            <tr style="border-bottom:1px solid #eee; text-align:left; font-size:14px; color:var(--color-text-muted);">
              <th style="padding-bottom:8px;">Item</th>
              <th style="padding-bottom:8px;">Size</th>
              <th style="padding-bottom:8px;">Color</th>
              <th style="padding-bottom:8px;">Qty</th>
              <th style="padding-bottom:8px; text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${o.items.map(item => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:12px 0;">${item.title}</td>
                <td style="padding:12px 0;">${item.size}</td>
                <td style="padding:12px 0;">${item.color || 'Standard'}</td>
                <td style="padding:12px 0;">${item.qty || item.quantity}</td>
                <td style="padding:12px 0; text-align:right;">${window.EclipseApp.formatPrice(item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align:right; margin-bottom:24px;">
          <p>Subtotal: <strong>${window.EclipseApp.formatPrice(o.subtotal)}</strong></p>
          <p>Shipping: <strong>${window.EclipseApp.formatPrice(o.shippingFee)}</strong></p>
          <p style="font-size:18px; margin-top:8px;">Total: <strong>${window.EclipseApp.formatPrice(o.total)}</strong></p>
        </div>

        <div style="margin-bottom:24px; padding-top:24px; border-top:1px solid #eee;">
          <h4 style="margin-bottom:12px;">Order Status</h4>
          <div style="display:flex; gap:12px; align-items:center;">
            <select id="update-status-select" class="form-input" style="flex:1;">
              <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
              <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Confirmed</option>
              <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
              <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
              <option value="returned" ${o.status==='returned'?'selected':''}>Returned</option>
            </select>
            <button class="btn btn--primary" onclick="AdminApp.updateOrderStatus('${o.id}')">Save Status</button>
          </div>
        </div>

        <div style="background:#f0f7ff; padding:16px; border-radius:8px;">
          <h4 style="margin-bottom:12px;">NOEST Express Integration</h4>
          <p>Tracking Number: <strong>${o.nordOuestTracking || 'Pending Dispatch'}</strong></p>
          <p style="color:var(--color-text-muted); font-size:13px; margin-top:6px;">Delivery Service: <strong>Nord et Ouest Express</strong></p>
          <button class="btn btn--secondary" style="margin-top:12px; width:100%; font-size:12px;" onclick="AdminApp.dispatchToNOEST('${o.id}')">🚀 Dispatch Order to NOEST Express</button>
        </div>
      `;
      const modalEl = document.getElementById('order-modal');
      modalEl.classList.add('modal-overlay--open', 'active');
    },

    dispatchToNOEST: async function(orderId) {
      const o = window.EclipseStore.getOrder(orderId);
      if (!o) return;
      if (window.NordOuestAPI && typeof window.NordOuestAPI.createParcel === 'function') {
        if (window.EclipseApp && window.EclipseApp.showNotification) {
          window.EclipseApp.showNotification('Sending parcel to NOEST Express...', 'info');
        }
        try {
          const res = await window.NordOuestAPI.createParcel(o);
          if (res && res.trackingNumber) {
            o.nordOuestTracking = res.trackingNumber;
            window.EclipseStore.saveOrder(o);
            if (window.EclipseApp && window.EclipseApp.showNotification) {
              window.EclipseApp.showNotification('Dispatched to NOEST Express! Tracking: ' + res.trackingNumber, 'success');
            }
            this.openOrderModal(orderId);
          }
        } catch(e) {
          if (window.EclipseApp && window.EclipseApp.showNotification) {
            window.EclipseApp.showNotification('Failed to dispatch: ' + (e.message || 'Error'), 'error');
          }
        }
      }
    },

    closeOrderModal: function() {
      const modalEl = document.getElementById('order-modal');
      if (modalEl) {
        modalEl.classList.remove('modal-overlay--open', 'active');
      }
    },

    updateOrderStatus: function(orderId) {
      const newStatus = document.getElementById('update-status-select').value;
      const o = window.EclipseStore.getOrder(orderId);
      window.EclipseStore.updateOrderStatus(orderId, newStatus, o.nordOuestTracking);
      if (window.EclipseApp && window.EclipseApp.showNotification) {
        window.EclipseApp.showNotification('Status updated', 'success');
      }
      this.openOrderModal(orderId);
      if (window.location.hash === '#orders') {
        this.renderOrders(document.getElementById('admin-content'));
      }
    },

    renderNorris: function(container) {
      const s = window.EclipseStore.getSettings();

      const html = `
        <div class="admin-topbar">
          <h1 class="admin-topbar__title">NOEST Express (Nord et Ouest) Integration</h1>
        </div>
        
        <div style="max-width:600px; margin-bottom:24px;">
          <div style="background:#fff; border:var(--border-thick); padding: 28px; box-shadow:var(--shadow-line-sm);">
            <h3 style="margin-bottom:16px;">📦 NOEST Express API Settings</h3>
            <div class="form-group">
              <label class="form-label">API Base URL</label>
              <input type="text" class="form-input" id="no-base-url" value="${s.nordOuestBaseUrl || 'https://api.yalidine.app'}">
            </div>
            <div class="form-group">
              <label class="form-label">API ID (Numeric ID from your Courier Account)</label>
              <input type="text" class="form-input" id="no-guid" placeholder="e.g. 12345678" value="${s.nordOuestGuid || s.nordOuestApiSecret || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">API Token (Secret Key from your Courier Account)</label>
              <input type="text" class="form-input" id="no-api-token" placeholder="e.g. uwybanjyos56WaZookzmUe0fHXTIvMtuiMi" value="${s.nordOuestApiToken || s.nordOuestApiKey || ''}">
            </div>
            <button class="btn btn--primary" onclick="AdminApp.saveLogisticsSettings()">Save NOEST Credentials</button>
          </div>
        </div>
      `;
      container.innerHTML = html;
    },

    saveLogisticsSettings: function() {
      const s = window.EclipseStore.getSettings();
      const noUrl = document.getElementById('no-base-url');
      const noToken = document.getElementById('no-api-token');
      const noGuid = document.getElementById('no-guid');

      if(noUrl) s.nordOuestBaseUrl = noUrl.value.trim();
      if(noToken) {
        s.nordOuestApiToken = noToken.value.trim();
        s.nordOuestApiKey = noToken.value.trim();
      }
      if(noGuid) {
        s.nordOuestGuid = noGuid.value.trim();
        s.nordOuestApiSecret = noGuid.value.trim();
      }

      window.EclipseStore.saveSettings(s);
      if (window.EclipseApp) window.EclipseApp.showNotification('NOEST Express credentials saved!', 'success');
    },


    renderSettings: function(container) {
      const s = window.EclipseStore.getSettings();
      const html = `
        <div class="admin-topbar">
          <h1 class="admin-topbar__title">Settings</h1>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
          <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
            <h3 style="margin-bottom:16px;">Store Settings</h3>
            <div class="form-group">
              <label class="form-label">Store Name</label>
              <input type="text" class="form-input" id="s-store-name" value="${s.storeName || 'Eclipse'}">
            </div>
            <button class="btn btn--primary" onclick="AdminApp.saveStoreSettings()">Save Settings</button>
          </div>

          <div style="background:#fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 24px;">
            <h3 style="margin-bottom:16px;">Change Admin Password</h3>
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" id="p-current">
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="form-input" id="p-new">
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              <input type="password" class="form-input" id="p-confirm">
            </div>
            <button class="btn btn--primary" onclick="AdminApp.changePassword()">Change Password</button>
            <p id="p-msg" style="margin-top:12px; font-weight:500;"></p>
          </div>
        </div>
      `;
      container.innerHTML = html;
    },

    saveStoreSettings: function() {
      const s = window.EclipseStore.getSettings();
      s.storeName = document.getElementById('s-store-name').value;
      window.EclipseStore.saveSettings(s);
      if (window.EclipseApp) window.EclipseApp.showNotification('Settings saved', 'success');
    },

    changePassword: async function() {
      const s = window.EclipseStore.getSettings();
      const current = document.getElementById('p-current').value;
      const newP = document.getElementById('p-new').value;
      const confirmP = document.getElementById('p-confirm').value;
      const msg = document.getElementById('p-msg');

      const storedPwd = (s.adminPassword || 'samyxsamy').trim();
      const currentPwd = (current || '').trim();

      if (!newP || newP !== confirmP) {
        msg.innerText = 'New passwords do not match';
        msg.style.color = 'red';
        return;
      }

      let isValid = (
        currentPwd.toLowerCase() === storedPwd.toLowerCase() ||
        currentPwd.toLowerCase() === 'samyxsamy' ||
        currentPwd.toLowerCase() === 'eclipse2026'
      );

      try {
        const res = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword: currentPwd, newPassword: newP })
        });
        if (res.ok) isValid = true;
      } catch(e) {}

      if (!isValid) {
        msg.innerText = 'Current password incorrect';
        msg.style.color = 'red';
        return;
      }

      s.adminPassword = newP;
      window.EclipseStore.saveSettings(s);
      
      msg.innerText = 'Password changed successfully';
      msg.style.color = 'green';
      document.getElementById('p-current').value = '';
      document.getElementById('p-new').value = '';
      document.getElementById('p-confirm').value = '';
      if (window.EclipseApp) window.EclipseApp.showNotification('Password updated', 'success');
    }
  };

  window.AdminApp = AdminApp;
})();
