(function(window) {
  function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  function setData(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
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
    },
    deleteProduct: function(id) {
      let products = this.getProducts().filter(p => p.id !== id);
      setData('eclipse_products', products);
    },

    // CART
    getCart: function() {
      return getData('eclipse_cart') || [];
    },
    addToCart: function(productId, size, quantity) {
      let cart = this.getCart();
      const product = this.getProduct(productId);
      if (!product) return;
      
      const existingIdx = cart.findIndex(item => item.productId === productId && item.size === size);
      if (existingIdx >= 0) {
        cart[existingIdx].quantity += quantity;
      } else {
        cart.push({
          productId,
          title: product.title,
          price: product.price,
          size,
          quantity,
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
      return getData('eclipse_settings') || {
        adminPassword: 'samyxsamy',
        nordOuestApiKey: '',
        nordOuestApiSecret: '',
        storeName: 'Eclipse'
      };
    },
    saveSettings: function(settings) {
      setData('eclipse_settings', settings);
    },

    init: function() {
      // Initialize with demo products only if the store is completely empty
      if (localStorage.getItem('eclipse_products') === null) {
        const createSvg = (name, fill) => `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><rect width='600' height='800' fill='${fill}'/><text x='300' y='380' text-anchor='middle' fill='%23FFF' font-family='sans-serif' font-size='20' font-weight='bold'>ECLIPSE</text><text x='300' y='420' text-anchor='middle' fill='%23CCC' font-family='sans-serif' font-size='14'>${name}</text></svg>`;

        
        const demoProducts = [
          {
            id: 'PROD-1', title: 'Unisex Summer Graphic Tee', description: 'Lightweight summer t-shirt in white, designed for both men and women. Breathable and comfortable for the hot Algerian summer.', price: 3500, category: 'T-Shirts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            sizes: { S: 10, M: 20, L: 15, XL: 5 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-2', title: 'Eclipse Essential Summer Set', description: 'Matching unisex summer set consisting of a loose tee and lightweight shorts.', price: 6500, category: 'Sets',
            images: ['/img/summer2.jpg', '/img/summer1.jpg'],
            sizes: { S: 5, M: 10, L: 10, XL: 2 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-3', title: 'Lightweight Cargo Shorts', description: 'Utility shorts for summer days. Unisex fit with adjustable waist.', price: 4500, category: 'Shorts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            sizes: { S: 8, M: 12, L: 8, XL: 4 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-4', title: 'Breezy Linen Shirt', description: 'Flowy linen shirt for beach days and summer nights. Fits all genders beautifully.', price: 5500, category: 'Shirts',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            sizes: { S: 3, M: 6, L: 6, XL: 3 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-5', title: 'Oversized Summer Tank', description: 'Sleeveless tank top with a relaxed unisex fit. Perfect for layering or wearing on its own.', price: 2800, category: 'T-Shirts',
            images: ['/img/summer2.jpg', '/img/summer1.jpg'],
            sizes: { S: 15, M: 25, L: 20, XL: 10 }, createdAt: new Date().toISOString()
          },
          {
            id: 'PROD-6', title: 'Eclipse Bucket Hat', description: 'Essential summer accessory. One size fits all, providing shade and style.', price: 2200, category: 'Accessories',
            images: ['/img/summer1.jpg', '/img/summer2.jpg'],
            sizes: { S: 10, M: 15, L: 10, XL: 5 }, createdAt: new Date().toISOString()
          }
        ];
        // Force update for summer theme
        setData('eclipse_products', demoProducts);
      }
    }
  };

  EclipseStore.init();
  window.EclipseStore = EclipseStore;
})(window);
