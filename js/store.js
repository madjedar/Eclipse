(function(window) {
  function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  function setData(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function syncToServer(endpoint, payload) {
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (!res.ok) {
          console.error('[Sync Error]', endpoint, res.status, res.statusText);
        }
      }).catch(err => console.error('[Sync Error]', endpoint, err));
    } catch(e) {}
  }

  const EclipseStore = {
    // PRODUCTS
    getProducts: function() {
      return getData('eclipse_products') || [];
    },
    getProduct: function(id) {
      return this.getProducts().find(p => p.id === id);
    },
    saveProduct: function(product) {
      let products = this.getProducts();
      const idx = products.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        products[idx] = product;
      } else {
        products.push(product);
      }
      setData('eclipse_products', products);
      syncToServer('/api/store/products', { products });
    },
    deleteProduct: function(id) {
      let products = this.getProducts().filter(p => p.id !== id);
      setData('eclipse_products', products);
      syncToServer('/api/store/products', { products });
    },

    // CART
    getCart: function() {
      return getData('eclipse_cart') || [];
    },
    addToCart: function(productId, size, color, quantity) {
      // Support signature (productId, size, quantity) if color is omitted
      if (typeof color === 'number') {
        quantity = color;
        color = null;
      }
      let cart = this.getCart();
      const product = this.getProduct(productId);
      if (!product) return;
      
      const itemColor = color || (product.colors && product.colors.length ? product.colors[0] : 'Black');
      
      const existingIdx = cart.findIndex(item => item.productId === productId && item.size === size && (item.color || 'Black') === itemColor);
      if (existingIdx >= 0) {
        cart[existingIdx].quantity += (quantity || 1);
      } else {
        cart.push({
          productId,
          title: product.title,
          price: product.price,
          size,
          color: itemColor,
          quantity: quantity || 1,
          image: product.images[0]
        });
      }
      setData('eclipse_cart', cart);
    },
    updateCartItem: function(index, quantity) {
      let cart = this.getCart();
      if (cart[index]) {
        cart[index].quantity = quantity;
        setData('eclipse_cart', cart);
      }
    },
    removeFromCart: function(index) {
      let cart = this.getCart();
      cart.splice(index, 1);
      setData('eclipse_cart', cart);
    },
    clearCart: function() {
      setData('eclipse_cart', []);
    },
    getCartCount: function() {
      return this.getCart().reduce((acc, item) => acc + item.quantity, 0);
    },
    getCartTotal: function() {
      return this.getCart().reduce((acc, item) => acc + (item.price * item.quantity), 0);
    },

    // ORDERS
    fetchLatestOrders: async function() {
      try {
        const res = await fetch('/api/store/orders', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            setData('eclipse_orders', data.orders);
            return data.orders;
          }
        }
      } catch(e) {}
      return this.getOrders();
    },
    fetchLatestProducts: async function() {
      try {
        const res = await fetch('/api/store/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products)) {
            setData('eclipse_products', data.products);
            return data.products;
          }
        }
      } catch(e) {}
      return this.getProducts();
    },
    getOrders: function() {
      return getData('eclipse_orders') || [];
    },
    getOrder: function(id) {
      return this.getOrders().find(o => o.id === id);
    },
    saveOrder: function(order) {
      let orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === order.id);
      if (idx >= 0) {
        orders[idx] = order;
      } else {
        orders.push(order);
      }
      setData('eclipse_orders', orders);
      syncToServer('/api/store/orders', { orders });
    },
    updateOrderStatus: function(id, status, tracking = null) {
      let order = this.getOrder(id);
      if (order) {
        order.status = status;
        if (tracking) order.nordOuestTracking = tracking;
        this.saveOrder(order);
      }
    },

    // SETTINGS
    getSettings: function() {
      const defaultSettings = {
        adminPassword: 'samyxsamy',
        nordOuestApiToken: 'uwybanjyos56WaZookzmUe0fHXTIvMtuiMi',
        nordOuestGuid: 'N1L20U4L',
        nordOuestBaseUrl: 'https://app.noest-dz.com',
        nordOuestApiKey: 'uwybanjyos56WaZookzmUe0fHXTIvMtuiMi',
        nordOuestApiSecret: 'N1L20U4L',
        storeName: 'Eclipse'
      };
      const saved = getData('eclipse_settings');
      return saved ? Object.assign({}, defaultSettings, saved) : defaultSettings;
    },
    saveSettings: function(settings) {
      setData('eclipse_settings', settings);
      syncToServer('/api/store/settings', { settings });
    },

    init: async function() {
      let prodFetched = false;
      // Sync from Server Database first if available
      try {
        const prodRes = await fetch('/api/store/products', { cache: 'no-store' });
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.products)) {
            setData('eclipse_products', prodData.products);
            prodFetched = true;
          }
        }

        const ordRes = await fetch('/api/store/orders', { cache: 'no-store' });
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData.success && Array.isArray(ordData.orders)) {
            setData('eclipse_orders', ordData.orders);
          }
        }

        const setRes = await fetch('/api/store/settings', { cache: 'no-store' });
        if (setRes.ok) {
          const setDataObj = await setRes.json();
          if (setDataObj.success && setDataObj.settings) {
            setData('eclipse_settings', setDataObj.settings);
          }
        }
      } catch (e) {}

      // Fallback demo products if store is completely empty AND we couldn't fetch from server
      if (!prodFetched && !localStorage.getItem('eclipse_products')) {
        const demoProducts = [
          {
            id: 'PROD-1', title: 'Unisex Summer Graphic Tee', description: 'Lightweight summer t-shirt in white, designed for both men and women. Breathable and comfortable for the hot Algerian summer.', price: 3500, category: 'T-Shirts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            colors: ['White', 'Black', 'Beige'],
            sizes: { S: 10, M: 20, L: 15, XL: 5 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-2', title: 'Eclipse Essential Summer Set', description: 'Matching unisex summer set consisting of a loose tee and lightweight shorts.', price: 6500, category: 'Sets',
            images: ['/img/summer2.jpg', '/img/summer1.jpg'],
            colors: ['Black', 'Grey', 'Navy'],
            sizes: { S: 5, M: 10, L: 10, XL: 2 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-3', title: 'Lightweight Cargo Shorts', description: 'Utility shorts for summer days. Unisex fit with adjustable waist.', price: 4500, category: 'Shorts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            colors: ['Olive', 'Black', 'Beige'],
            sizes: { S: 8, M: 12, L: 8, XL: 4 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-4', title: 'Breezy Linen Shirt', description: 'Flowy linen shirt for beach days and summer nights. Fits all genders beautifully.', price: 5500, category: 'Shirts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            colors: ['White', 'Cream', 'Beige'],
            sizes: { S: 3, M: 6, L: 6, XL: 3 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-5', title: 'Oversized Summer Tank', description: 'Sleeveless tank top with a relaxed unisex fit. Perfect for layering or wearing on its own.', price: 2800, category: 'T-Shirts',
            images: ['/img/summer2.jpg', '/img/summer1.jpg'],
            colors: ['Black', 'White'],
            sizes: { S: 15, M: 25, L: 20, XL: 10 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-6', title: 'Eclipse Bucket Hat', description: 'Essential summer accessory. One size fits all, providing shade and style.', price: 2200, category: 'Accessories',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            colors: ['Black', 'White', 'Olive'],
            sizes: { S: 10, M: 15, L: 10, XL: 5 }, createdAt: new Date().toISOString()
          }
        ];
        setData('eclipse_products', demoProducts);
        syncToServer('/api/store/products', { products: demoProducts });
      }
    }
  };

  EclipseStore.init();
  window.EclipseStore = EclipseStore;
})(window);
