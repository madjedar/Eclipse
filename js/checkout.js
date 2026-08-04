(function(window) {
  const shippingRates = {
    1:  { desk: 1000, home: 1500 },
    2:  { desk: 500,  home: 800 },
    3:  { desk: 600,  home: 1000 },
    4:  { desk: 500,  home: 800 },
    5:  { desk: 500,  home: 800 },
    6:  { desk: 500,  home: 800 },
    7:  { desk: 600,  home: 1000 },
    8:  { desk: 800,  home: 1200 },
    9:  { desk: 450,  home: 800 },
    10: { desk: 500,  home: 800 },
    11: { desk: 1500, home: 2000 },
    12: { desk: 500,  home: 800 },
    13: { desk: 600,  home: 900 },
    14: { desk: 600,  home: 900 },
    15: { desk: 500,  home: 800 },
    16: { desk: 450,  home: 700 },
    17: { desk: 600,  home: 1000 },
    18: { desk: 500,  home: 800 },
    19: { desk: 500,  home: 900 },
    20: { desk: 600,  home: 900 },
    21: { desk: 500,  home: 800 },
    22: { desk: 500,  home: 800 },
    23: { desk: 400,  home: 600 },
    24: { desk: 450,  home: 700 },
    25: { desk: 500,  home: 800 },
    26: { desk: 500,  home: 800 },
    27: { desk: 500,  home: 800 },
    28: { desk: 500,  home: 800 },
    29: { desk: 500,  home: 850 },
    30: { desk: 700,  home: 1100 },
    31: { desk: 500,  home: 800 },
    32: { desk: 800,  home: 1200 },
    33: { desk: 1500, home: 1900 },
    34: { desk: 500,  home: 800 },
    35: { desk: 450,  home: 800 },
    36: { desk: 450,  home: 700 },
    37: { desk: 1000, home: 1600 },
    38: { desk: 500,  home: 800 },
    39: { desk: 700,  home: 1100 },
    40: { desk: 500,  home: 800 },
    41: { desk: 500,  home: 800 },
    42: { desk: 500,  home: 800 },
    43: { desk: 500,  home: 800 },
    44: { desk: 500,  home: 800 },
    45: { desk: 800,  home: 1200 },
    46: { desk: 500,  home: 800 },
    47: { desk: 700,  home: 1100 },
    48: { desk: 500,  home: 800 },
    49: { desk: 1000, home: 1500 },
    50: { desk: 1000, home: 1500 },
    51: { desk: 600,  home: 1000 },
    52: { desk: 800,  home: 1200 },
    53: { desk: 1200, home: 1800 },
    54: { desk: 1200, home: 1800 },
    55: { desk: 700,  home: 1100 },
    56: { desk: 1600, home: 2200 },
    57: { desk: 700,  home: 1100 },
    58: { desk: 700,  home: 1100 }
  };

  const getShippingFee = (wilayaId, mode) => {
    const id = parseInt(wilayaId, 10);
    if (!id) return 0;
    const rates = shippingRates[id] || { desk: 600, home: 900 };
    return mode === 'desk' ? rates.desk : rates.home;
  };

  const CheckoutApp = {
    deliveryMode: 'home',
    carrier: 'Norris Logistics (Nord et Ouest)',
    shippingFee: 0,
    
    init: function() {
      const cart = window.EclipseStore.getCart();
      if (cart.length === 0) {
        window.location.href = '/shop.html';
        return;
      }

      this.renderCartSummary();
      this.populateWilayas();

      // Bind events
      const wilayaEl = document.getElementById('shipping-wilaya');
      if (wilayaEl) wilayaEl.addEventListener('change', (e) => this.onWilayaChange(e));

      const formEl = document.getElementById('checkout-form');
      if (formEl) formEl.addEventListener('submit', (e) => this.submitOrder(e));
      
      window.setDeliveryMode = (mode) => this.setDeliveryMode(mode);
      window.setCarrierMode = (carrier) => this.setCarrierMode(carrier);
    },

    renderCartSummary: function() {
      const cart = window.EclipseStore.getCart();
      const subtotal = window.EclipseStore.getCartTotal();
      const t = (k) => window.EclipseApp ? window.EclipseApp.t(k) : k;

      const itemsContainer = document.getElementById('checkout-items');
      if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item" style="border-bottom:none; margin-bottom:12px; padding-bottom:0;">
            <img src="${item.image}" alt="${item.title}" class="cart-item__image" style="width:60px; height:80px;">
            <div class="cart-item__details">
              <div class="cart-item__title" style="font-size:12px;">${item.title}</div>
              <div class="cart-item__meta">${t('size')}: ${item.size} | Qty: ${item.quantity}</div>
              <div class="cart-item__price">${window.EclipseApp.formatPrice(item.price * item.quantity)}</div>
            </div>
          </div>
        `).join('');
      }

      const subtotalEl = document.getElementById('checkout-subtotal');
      if (subtotalEl) subtotalEl.textContent = window.EclipseApp.formatPrice(subtotal);
      
      const shippingEl = document.getElementById('checkout-shipping');
      if (shippingEl) {
        if (this.shippingFee > 0) {
          shippingEl.textContent = window.EclipseApp.formatPrice(this.shippingFee);
          shippingEl.style.color = 'var(--color-text)';
        } else {
          shippingEl.textContent = t('selectWilaya');
          shippingEl.style.color = 'var(--color-text-muted)';
        }
      }

      const total = subtotal + this.shippingFee;
      const totalEl = document.getElementById('checkout-total');
      if (totalEl) totalEl.textContent = window.EclipseApp.formatPrice(total);
    },

    populateWilayas: function() {
      const select = document.getElementById('shipping-wilaya');
      if (!select) return;
      
      const wilayas = window.ALGERIA_DATA ? window.ALGERIA_DATA.getWilayas() : [];
      select.innerHTML = `<option value="">${window.EclipseApp.t('selectWilaya')}</option>`;
      wilayas.forEach(w => {
        const option = document.createElement('option');
        option.value = w.id;
        option.textContent = `${w.code} - ${w.name}`;
        select.appendChild(option);
      });
    },

    onWilayaChange: function(e) {
      const wilayaId = e.target.value;
      const communeSelect = document.getElementById('shipping-commune');
      const t = (k) => window.EclipseApp ? window.EclipseApp.t(k) : k;

      if (!wilayaId) {
        communeSelect.innerHTML = `<option value="">${t('selectCommune')}</option>`;
        communeSelect.disabled = true;
        this.shippingFee = 0;
        this.renderCartSummary();
        return;
      }

      const communes = window.ALGERIA_DATA ? window.ALGERIA_DATA.getCommunes(wilayaId) : [];
      
      communeSelect.innerHTML = `<option value="">${t('selectCommune')}</option>`;
      communes.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        communeSelect.appendChild(option);
      });
      
      communeSelect.disabled = false;
      this.updateShippingFee(wilayaId);
    },

    setDeliveryMode: function(mode) {
      this.deliveryMode = mode;
      const homeEl = document.getElementById('del-home');
      const deskEl = document.getElementById('del-desk');
      if (homeEl) homeEl.classList.toggle('delivery-option--active', mode === 'home');
      if (deskEl) deskEl.classList.toggle('delivery-option--active', mode === 'desk');

      const addressGroup = document.getElementById('address-group');
      const addressInput = document.getElementById('shipping-address');

      if (addressGroup && addressInput) {
        if (mode === 'desk') {
          addressGroup.style.display = 'none';
          addressInput.removeAttribute('required');
        } else {
          addressGroup.style.display = 'block';
          addressInput.setAttribute('required', 'true');
        }
      }
      
      const wilayaId = document.getElementById('shipping-wilaya').value;
      if (wilayaId) {
        this.updateShippingFee(wilayaId);
      }
    },

    setCarrierMode: function(carrier) {
      this.carrier = carrier;
      document.getElementById('carrier-nord-ouest')?.classList.toggle('delivery-option--active', carrier === 'Nord et Ouest');
      
      const wilayaId = document.getElementById('shipping-wilaya').value;
      if (wilayaId) {
        this.updateShippingFee(wilayaId);
      }
    },

    updateShippingFee: function(wilayaId) {
      this.shippingFee = getShippingFee(wilayaId, this.deliveryMode);
      this.renderCartSummary();
    },

    submitOrder: function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-order-btn');
      btn.textContent = 'Processing...';
      btn.disabled = true;

      const t = (k) => window.EclipseApp ? window.EclipseApp.t(k) : k;

      setTimeout(() => {
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const addressVal = document.getElementById('shipping-address').value;

        const orderData = {
          id: orderId,
          date: new Date().toISOString(),
          customer: {
            name: document.getElementById('shipping-name').value,
            firstName: document.getElementById('shipping-name').value.split(' ')[0] || '',
            lastName: document.getElementById('shipping-name').value.split(' ').slice(1).join(' ') || '',
            phone: document.getElementById('shipping-phone').value,
            wilaya: document.getElementById('shipping-wilaya').options[document.getElementById('shipping-wilaya').selectedIndex].text,
            wilayaCode: document.getElementById('shipping-wilaya').value,
            commune: document.getElementById('shipping-commune').value,
            address: this.deliveryMode === 'desk' ? (addressVal || 'Stop Desk (Pickup at Agency)') : addressVal,
            deliveryType: this.deliveryMode
          },
          shippingCarrier: 'Norris Logistics (Nord et Ouest)',
          deliveryMode: this.deliveryMode,
          items: window.EclipseStore.getCart(),
          subtotal: window.EclipseStore.getCartTotal(),
          shippingFee: this.shippingFee,
          total: window.EclipseStore.getCartTotal() + this.shippingFee,
          status: 'pending',
          nordOuestTracking: 'NORRIS-' + Math.floor(10000000 + Math.random() * 90000000)
        };

        window.EclipseStore.saveOrder(orderData);
        window.EclipseStore.clearCart();

        document.getElementById('checkout-container').innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px;">
            <div style="font-size: 64px; margin-bottom: 24px;">📦</div>
            <h1 style="font-family: var(--font-display); font-size: 32px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px;">${t('orderConfirmed')}</h1>
            <p style="font-size: 16px; color: var(--color-text-muted); margin-bottom: 8px;">${t('thankYou')}</p>
            <p style="font-size: 18px; margin-bottom: 16px; font-weight: 700;">${t('orderId')}: <span style="font-family: monospace; background: var(--color-surface); padding: 4px 8px; border: var(--border-thick);">${orderId}</span></p>
            <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 32px;">Carrier: <strong>${this.carrier}</strong> (${this.deliveryMode === 'home' ? 'Home Delivery' : 'Stop Desk'})</p>
            <p style="margin-bottom: 48px;">${t('codNotice')}</p>
            <a href="/shop.html" class="btn btn--primary btn--lg">${t('continueShopping')}</a>
          </div>
        `;
      }, 1200);
    }
  };

  window.CheckoutApp = CheckoutApp;
})(window);
