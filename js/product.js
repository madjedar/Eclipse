let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  if(!window.EclipseStore) return;
  await window.EclipseStore.fetchLatestProducts();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if(!id) {
    window.location.href = '/shop';
    return;
  }

  currentProduct = window.EclipseStore.getProduct(id);
  if(!currentProduct) {
    document.getElementById('pdp-content').innerHTML = '<h2>Product not found</h2>';
    return;
  }

  // Default selected color to first available color
  const productColors = (currentProduct.colors && currentProduct.colors.length) ? currentProduct.colors : ['Black'];
  selectedColor = productColors[0];

  document.title = `Eclipse. — ${currentProduct.title}`;
  renderPDP();
  renderRelated();
});

function renderPDP() {
  const content = document.getElementById('pdp-content');
  
  const thumbsHtml = currentProduct.images.map((img, i) => 
    `<img src="${img}" class="pdp-gallery__thumb ${i===0?'active':''}" onclick="setMainImage('${img}', this)" onerror="this.outerHTML=''">`
  ).join('');

  const productColors = (currentProduct.colors && currentProduct.colors.length) ? currentProduct.colors : ['Black'];
  const colorsHtml = productColors.map((col, i) => 
    `<button class="color-pill ${col === selectedColor ? 'active' : ''}" onclick="selectColor(this, '${col}')">${col}</button>`
  ).join('');

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  content.innerHTML = `
    <div class="pdp-gallery">
      <img src="${currentProduct.images[0]}" id="main-image" class="pdp-gallery__main" alt="${currentProduct.title}" onerror="this.outerHTML='<div class=\\'placeholder-image\\' style=\\'aspect-ratio:3/4\\'>Eclipse</div>'">
      <div class="pdp-gallery__thumbs">${thumbsHtml}</div>
    </div>
    <div class="pdp-info">
      <div class="pdp-info__category">${currentProduct.category}</div>
      <h1 class="pdp-info__title">${currentProduct.title}</h1>
      <div class="pdp-info__price">${window.EclipseApp ? EclipseApp.formatPrice(currentProduct.price) : currentProduct.price}</div>
      <p class="pdp-info__desc">${currentProduct.description}</p>
      
      <div style="margin-bottom:16px;">
        <div style="margin-bottom:8px;font-weight:600;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Available Colors:</div>
        <div class="color-selector" style="display:flex; gap:8px; flex-wrap:wrap;">${colorsHtml}</div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="margin-bottom:8px;font-weight:600;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Size:</div>
        <div class="size-selector" id="size-selector-container"></div>
        <div id="stock-display" style="margin-top:8px;font-size:14px;color:var(--color-text-light);">Select a size</div>
      </div>
      
      <div>
        <div style="margin-bottom:8px;font-weight:600;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Quantity:</div>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="updateQty(-1)">-</button>
          <input type="number" class="qty-input" id="qty-input" value="1" min="1" readonly>
          <button class="qty-btn" onclick="updateQty(1)">+</button>
        </div>
      </div>
      
      <div class="pdp-actions" style="margin-top:24px;">
        <button class="btn btn--outline btn--lg" id="add-to-cart-btn" disabled onclick="addAndCart()">Add to Cart</button>
        <button class="btn btn--primary btn--lg" id="buy-now-btn" disabled onclick="buyNow()">Buy Now</button>
      </div>
    </div>
  `;
  renderSizes();
}

function renderSizes() {
  const container = document.getElementById('size-selector-container');
  if (!container) return;
  
  selectedSize = null;
  document.getElementById('stock-display').textContent = 'Select a size';
  document.getElementById('add-to-cart-btn').disabled = true;
  document.getElementById('buy-now-btn').disabled = true;
  document.getElementById('qty-input').value = 1;
  quantity = 1;

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const stockObj = (currentProduct.inventory && currentProduct.inventory[selectedColor]) 
    ? currentProduct.inventory[selectedColor] 
    : (currentProduct.sizes || {});

  const sizesHtml = sizesList.map(size => {
    const stock = stockObj[size] || 0;
    return `<button class="size-pill ${stock === 0 ? 'size-pill--out' : ''}" ${stock === 0 ? 'disabled' : ''} onclick="selectSize(this, '${size}', ${stock})">${size}</button>`;
  }).join('');

  container.innerHTML = sizesHtml;
}

window.setMainImage = function(src, el) {
  document.getElementById('main-image').src = src;
  document.querySelectorAll('.pdp-gallery__thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

window.selectColor = function(btn, color) {
  document.querySelectorAll('.color-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = color;
  renderSizes();
}

window.selectSize = function(btn, size, stock) {
  document.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
  quantity = 1;
  document.getElementById('qty-input').value = quantity;
  
  document.getElementById('stock-display').textContent = stock < 5 ? `Only ${stock} left in stock` : 'In stock';
  document.getElementById('stock-display').style.color = stock < 5 ? '#e74c3c' : 'var(--color-text-light)';
  
  document.getElementById('add-to-cart-btn').disabled = false;
  document.getElementById('buy-now-btn').disabled = false;
}

window.updateQty = function(change) {
  if(!selectedSize) return;
  const stockObj = (currentProduct.inventory && currentProduct.inventory[selectedColor]) 
    ? currentProduct.inventory[selectedColor] 
    : (currentProduct.sizes || {});
  const maxStock = stockObj[selectedSize] || 0;
  let newQty = quantity + change;
  if(newQty >= 1 && newQty <= maxStock) {
    quantity = newQty;
    document.getElementById('qty-input').value = quantity;
  }
}

window.addAndCart = function() {
  if(!selectedSize) return;
  window.EclipseStore.addToCart(currentProduct.id, selectedSize, selectedColor, quantity);
  if(window.EclipseApp) {
    EclipseApp.updateCartBadge();
    EclipseApp.showNotification('Added to cart', 'success');
    EclipseApp.renderCartSidebar();
    EclipseApp.openCart();
  }
}

window.buyNow = function() {
  if(!selectedSize) return;
  window.EclipseStore.addToCart(currentProduct.id, selectedSize, selectedColor, quantity);
  window.location.href = '/checkout';
}

function renderRelated() {
  const allProducts = window.EclipseStore.getProducts();
  const related = allProducts
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const grid = document.getElementById('related-grid');
  grid.innerHTML = related.map(p => `
    <a href="/product?id=${p.id}" class="product-card">
      <div class="product-card__image-wrap">
        <img src="${p.images[0]}" alt="${p.title}" class="product-card__image" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'>Eclipse</div>'">
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title">${p.title}</h3>
        <p class="product-card__price">${window.EclipseApp ? EclipseApp.formatPrice(p.price) : p.price}</p>
      </div>
    </a>
  `).join('');
}
