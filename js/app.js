(function(window) {
  const translations = {
    en: {
      home: "Home",
      shop: "Shop All",
      about: "About",
      contact: "Contact",
      cart: "Your Cart",
      checkout: "Checkout",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Shipping",
      emptyCart: "Your cart is empty.",
      heroBadge: "[ COLLECTION BATCH 01 ]",
      heroTitle1: "UNISEX",
      heroTitle2: "STREETWEAR",
      heroTitle3: "MANIFESTO.",
      heroSubtitle: "Minimalist unisex garments designed for the modern Algerian aesthetic. High-grade cottons, oversized cuts, engineered for high endurance.",
      exploreCollection: "Explore Collection",
      sizeFitGuide: "Size & Fit Guide",
      featuredDrops: "FEATURED DROPS",
      limitedRelease: "Limited summer unisex release — Batch 01",
      viewAllDrops: "View All Drops →",
      unisexFitArchitecture: "[ UNISEX FIT ARCHITECTURE ]",
      howGarmentsFit: "How Our Garments Fit",
      fitOverview: "Our silhouettes are crafted to be fluidly unisex. Choose your preferred aesthetic profile below to see how our cuts drape on both male and female frames.",
      oversizedFit: "Oversized Fit (Recommended)",
      standardFit: "Standard Fit",
      boxyCrop: "Boxy Crop",
      quickAdd: "QUICK ADD:",
      unisexTag: "UNISEX",
      shippingInfo: "Shipping Information",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      wilaya: "Wilaya",
      commune: "Commune",
      deliveryMethod: "Delivery Method",
      homeDelivery: "Home Delivery",
      stopDesk: "Stop Desk (Pickup)",
      shippingCourier: "Delivery Service Partner",
      nordEtOuest: "Norris Logistics (Nord et Ouest)",
      detailedAddress: "Detailed Address",
      placeOrder: "Place Order (Cash on Delivery)",
      orderSummary: "Order Summary",
      selectWilaya: "Select Wilaya",
      selectCommune: "Select Commune",
      orderConfirmed: "Order Confirmed",
      thankYou: "Thank you for your purchase.",
      orderId: "Order ID",
      codNotice: "We will contact you shortly to confirm your Cash on Delivery order.",
      continueShopping: "Continue Shopping",
      viewCatalog: "UNISEX CATALOG.",
      allDrops: "[ ALL DROPS ]",
      sortNewest: "Sort: Newest Drops",
      sortLow: "Price: Low to High",
      sortHigh: "Price: High to Low",
      adminDashboard: "Admin Dashboard",
      orders: "Orders",
      products: "Products",
      settings: "Settings",
      courier: "Courier",
      status: "Status",
      logistics: "Logistics",
      noDropsFound: "No drops found in this category.",
      youMayAlsoLike: "You May Also Like",
      aboutTitle: "About Eclipse",
      aboutSubtitle: "Our story, our mission",
      contactTitle: "Contact",
      contactSubtitle: "Get in touch with us",
      contactHelp: "We're here to help",
      contactHelpDesc: "Have a question about your order, our products, or just want to say hi? Fill out the form or reach us via our channels below.",
      email: "Email",
      phone: "Phone",
      socials: "Socials",
      name: "Name",
      message: "Message",
      sendMessage: "Send Message",
      msgSent: "Message sent successfully! We will get back to you soon."
    },
    fr: {
      home: "Accueil",
      shop: "Boutique",
      about: "À Propos",
      contact: "Contact",
      cart: "Votre Panier",
      checkout: "Commander",
      total: "Total",
      subtotal: "Sous-total",
      shipping: "Livraison",
      emptyCart: "Votre panier est vide.",
      heroBadge: "[ SÉRIE DE COLLECTION 01 ]",
      heroTitle1: "UNISEXE",
      heroTitle2: "STREETWEAR",
      heroTitle3: "MANIFESTE.",
      heroSubtitle: "Vêtements unisexe minimalistes conçus pour l'esthétique algérienne moderne. Cotons de qualité supérieure, coupes oversize.",
      exploreCollection: "Explorer la Collection",
      sizeFitGuide: "Guide des Tailles",
      featuredDrops: "NOUVEAUTÉS VEDETTES",
      limitedRelease: "Édition limitée d'été unisexe — Batch 01",
      viewAllDrops: "Voir Tout →",
      unisexFitArchitecture: "[ ARCHITECTURE DE COUPE UNISEXE ]",
      howGarmentsFit: "Comment Nos Vêtements Taillent",
      fitOverview: "Nos silhouettes sont conçues pour être fluides et unisexes. Choisissez votre profil esthétique ci-dessous.",
      oversizedFit: "Coupe Oversize (Recommandée)",
      standardFit: "Coupe Standard",
      boxyCrop: "Coupe Boxy Crop",
      quickAdd: "AJOUT RAPIDE:",
      unisexTag: "UNISEXE",
      shippingInfo: "Informations de Livraison",
      fullName: "Nom Complet",
      phoneNumber: "Numéro de Téléphone",
      wilaya: "Wilaya",
      commune: "Commune",
      deliveryMethod: "Mode de Livraison",
      homeDelivery: "Livraison à Domicile",
      stopDesk: "Point de Retrait (Stop Desk)",
      shippingCourier: "Partenaire de Livraison",
      nordEtOuest: "Norris Logistique (Nord et Ouest)",
      detailedAddress: "Adresse Détaillée",
      placeOrder: "Passer la Commande (Paiement à la Livraison)",
      orderSummary: "Résumé de la Commande",
      selectWilaya: "Sélectionner la Wilaya",
      selectCommune: "Sélectionner la Commune",
      orderConfirmed: "Commande Confirmée",
      thankYou: "Merci pour votre achat.",
      orderId: "ID de Commande",
      codNotice: "Nous vous contacterons sous peu pour confirmer votre commande en paiement à la livraison.",
      continueShopping: "Continuer vos Achats",
      viewCatalog: "CATALOGUE UNISEXE.",
      allDrops: "[ TOUS LES PRODUITS ]",
      sortNewest: "Trier: Plus Récent",
      sortLow: "Prix: Croissant",
      sortHigh: "Prix: Décroissant",
      adminDashboard: "Tableau de Bord Admin",
      orders: "Commandes",
      products: "Produits",
      settings: "Paramètres",
      courier: "Transporteur",
      status: "Statut",
      logistics: "Logistique",
      noDropsFound: "Aucun produit trouvé dans cette catégorie.",
      youMayAlsoLike: "Vous aimerez aussi",
      aboutTitle: "À propos d'Eclipse",
      aboutSubtitle: "Notre histoire, notre mission",
      contactTitle: "Contact",
      contactSubtitle: "Contactez-nous",
      contactHelp: "Nous sommes là pour vous aider",
      contactHelpDesc: "Vous avez une question concernant votre commande, nos produits, ou vous voulez juste dire bonjour ? Remplissez le formulaire ou contactez-nous via nos canaux ci-dessous.",
      email: "Email",
      phone: "Téléphone",
      socials: "Réseaux sociaux",
      name: "Nom",
      message: "Message",
      sendMessage: "Envoyer le message",
      msgSent: "Message envoyé avec succès ! Nous vous répondrons bientôt."
    },
    ar: {
      home: "الرئيسية",
      shop: "المتجر",
      about: "معلومات عنا",
      contact: "اتصل بنا",
      cart: "سلة التسوق",
      checkout: "إتمام الطلب",
      total: "الإجمالي",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      emptyCart: "سلة التسوق فارغة.",
      heroBadge: "[ الدفعة الأولى 01 ]",
      heroTitle1: "ملابس",
      heroTitle2: "الشارع",
      heroTitle3: "للجنسين.",
      heroSubtitle: "ملابس بسيطة وعصرية مصممة للجماليات الجزائرية الحديثة. قطن عالي الجودة وقصات واسعة مريحة.",
      exploreCollection: "استكشف التشكيلة",
      sizeFitGuide: "دليل المقاسات",
      featuredDrops: "التشكيلة المميزة",
      limitedRelease: "إصدار صيفي محدود للجنسين — الدفعة 01",
      viewAllDrops: "عرض الكل ←",
      unisexFitArchitecture: "[ دليل قياسات الملابس ]",
      howGarmentsFit: "كيف تناسبك ملابسنا",
      fitOverview: "تم تصميم تصاميمنا لتناسب الجنسين بمرونة. اختر نوع القصة المفضلة لديك أدناه.",
      oversizedFit: "قصة واسعة (موصى بها)",
      standardFit: "قصة قياسية",
      boxyCrop: "قصة قصيرة واسعة",
      quickAdd: "إضافة سريعة:",
      unisexTag: "للجنسين",
      shippingInfo: "معلومات الشحن",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      wilaya: "الولاية",
      commune: "البلدية",
      deliveryMethod: "طريقة الاستلام",
      homeDelivery: "التوصيل للمنزل",
      stopDesk: "التوصيل للمكتب (Stop Desk)",
      shippingCourier: "شركة الشحن والتوصيل",
      nordEtOuest: "نوريس لوجستيك (نورد إي أويست)",
      detailedAddress: "العنوان التفصيلي",
      placeOrder: "تأكيد الطلب (الدفع عند الاستلام)",
      orderSummary: "ملخص الطلب",
      selectWilaya: "اختر الولاية",
      selectCommune: "اختر البلدية",
      orderConfirmed: "تم تأكيد الطلب",
      thankYou: "شكراً لتسوقك معنا.",
      orderId: "رقم الطلب",
      codNotice: "سنتصل بك قريباً لتأكيد طلبك والدفع عند الاستلام.",
      continueShopping: "مواصلة التسوق",
      viewCatalog: "كتالوج التشكيلة.",
      allDrops: "[ جميع المنتجات ]",
      sortNewest: "الترتيب: الأحدث",
      sortLow: "السعر: من الأقل للأعلى",
      sortHigh: "السعر: من الأعلى للأقل",
      adminDashboard: "لوحة تحكم المسؤول",
      orders: "الطلبات",
      products: "المنتجات",
      settings: "الإعدادات",
      courier: "شركة الشحن",
      status: "الحالة",
      logistics: "الخدمات اللوجستية",
      noDropsFound: "لم يتم العثور على منتجات في هذه الفئة.",
      youMayAlsoLike: "قد يعجبك أيضًا",
      aboutTitle: "حول إكليبس",
      aboutSubtitle: "قصتنا ومهمتنا",
      contactTitle: "اتصل بنا",
      contactSubtitle: "تواصل معنا",
      contactHelp: "نحن هنا للمساعدة",
      contactHelpDesc: "هل لديك سؤال حول طلبك، منتجاتنا، أو تريد فقط أن تلقي التحية؟ املأ النموذج أو تواصل معنا عبر قنواتنا أدناه.",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      socials: "وسائل التواصل الاجتماعي",
      name: "الاسم",
      message: "الرسالة",
      sendMessage: "إرسال رسالة",
      msgSent: "تم إرسال الرسالة بنجاح! سنرد عليك قريبًا."
    }
  };

  const EclipseApp = {
    formatPrice: function(num) {
      if (typeof num !== 'number') num = Number(num) || 0;
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' DA';
    },

    initTheme: function() {
      const savedTheme = localStorage.getItem('eclipse_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
    },

    toggleTheme: function() {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('eclipse_theme', newTheme);
    },

    setLang: function(lang) {
      localStorage.setItem('eclipse_lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      window.location.reload();
    },

    getLang: function() {
      return localStorage.getItem('eclipse_lang') || 'en';
    },

    t: function(key) {
      const lang = this.getLang();
      return translations[lang] && translations[lang][key] ? translations[lang][key] : (translations['en'][key] || key);
    },

    generateId: function() {
      return 'ECL-' + Math.floor(1000 + Math.random() * 9000);
    },

    showNotification: function(message, type = 'success') {
      const notif = document.createElement('div');
      notif.className = `notification notification--${type}`;
      notif.textContent = message;
      document.body.appendChild(notif);
      
      setTimeout(() => notif.classList.add('notification--show'), 10);
      setTimeout(() => {
        notif.classList.remove('notification--show');
        setTimeout(() => notif.remove(), 300);
      }, 3000);
    },

    renderHeader: function(containerId = 'header-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const currentPath = window.location.pathname;
      const isActive = (path) => currentPath === path || (path !== '/' && currentPath.startsWith(path)) ? 'header__nav-link--active' : '';

      const t = (k) => this.t(k);
      const lang = this.getLang();
      
      container.innerHTML = `
        <header class="header" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
          <div class="header__inner">
            <a href="/" class="header__logo">Eclipse.</a>
            <nav class="header__nav">
              <a href="/index.html" class="header__nav-link ${isActive('/') || isActive('/index.html')}">${t('home')}</a>
              <a href="/shop.html" class="header__nav-link ${isActive('/shop.html')}">${t('shop')}</a>
              <a href="/about.html" class="header__nav-link ${isActive('/about.html')}">${t('about')}</a>
              <a href="/contact.html" class="header__nav-link ${isActive('/contact.html')}">${t('contact')}</a>
            </nav>
            <div class="header__actions">
              <select onchange="EclipseApp.setLang(this.value)" class="header__nav-link" style="padding:7px 12px; font-family:var(--font-primary); outline:none; cursor:pointer;">
                <option value="en" ${lang === 'en' ? 'selected' : ''}>EN</option>
                <option value="fr" ${lang === 'fr' ? 'selected' : ''}>FR</option>
                <option value="ar" ${lang === 'ar' ? 'selected' : ''}>AR</option>
              </select>
              <button class="header__nav-link" onclick="EclipseApp.toggleTheme()" title="Toggle Theme" style="padding:8px 12px; cursor:pointer;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </button>
              <button class="header__cart-btn" onclick="EclipseApp.openCart()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span class="header__cart-count" id="header-cart-count">0</span>
              </button>
              <button class="header__menu-btn" onclick="EclipseApp.toggleMobile()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </header>
        <div class="mobile-nav" id="mobile-nav" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
          <a href="/index.html" class="mobile-nav__link">${t('home')}</a>
          <a href="/shop.html" class="mobile-nav__link">${t('shop')}</a>
          <a href="/about.html" class="mobile-nav__link">${t('about')}</a>
          <a href="/contact.html" class="mobile-nav__link">${t('contact')}</a>
        </div>
      `;
    },

    renderFooter: function(containerId = 'footer-container') {
      const container = document.getElementById(containerId);
      if (!container) return;
      const t = (k) => this.t(k);
      const lang = this.getLang();

      container.innerHTML = `
        <footer class="footer" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
          <div class="container footer__inner">
            <div>
              <div class="footer__brand">Eclipse.</div>
              <p style="color:rgba(255,255,255,0.75); font-size:14px; line-height:1.6;">
                ${lang === 'ar' ? 'ملابس الشارع الجزائرية المصممة للجنسين.' : (lang === 'fr' ? 'Streetwear algérien unisex de haute qualité.' : 'Algerian Unisex Streetwear.')}
              </p>
            </div>
            <div>
              <div class="footer__heading">${t('shop')}</div>
              <a href="/shop.html" class="footer__link">${t('shop')}</a>
            </div>
            <div>
              <div class="footer__heading">${t('about')}</div>
              <a href="/about.html" class="footer__link">${t('about')}</a>
              <a href="/contact.html" class="footer__link">${t('contact')}</a>
              <a href="/admin/index.html" class="footer__link">${t('adminDashboard')}</a>
            </div>
            <div>
              <div class="footer__heading">Contact & Social</div>
              <a href="https://www.instagram.com/eclipse.notasalways?igsh=MXRlN202cHNpeGpjYQ==&utm_source=qr" target="_blank" rel="noopener noreferrer" class="footer__link">Instagram (@eclipse.notasalways)</a>
              <a href="mailto:Eclipsebrand213@gmail.com" class="footer__link">Eclipsebrand213@gmail.com</a>
            </div>
          </div>
        </footer>
      `;
    },

    renderCartSidebar: function(containerId = 'cart-sidebar-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const wasOpen = document.getElementById('cart-sidebar')?.classList.contains('cart-sidebar--open');
      const cart = window.EclipseStore.getCart();
      const total = window.EclipseStore.getCartTotal();
      const t = (k) => this.t(k);
      const lang = this.getLang();

      let itemsHtml = '';
      if (cart.length === 0) {
        itemsHtml = `<div class="cart-empty">${t('emptyCart')}</div>`;
      } else {
        itemsHtml = cart.map((item, index) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item__image">
            <div class="cart-item__details">
              <div class="cart-item__title">${item.title}</div>
              <div class="cart-item__meta">${t('size')}: ${item.size}</div>
              <div class="cart-item__price">${this.formatPrice(item.price)}</div>
              <div class="cart-item__qty">
                <button onclick="EclipseApp.changeQty(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="EclipseApp.changeQty(${index}, 1)">+</button>
              </div>
              <button class="cart-item__remove" onclick="EclipseApp.removeItem(${index})">Remove</button>
            </div>
          </div>
        `).join('');
      }

      container.innerHTML = `
        <div class="cart-overlay ${wasOpen ? 'cart-overlay--open' : ''}" id="cart-overlay" onclick="EclipseApp.closeCart()"></div>
        <div class="cart-sidebar ${wasOpen ? 'cart-sidebar--open' : ''}" id="cart-sidebar" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
          <div class="cart-header">
            <div class="cart-header__title">${t('cart')}</div>
            <button class="cart-header__close" onclick="EclipseApp.closeCart()">×</button>
          </div>
          <div class="cart-items">
            ${itemsHtml}
          </div>
          <div class="cart-footer">
            <div class="cart-total">
              <span>${t('total')}</span>
              <span>${this.formatPrice(total)}</span>
            </div>
            <a href="/checkout.html" class="btn btn--primary btn--full" ${cart.length === 0 ? 'style="pointer-events: none; opacity: 0.5"' : ''}>${t('checkout')}</a>
          </div>
        </div>
      `;
    },

    changeQty: function(index, delta) {
      const cart = window.EclipseStore.getCart();
      if (cart[index]) {
        const newQty = cart[index].quantity + delta;
        if (newQty > 0) {
          window.EclipseStore.updateCartItem(index, newQty);
        } else {
          window.EclipseStore.removeFromCart(index);
        }
        this.renderCartSidebar();
        this.updateCartBadge();
      }
    },

    removeItem: function(index) {
      window.EclipseStore.removeFromCart(index);
      this.renderCartSidebar();
      this.updateCartBadge();
    },

    openCart: function() {
      document.getElementById('cart-overlay').classList.add('cart-overlay--open');
      document.getElementById('cart-sidebar').classList.add('cart-sidebar--open');
      document.body.style.overflow = 'hidden';
    },

    closeCart: function() {
      document.getElementById('cart-overlay').classList.remove('cart-overlay--open');
      document.getElementById('cart-sidebar').classList.remove('cart-sidebar--open');
      document.body.style.overflow = '';
    },

    toggleMobile: function() {
      const nav = document.getElementById('mobile-nav');
      nav.classList.toggle('mobile-nav--open');
    },

    updateCartBadge: function() {
      const count = window.EclipseStore.getCartCount();
      const badge = document.getElementById('header-cart-count');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    },

    applyDOMTranslations: function() {
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          const translation = this.t(key);
          if (translation) el.textContent = translation;
        }
      });

      const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          const translation = this.t(key);
          if (translation) el.setAttribute('placeholder', translation);
        }
      });
    },

    initTopoBackground: function() {
      if (!document.getElementById('topo-bg-layer')) {
        const bg = document.createElement('div');
        bg.id = 'topo-bg-layer';
        bg.className = 'topo-bg';
        document.body.appendChild(bg);
      }
      if (!document.getElementById('topo-glow-layer')) {
        const glow = document.createElement('div');
        glow.id = 'topo-glow-layer';
        glow.className = 'topo-glow-overlay';
        document.body.appendChild(glow);

        window.addEventListener('mousemove', (e) => {
          const x = (e.clientX / window.innerWidth) * 100;
          const y = (e.clientY / window.innerHeight) * 100;
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          const glowColor = isDark ? '255, 255, 255' : '0, 0, 0';
          const intensity = isDark ? '0.4' : '0.2';
          glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(${glowColor}, ${intensity}) 0%, rgba(${glowColor}, 0.08) 35%, transparent 70%)`;
        });
      }
    },

    initPage: function() {
      const lang = this.getLang();
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      
      this.initTheme();
      this.initTopoBackground();
      this.renderHeader('header-container');
      this.renderFooter('footer-container');
      this.renderCartSidebar('cart-sidebar-container');
      this.updateCartBadge();
      this.applyDOMTranslations();
    }
  };

  window.EclipseApp = EclipseApp;
})(window);
