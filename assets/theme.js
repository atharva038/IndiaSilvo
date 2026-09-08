/**
 * Indiasilvo Theme Controller
 * Vanilla ES6+ Shopify Cart, Navigation & Interactive Engine
 */

class IndiasilvoTheme {
  constructor() {
    this.initHeaderScroll();
    this.initDrawers();
    this.initSizeGuideModal();
    this.initSearchModal();
    this.initAjaxCart();
    this.initAccordions();
  }

  // 1. Sticky Header Scroll Reaction
  initHeaderScroll() {
    const header = document.querySelector('.site-header-wrapper');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // 2. Drawers (Mobile Nav & Cart Drawer) & Backdrop Controller
  initDrawers() {
    const backdrop = document.getElementById('overlay-backdrop');

    // Mobile Navigation Drawer
    const mobileMenuTriggers = document.querySelectorAll('[data-drawer-trigger="mobile-nav"]');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavClose = document.querySelectorAll('[data-drawer-close="mobile-nav"]');

    this.activeTrigger = null;
    mobileMenuTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.activeTrigger = btn;
        btn.setAttribute('aria-expanded', 'true');
        this.openDrawer(mobileNavDrawer);
      });
    });

    mobileNavClose.forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeAllDrawers());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDrawers();
      }
    });
  }

  openDrawer(drawerEl) {
    if (!drawerEl) return;
    document.body.classList.add('drawer-open');
    drawerEl.classList.add('is-open');
    drawerEl.setAttribute('aria-hidden', 'false');
  }

  closeAllDrawers() {
    document.body.classList.remove('drawer-open', 'modal-open');
    document.querySelectorAll('.mobile-nav-drawer, .cart-drawer, .search-modal, .size-guide-modal').forEach(el => {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('[data-drawer-trigger], [data-modal-trigger]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
    if (this.activeTrigger) {
      this.activeTrigger.focus();
      this.activeTrigger = null;
    }
  }

  // 2b. Size Guide Modal
  initSizeGuideModal() {
    const sizeModal = document.getElementById('size-guide-modal');
    const triggers = document.querySelectorAll('[data-modal-trigger="size-guide"]');
    const closeBtns = document.querySelectorAll('[data-modal-close="size-guide"]');

    if (!sizeModal) return;

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('modal-open');
        sizeModal.classList.add('is-open');
        sizeModal.setAttribute('aria-hidden', 'false');
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });
  }

  // 3. Search Modal & Predictive Search
  initSearchModal() {
    const searchModal = document.getElementById('search-modal');
    const triggers = document.querySelectorAll('[data-modal-trigger="search"]');
    const closeBtns = document.querySelectorAll('[data-modal-close="search"]');
    const searchInput = document.querySelector('.search-modal__input');
    const searchResults = document.querySelector('.search-modal__results');

    if (!searchModal) return;

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('modal-open');
        searchModal.classList.add('is-open');
        searchModal.setAttribute('aria-hidden', 'false');
        if (searchInput) setTimeout(() => searchInput.focus(), 100);
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });

    if (searchInput && searchResults) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 2) {
          searchResults.innerHTML = '';
          return;
        }

        debounceTimer = setTimeout(() => {
          fetch(`${window.Indiasilvo.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5&section_id=predictive-search`)
            .then(res => res.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const resultsSection = doc.querySelector('#shopify-section-predictive-search') || doc.body;
              searchResults.innerHTML = resultsSection.innerHTML;
            })
            .catch(() => {
              // Graceful fallback: regular form submission
            });
        }, 300);
      });
    }
  }

  // 4. AJAX Cart Controller
  initAjaxCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartTriggers = document.querySelectorAll('[data-drawer-trigger="cart"]');
    const cartCloseBtns = document.querySelectorAll('[data-drawer-close="cart"]');

    cartTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer(cartDrawer);
        this.refreshCart();
      });
    });

    cartCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });

    // Delegate Form Add to Cart
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[action$="/cart/add"]');
      if (!form) return;

      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
      }

      const formData = new FormData(form);

      fetch(window.Indiasilvo.routes.cart_add_url + '.js', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(item => {
        this.openDrawer(cartDrawer);
        this.refreshCart();
      })
      .catch(err => {
        console.error('Add to Cart Error:', err);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitBtn.innerHTML = originalText;
        }
      });
    });

    // Delegate Quantity & Removal in Cart Drawer
    document.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('[data-cart-qty-change]');
      if (qtyBtn) {
        const key = qtyBtn.dataset.key;
        const currentQty = parseInt(qtyBtn.dataset.currentQty, 10);
        const delta = parseInt(qtyBtn.dataset.cartQtyChange, 10);
        const newQty = Math.max(0, currentQty + delta);
        this.updateCartItem(key, newQty);
        return;
      }

      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        const key = removeBtn.dataset.key;
        this.updateCartItem(key, 0);
        return;
      }
    });

    // Cart Note Auto-Save
    document.addEventListener('change', (e) => {
      if (e.target.matches('#cart-note-input')) {
        fetch(window.Indiasilvo.routes.cart + '/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: e.target.value })
        });
      }
    });
  }

  refreshCart() {
    fetch(window.Indiasilvo.routes.cart + '.js')
      .then(res => res.json())
      .then(cart => {
        this.renderCart(cart);
      });
  }

  updateCartItem(key, quantity) {
    fetch(window.Indiasilvo.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    .then(res => res.json())
    .then(cart => {
      this.renderCart(cart);
    });
  }

  formatMoney(cents) {
    if (typeof cents !== 'number') return cents;
    const format = window.Indiasilvo.moneyFormat || '${{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
  }

  renderCart(cart) {
    // Update Badge Count
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = cart.item_count;
      badge.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });

    const itemsContainer = document.querySelector('.cart-drawer__items');
    const emptyContainer = document.querySelector('.cart-drawer__empty');
    const subtotalEl = document.querySelector('.cart-drawer__subtotal-price');
    const footerEl = document.querySelector('.cart-drawer__footer');
    const freeShippingEl = document.querySelector('.cart-free-shipping');

    if (!itemsContainer) return;

    if (cart.item_count === 0) {
      itemsContainer.innerHTML = '';
      if (emptyContainer) emptyContainer.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      if (freeShippingEl) freeShippingEl.style.display = 'none';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';
    if (freeShippingEl) freeShippingEl.style.display = 'block';

    // Free Shipping Progress
    if (freeShippingEl && window.Indiasilvo.cartStrings.freeShippingThreshold > 0) {
      const thresholdCents = window.Indiasilvo.cartStrings.freeShippingThreshold * 100;
      const remainingCents = thresholdCents - cart.total_price;
      const progressBar = freeShippingEl.querySelector('.cart-free-shipping__progress');
      const progressText = freeShippingEl.querySelector('.cart-free-shipping__text');

      if (remainingCents <= 0) {
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = window.Indiasilvo.cartStrings.freeShippingAchieved;
      } else {
        const percent = Math.min(100, Math.round((cart.total_price / thresholdCents) * 100));
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) {
          progressText.textContent = window.Indiasilvo.cartStrings.freeShippingMessage.replace('[amount]', this.formatMoney(remainingCents));
        }
      }
    }

    if (subtotalEl) {
      subtotalEl.textContent = this.formatMoney(cart.total_price);
    }

    // Render Line Items
    let html = '';
    cart.items.forEach(item => {
      const imageSrc = item.image ? item.image : '';
      html += `
        <div class="cart-item" data-line-item-key="${item.key}">
          <div class="cart-item__image-wrap">
            ${imageSrc ? `<img src="${imageSrc}" alt="${item.title}" loading="lazy" width="80" height="80">` : ''}
          </div>
          <div class="cart-item__details">
            <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
            ${item.variant_title ? `<span class="cart-item__variant">${item.variant_title}</span>` : ''}
            <div class="cart-item__price">${this.formatMoney(item.final_line_price)}</div>
            
            <div class="cart-item__actions">
              <div class="quantity-stepper">
                <button type="button" class="quantity-stepper__btn" data-cart-qty-change="-1" data-key="${item.key}" data-current-qty="${item.quantity}" aria-label="Decrease quantity">
                  -
                </button>
                <span class="quantity-stepper__input">${item.quantity}</span>
                <button type="button" class="quantity-stepper__btn" data-cart-qty-change="1" data-key="${item.key}" data-current-qty="${item.quantity}" aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button type="button" class="cart-item__remove-btn" data-cart-remove data-key="${item.key}">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });

    itemsContainer.innerHTML = html;
  }

  // 5. Accessible Collapsible Accordions (For PDP specs, care guide, FAQ)
  initAccordions() {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      if (!item) return;

      const isOpen = item.classList.contains('is-active');
      const content = item.querySelector('.accordion-content');

      if (isOpen) {
        item.classList.remove('is-active');
        header.setAttribute('aria-expanded', 'false');
        if (content) content.style.maxHeight = null;
      } else {
        item.classList.add('is-active');
        header.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.IndiasilvoApp = new IndiasilvoTheme();
});
