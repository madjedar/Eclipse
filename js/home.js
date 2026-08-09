document.addEventListener('DOMContentLoaded', async () => {
  if(!window.EclipseStore) return;
  await window.EclipseStore.fetchLatestProducts();
  const products = EclipseStore.getProducts();
  const featuredGrid = document.getElementById('featured-grid');
  
  if (featuredGrid && products) {
    const featuredProducts = products.slice(0, 4);
    featuredGrid.innerHTML = featuredProducts.map((p, index) => {
      const badges = ['LIMITED BATCH', 'UNISEX FIT', 'NEW DROP', 'SUMMER ESSENTIAL'];
      const badgeText = badges[index % badges.length];
      const secondImage = p.images[1] || p.images[0];

      return `
        <div class="product-card fade-in">
          <div class="product-card__image-wrap">
            <span class="product-card__badge-tag">${badgeText}</span>
            <a href="/product.html?id=${p.id}">
              <img src="${p.images[0]}" alt="${p.title}" class="product-card__image product-card__image--primary" onerror="this.outerHTML='<div class=\\'placeholder-image\\'>ECLIPSE</div>'">
              <img src="${secondImage}" alt="${p.title}" class="product-card__image product-card__image--secondary" onerror="this.style.display=\\'none\\'">
            </a>
            <div class="product-card__hover-sizes">
              <span style="color:#FFF; font-size:10px; text-transform:uppercase; letter-spacing:1px; margin-right:4px; align-self:center; font-weight:800;">QUICK ADD:</span>
              ${Object.keys(p.sizes).map(size => `
                <button class="quick-size-btn" onclick="quickAddToCart('${p.id}', '${size}')">${size}</button>
              `).join('')}
            </div>
          </div>
          <div class="product-card__info">
            <a href="/product.html?id=${p.id}" style="text-decoration:none; color:inherit;">
              <h3 class="product-card__title">${p.title}</h3>
            </a>
            <p class="product-card__price">${window.EclipseApp ? EclipseApp.formatPrice(p.price) : p.price + ' DA'}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Quick Add function
  window.quickAddToCart = function(id, size) {
    window.EclipseStore.addToCart(id, size, 1);
    if(window.EclipseApp) {
      EclipseApp.updateCartBadge();
      EclipseApp.renderCartSidebar();
      EclipseApp.showNotification(`Added ${size} to cart!`, 'success');
      EclipseApp.openCart();
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
