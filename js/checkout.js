(function(window) {
  const wilayas = [
    { id: 1, name: "Adrar" }, { id: 2, name: "Chlef" }, { id: 3, name: "Laghouat" }, { id: 4, name: "Oum El Bouaghi" },
    { id: 5, name: "Batna" }, { id: 6, name: "Béjaïa" }, { id: 7, name: "Biskra" }, { id: 8, name: "Béchar" },
    { id: 9, name: "Blida" }, { id: 10, name: "Bouira" }, { id: 11, name: "Tamanrasset" }, { id: 12, name: "Tébessa" },
    { id: 13, name: "Tlemcen" }, { id: 14, name: "Tiaret" }, { id: 15, name: "Tizi Ouzou" }, { id: 16, name: "Alger" },
    { id: 17, name: "Djelfa" }, { id: 18, name: "Jijel" }, { id: 19, name: "Sétif" }, { id: 20, name: "Saïda" },
    { id: 21, name: "Skikda" }, { id: 22, name: "Sidi Bel Abbès" }, { id: 23, name: "Annaba" }, { id: 24, name: "Guelma" },
    { id: 25, name: "Constantine" }, { id: 26, name: "Médéa" }, { id: 27, name: "Mostaganem" }, { id: 28, name: "M'Sila" },
    { id: 29, name: "Mascara" }, { id: 30, name: "Ouargla" }, { id: 31, name: "Oran" }, { id: 32, name: "El Bayadh" },
    { id: 33, name: "Illizi" }, { id: 34, name: "Bordj Bou Arréridj" }, { id: 35, name: "Boumerdès" }, { id: 36, name: "El Tarf" },
    { id: 37, name: "Tindouf" }, { id: 38, name: "Tissemsilt" }, { id: 39, name: "El Oued" }, { id: 40, name: "Khenchela" },
    { id: 41, name: "Souk Ahras" }, { id: 42, name: "Tipaza" }, { id: 43, name: "Mila" }, { id: 44, name: "Aïn Defla" },
    { id: 45, name: "Naâma" }, { id: 46, name: "Aïn Témouchent" }, { id: 47, name: "Ghardaïa" }, { id: 48, name: "Relizane" },
    { id: 49, name: "Timimoun" }, { id: 50, name: "Bordj Badji Mokhtar" }, { id: 51, name: "Ouled Djellal" }, { id: 52, name: "Béni Abbès" },
    { id: 53, name: "In Salah" }, { id: 54, name: "In Guezzam" }, { id: 55, name: "Touggourt" }, { id: 56, name: "Djanet" },
    { id: 57, name: "El M'Ghair" }, { id: 58, name: "El Meniaa" }
  ];

  const getCommunes = (wilayaName) => {
    return [wilayaName + " Centre", "Nouvelle Ville", "Zone Industrielle", "Quartier Est"];
  };

  // Dynamic fee calculation for Yalidine Express vs Nord et Ouest
  const getShippingFee = (wilayaId, mode, carrier) => {
    const id = parseInt(wilayaId);
    if (!id) return 0;

    let base = 600;
    if (carrier === 'Nord et Ouest') {
      // Nord et Ouest rate structure (specialized for North/West Wilayas)
      const northWestWilayas = [9, 13, 14, 16, 22, 27, 29, 31, 42, 44, 46, 48];
      if (northWestWilayas.includes(id)) {
        base = 450;
      } else if (id > 48) {
        base = 1250;
      } else if (id > 30) {
        base = 850;
      } else {
        base = 550;
      }
    } else {
      // Yalidine Express rate structure
      if (id === 16) base = 400;
      else if (id === 9 || id === 35 || id === 42) base = 500;
      else if (id > 48) base = 1200;
      else if (id > 30) base = 800;
    }

    return mode === 'desk' ? Math.max(200, base - 200) : base;
  };

  const CheckoutApp = {
    deliveryMode: 'home',
    carrier: 'Yalidine Express',
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
      
      select.innerHTML = `<option value="">${window.EclipseApp.t('selectWilaya')}</option>`;
      wilayas.forEach(w => {
        const option = document.createElement('option');
        option.value = w.id;
        option.textContent = `${w.id.toString().padStart(2, '0')} - ${w.name}`;
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

      const wilayaName = wilayas.find(w => w.id == wilayaId).name;
      const communes = getCommunes(wilayaName);
      
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
      document.getElementById('del-home').classList.toggle('delivery-option--active', mode === 'home');
      document.getElementById('del-desk').classList.toggle('delivery-option--active', mode === 'desk');
      
      const wilayaId = document.getElementById('shipping-wilaya').value;
      if (wilayaId) {
        this.updateShippingFee(wilayaId);
      }
    },

    setCarrierMode: function(carrier) {
      this.carrier = carrier;
      document.getElementById('carrier-yalidine').classList.toggle('delivery-option--active', carrier === 'Yalidine Express');
      document.getElementById('carrier-nord-ouest').classList.toggle('delivery-option--active', carrier === 'Nord et Ouest');
      
      const wilayaId = document.getElementById('shipping-wilaya').value;
      if (wilayaId) {
        this.updateShippingFee(wilayaId);
      }
    },

    updateShippingFee: function(wilayaId) {
      this.shippingFee = getShippingFee(wilayaId, this.deliveryMode, this.carrier);
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
            address: document.getElementById('shipping-address').value,
            deliveryType: this.deliveryMode
          },
          shippingCarrier: this.carrier,
          deliveryMode: this.deliveryMode,
          items: window.EclipseStore.getCart(),
          subtotal: window.EclipseStore.getCartTotal(),
          shippingFee: this.shippingFee,
          total: window.EclipseStore.getCartTotal() + this.shippingFee,
          status: 'pending',
          yalidineTracking: this.carrier === 'Yalidine Express' ? 'YAL-' + Math.floor(10000000 + Math.random() * 90000000) : null,
          nordOuestTracking: this.carrier === 'Nord et Ouest' ? 'NO-' + Math.floor(10000000 + Math.random() * 90000000) : null
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
