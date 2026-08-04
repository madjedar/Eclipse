let currentCategory = 'All';
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
  if(!window.EclipseStore) return;
  const categories = ['All', 'T-Shirts', 'Hoodies', 'Pants', 'Jackets', 'Accessories'];
  const filtersContainer = document.getElementById('category-filters');
  
  if (filtersContainer) {
    filtersContainer.innerHTML = categories.map(cat => 
      `<button class="filter-btn ${cat === 'All' ? 'filter-btn--active' : ''}" onclick="filterCategory('${cat}')">${cat}</button>`
    ).join('');
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderGrid();
    });
  }

  renderGrid();
});

window.filterCategory = function(cat) {
  currentCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.textContent === cat);
  });
  renderGrid();
};

function renderGrid() {
  const allProducts = window.EclipseStore.getProducts();
  let filtered = currentCategory === 'All' ? allProducts : allProducts.filter(p => p.category === currentCategory);
  
  if(currentSort === 'price-low') filtered.sort((a,b) => a.price - b.price);
  else if(currentSort === 'price-high') filtered.sort((a,b) => b.price - a.price);
  else filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const grid = document.getElementById('shop-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!grid) return;

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if(emptyState) emptyState.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    if(emptyState) emptyState.style.display = 'none';
    grid.innerHTML = filtered.map((p, index) => {
      const secondImage = p.images[1] || p.images[0];
      return `
        <div class="product-card">
          <div class="product-card__image-wrap">
            <span class="product-card__badge-tag">UNISEX</span>
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
}

window.quickAddToCart = function(id, size) {
  window.EclipseStore.addToCart(id, size, 1);
  if(window.EclipseApp) {
    EclipseApp.updateCartBadge();
    EclipseApp.renderCartSidebar();
    EclipseApp.showNotification(`Added ${size} to cart!`, 'success');
    EclipseApp.openCart();
  }
};
