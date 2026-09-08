/**
 * Indiasilvo Theme Controller
 * Vanilla ES6+ Shopify Cart, PDP Variant Selection, Gallery Lightbox, Predictive Search, Navigation & Commerce Engine
 */

class IndiasilvoTheme {
  constructor() {
    this.isUpdatingCart = false;
    this.initHeaderScroll();
    this.initDrawers();
    this.initSizeGuideModal();
    this.initSearchModal();
    this.initAjaxCart();
    this.initAccordions();
    this.initProductDetail();
    this.initRecentlyViewed();
    this.initProductRecommendations();
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
    document.querySelectorAll('.mobile-nav-drawer, .cart-drawer, .search-modal, .size-guide-modal, .product-zoom-modal').forEach(el => {
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

  // Toast Notification Engine
  showToast(message, type = 'success') {
    const toast = document.getElementById('theme-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `theme-toast is-visible theme-toast--${type}`;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3500);
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
    const searchInput = document.getElementById('SearchModalInput');
    const searchResults = document.getElementById('SearchModalResults');
    const searchClear = document.getElementById('SearchModalClear');
    const quickTags = document.getElementById('SearchModalQuickTags');

    if (!searchModal) return;

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('modal-open');
        searchModal.classList.add('is-open');
        searchModal.setAttribute('aria-hidden', 'false');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 150);
        }
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeAllDrawers());
    });

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.classList.add('is-hidden');
        if (searchResults) searchResults.innerHTML = '';
        if (quickTags) quickTags.style.display = 'flex';
        searchInput.focus();
      });
    }

    if (searchInput && searchResults) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (searchClear) {
          searchClear.classList.toggle('is-hidden', query.length === 0);
        }

        clearTimeout(debounceTimer);
        if (query.length < 2) {
          searchResults.innerHTML = '';
          if (quickTags) quickTags.style.display = 'flex';
          return;
        }

        if (quickTags) quickTags.style.display = 'none';

        debounceTimer = setTimeout(() => {
          fetch(`${window.Indiasilvo.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product,collection&resources[limit]=6&section_id=predictive-search`)
            .then(res => res.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const resultsSection = doc.querySelector('#shopify-section-predictive-search') || doc.body;
              searchResults.innerHTML = resultsSection.innerHTML;
            })
            .catch(() => {
              // Graceful fallback
            });
        }, 250);
      });

      // Keyboard navigation in search results
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          const firstResult = searchResults.querySelector('.search-predictive-item, .predictive-search-tag');
          if (firstResult) {
            e.preventDefault();
            firstResult.focus();
          }
        }
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
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }

      const formData = new FormData(form);

      fetch(window.Indiasilvo.routes.cart_add_url + '.js', {
        method: 'POST',
        body: formData
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.description || 'Unable to add item to bag.');
          });
        }
        return res.json();
      })
      .then(item => {
        this.openDrawer(cartDrawer);
        this.refreshCart();
        this.showToast('Added to Shopping Bag');
      })
      .catch(err => {
        console.error('Add to Cart Error:', err);
        this.showToast(err.message || 'Item could not be added', 'error');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
      });
    });

    // Delegate Quantity & Removal in Cart Drawer and Cart Page
    document.addEventListener('click', (e) => {
      if (this.isUpdatingCart) return;

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

    // Cart Note Auto-Save (Drawer and Page)
    document.addEventListener('change', (e) => {
      if (e.target.matches('#cart-note-input, #CartPageNote')) {
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
    if (this.isUpdatingCart) return;
    this.isUpdatingCart = true;

    // Visual feedback
    document.querySelectorAll(`[data-line-item-key="${key}"]`).forEach(el => {
      el.classList.add('is-updating');
    });

    fetch(window.Indiasilvo.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    .then(res => res.json())
    .then(cart => {
      this.renderCart(cart);
      if (quantity === 0) {
        this.showToast('Item removed from bag');
      } else {
        this.showToast('Shopping bag updated');
      }
    })
    .catch(err => {
      console.error('Cart update error:', err);
      this.showToast('Unable to update cart', 'error');
    })
    .finally(() => {
      this.isUpdatingCart = false;
      document.querySelectorAll(`[data-line-item-key="${key}"]`).forEach(el => {
        el.classList.remove('is-updating');
      });
    });
  }

  formatMoney(cents) {
    if (typeof cents !== 'number') return cents;
    const format = window.Indiasilvo.moneyFormat || '₹{{amount}}';
    const amount = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
  }

  renderCart(cart) {
    // 1. Update Badge Count across header
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = cart.item_count;
      badge.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });

    // 2. Update Drawer Elements
    const countPill = document.querySelector('[data-cart-count-pill]');
    if (countPill) countPill.textContent = cart.item_count;

    const itemsContainer = document.getElementById('CartDrawerItems');
    const emptyContainer = document.getElementById('CartDrawerEmpty');
    const subtotalEl = document.querySelector('.cart-drawer__subtotal-price');
    const footerEl = document.getElementById('CartDrawerFooter');
    const freeShippingEl = document.getElementById('CartDrawerFreeShipping');

    // 3. Update Cart Page Elements (if present)
    const cartPageItems = document.getElementById('CartPageItems');
    const cartPageSubtotal = document.getElementById('CartPageSubtotal');
    if (cartPageSubtotal) {
      cartPageSubtotal.textContent = this.formatMoney(cart.total_price);
    }

    if (cart.item_count === 0) {
      if (itemsContainer) itemsContainer.innerHTML = '';
      if (emptyContainer) emptyContainer.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      if (freeShippingEl) freeShippingEl.style.display = 'none';
      if (cartPageItems) {
        // If on cart page, reload or display empty state
        window.location.reload();
      }
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';
    if (freeShippingEl) freeShippingEl.style.display = 'block';

    // Free Shipping Progress calculation
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

    // Render Drawer Line Items
    if (itemsContainer) {
      let html = '';
      cart.items.forEach(item => {
        const imageSrc = item.image ? item.image : '';
        const hasDiscount = item.original_line_price > item.final_line_price;

        html += `
          <div class="cart-item" data-line-item-key="${item.key}">
            <div class="cart-item__image-wrap">
              ${imageSrc ? `<img src="${imageSrc}" alt="${item.title}" loading="lazy" width="80" height="80">` : ''}
            </div>
            <div class="cart-item__details">
              <div class="cart-item__head">
                <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
                <button type="button" class="cart-item__remove-btn" data-cart-remove data-key="${item.key}" aria-label="Remove item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
              </div>

              ${item.variant_title ? `<span class="cart-item__variant">${item.variant_title}</span>` : ''}

              <div class="cart-item__price-row">
                <div class="cart-item__price">
                  ${hasDiscount ? `
                    <span class="cart-item__price-sale">${this.formatMoney(item.final_line_price)}</span>
                    <s class="cart-item__price-compare">${this.formatMoney(item.original_line_price)}</s>
                  ` : `
                    <span>${this.formatMoney(item.final_line_price)}</span>
                  `}
                </div>
                
                <div class="quantity-stepper">
                  <button type="button" class="quantity-stepper__btn" data-cart-qty-change="-1" data-key="${item.key}" data-current-qty="${item.quantity}" aria-label="Decrease quantity">
                    -
                  </button>
                  <span class="quantity-stepper__input">${item.quantity}</span>
                  <button type="button" class="quantity-stepper__btn" data-cart-qty-change="1" data-key="${item.key}" data-current-qty="${item.quantity}" aria-label="Increase quantity">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      itemsContainer.innerHTML = html;
    }
  }

  // 5. Accessible Collapsible Accordions
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

  // 6. PDP Controller
  initProductDetail() {
    const productSection = document.querySelector('.product-section');
    if (!productSection) return;

    const sectionId = productSection.dataset.sectionId;
    const variantsDataEl = document.getElementById(`ProductJson-${sectionId}`);
    const mediaDataEl = document.getElementById(`ProductMediaJson-${sectionId}`);
    if (!variantsDataEl) return;

    let variants = [];
    let mediaList = [];
    try {
      variants = JSON.parse(variantsDataEl.textContent);
      if (mediaDataEl) mediaList = JSON.parse(mediaDataEl.textContent);
    } catch (e) {
      console.error('Error parsing product JSON data:', e);
    }

    const currentVariantInput = document.getElementById(`ProductSelectedVariantId-${sectionId}`);
    const priceEl = document.getElementById(`ProductPrice-${sectionId}`);
    const comparePriceEl = document.getElementById(`ProductComparePrice-${sectionId}`);
    const saveBadgeEl = document.getElementById(`ProductSaveBadge-${sectionId}`);
    const skuEl = document.querySelector(`#ProductSku-${sectionId} [data-sku-value]`);
    const inventoryEl = document.getElementById(`ProductInventory-${sectionId}`);
    const addToCartBtn = document.getElementById(`AddToCart-${sectionId}`);
    const addToCartText = addToCartBtn ? addToCartBtn.querySelector('[data-add-to-cart-text]') : null;

    // Sticky Mobile Bar Elements
    const stickyBar = document.getElementById(`StickyMobileBar-${sectionId}`);
    const stickyPriceEl = document.getElementById(`StickyMobilePrice-${sectionId}`);
    const stickyAddBtn = document.getElementById(`StickyMobileAddBtn-${sectionId}`);

    // Zoom Lightbox Elements
    const zoomModal = document.getElementById(`ProductZoomModal-${sectionId}`);
    const zoomImage = document.getElementById(`ProductZoomImage-${sectionId}`);
    const zoomCounterCurr = zoomModal ? zoomModal.querySelector('[data-zoom-curr]') : null;

    // Gallery Elements
    const galleryTrack = document.getElementById(`ProductGalleryTrack-${sectionId}`);
    const slides = productSection.querySelectorAll('.product-gallery__slide');
    const thumbs = productSection.querySelectorAll('.product-gallery__thumb');
    const dots = productSection.querySelectorAll('.product-gallery__dot');
    const counterCurr = productSection.querySelector('[data-gallery-current]');

    let currentSlideIndex = 0;
    let zoomCurrentIndex = 0;

    const setActiveMedia = (index) => {
      if (index < 0 || index >= slides.length) return;
      currentSlideIndex = index;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === index);
      });

      thumbs.forEach((thumb, idx) => {
        const isActive = idx === index;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === index);
      });

      if (counterCurr) {
        counterCurr.textContent = String(index + 1).padStart(2, '0');
      }

      if (galleryTrack && window.innerWidth < 990) {
        galleryTrack.scrollTo({
          left: galleryTrack.offsetWidth * index,
          behavior: 'smooth'
        });
      }
    };

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.mediaIndex, 10);
        setActiveMedia(index);
      });
    });

    const prevArrow = productSection.querySelector('[data-action="gallery-prev"]');
    const nextArrow = productSection.querySelector('[data-action="gallery-next"]');

    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        const nextIdx = currentSlideIndex > 0 ? currentSlideIndex - 1 : slides.length - 1;
        setActiveMedia(nextIdx);
      });
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        const nextIdx = currentSlideIndex < slides.length - 1 ? currentSlideIndex + 1 : 0;
        setActiveMedia(nextIdx);
      });
    }

    if (galleryTrack) {
      let isScrollingTimer;
      galleryTrack.addEventListener('scroll', () => {
        clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
          const width = galleryTrack.offsetWidth;
          if (width > 0) {
            const index = Math.round(galleryTrack.scrollLeft / width);
            if (index !== currentSlideIndex && index >= 0 && index < slides.length) {
              currentSlideIndex = index;
              thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
              dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
              if (counterCurr) counterCurr.textContent = String(index + 1).padStart(2, '0');
            }
          }
        }, 80);
      }, { passive: true });
    }

    // Zoom Lightbox
    const openZoomModal = (index) => {
      if (!zoomModal || !mediaList.length) return;
      zoomCurrentIndex = index;
      const media = mediaList[index];
      if (media && zoomImage) {
        zoomImage.src = media.zoomSrc || media.src;
        zoomImage.alt = media.alt || '';
        zoomImage.classList.remove('is-zoomed');
      }
      if (zoomCounterCurr) zoomCounterCurr.textContent = index + 1;

      document.body.classList.add('modal-open');
      zoomModal.classList.add('is-open');
      zoomModal.setAttribute('aria-hidden', 'false');
    };

    const closeZoomModal = () => {
      if (!zoomModal) return;
      document.body.classList.remove('modal-open');
      zoomModal.classList.remove('is-open');
      zoomModal.setAttribute('aria-hidden', 'true');
    };

    productSection.querySelectorAll('[data-action="open-zoom"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.zoomIndex, 10) || currentSlideIndex;
        openZoomModal(idx);
      });
    });

    if (zoomModal) {
      zoomModal.querySelectorAll('[data-action="close-zoom"]').forEach(btn => {
        btn.addEventListener('click', closeZoomModal);
      });

      const zoomPrev = zoomModal.querySelector('[data-action="zoom-prev"]');
      const zoomNext = zoomModal.querySelector('[data-action="zoom-next"]');

      if (zoomPrev) {
        zoomPrev.addEventListener('click', () => {
          const newIdx = zoomCurrentIndex > 0 ? zoomCurrentIndex - 1 : mediaList.length - 1;
          openZoomModal(newIdx);
        });
      }

      if (zoomNext) {
        zoomNext.addEventListener('click', () => {
          const newIdx = zoomCurrentIndex < mediaList.length - 1 ? zoomCurrentIndex + 1 : 0;
          openZoomModal(newIdx);
        });
      }

      if (zoomImage) {
        zoomImage.addEventListener('click', () => {
          zoomImage.classList.toggle('is-zoomed');
        });
      }

      document.addEventListener('keydown', (e) => {
        if (!zoomModal.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeZoomModal();
        if (e.key === 'ArrowLeft' && zoomPrev) zoomPrev.click();
        if (e.key === 'ArrowRight' && zoomNext) zoomNext.click();
      });
    }

    // Variant Selection Logic
    const variantPickers = productSection.querySelectorAll('.variant-pill');
    variantPickers.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const group = pill.closest('.variant-option-group');
        if (!group) return;

        group.querySelectorAll('.variant-pill').forEach(p => {
          p.classList.remove('is-selected');
          p.setAttribute('aria-checked', 'false');
        });
        pill.classList.add('is-selected');
        pill.setAttribute('aria-checked', 'true');

        const selectedText = group.querySelector('[data-option-selected]');
        if (selectedText) {
          selectedText.textContent = pill.dataset.optionValue;
        }

        const selectedOptions = [];
        productSection.querySelectorAll('.variant-option-group').forEach(optGroup => {
          const activePill = optGroup.querySelector('.variant-pill.is-selected');
          if (activePill) {
            selectedOptions.push(activePill.dataset.optionValue);
          }
        });

        const matchedVariant = variants.find(v => {
          return selectedOptions.every((val, idx) => v[`option${idx + 1}`] === val);
        });

        if (matchedVariant) {
          if (currentVariantInput) currentVariantInput.value = matchedVariant.id;
          if (priceEl) priceEl.textContent = this.formatMoney(matchedVariant.price);

          if (comparePriceEl) {
            if (matchedVariant.compare_at_price > matchedVariant.price) {
              comparePriceEl.textContent = this.formatMoney(matchedVariant.compare_at_price);
              comparePriceEl.classList.remove('is-hidden');
              if (saveBadgeEl) {
                const savePercent = Math.round(((matchedVariant.compare_at_price - matchedVariant.price) / matchedVariant.compare_at_price) * 100);
                saveBadgeEl.textContent = `Save ${savePercent}%`;
                saveBadgeEl.classList.remove('is-hidden');
              }
            } else {
              comparePriceEl.classList.add('is-hidden');
              if (saveBadgeEl) saveBadgeEl.classList.add('is-hidden');
            }
          }

          if (skuEl) skuEl.textContent = matchedVariant.sku || '—';

          if (inventoryEl) {
            if (matchedVariant.available) {
              inventoryEl.innerHTML = `
                <span class="inventory-indicator inventory-indicator--instock">
                  <span class="inventory-dot"></span>
                  <span>In Stock, Handcrafted & Ready to Dispatch</span>
                </span>
              `;
            } else {
              inventoryEl.innerHTML = `
                <span class="inventory-indicator inventory-indicator--soldout">
                  <span class="inventory-dot"></span>
                  <span>Currently Out of Stock</span>
                </span>
              `;
            }
          }

          if (addToCartBtn) {
            addToCartBtn.disabled = !matchedVariant.available;
            if (addToCartText) {
              addToCartText.textContent = matchedVariant.available ? (window.Indiasilvo.cartStrings?.addToCart || 'Add to Bag') : (window.Indiasilvo.cartStrings?.soldOut || 'Sold Out');
            }
          }

          if (stickyPriceEl) stickyPriceEl.textContent = this.formatMoney(matchedVariant.price);
          if (stickyAddBtn) {
            stickyAddBtn.disabled = !matchedVariant.available;
            const stickyBtnSpan = stickyAddBtn.querySelector('span');
            if (stickyBtnSpan) {
              stickyBtnSpan.textContent = matchedVariant.available ? 'Add to Bag' : 'Sold Out';
            }
          }

          if (matchedVariant.featured_media) {
            const targetMediaId = matchedVariant.featured_media.id;
            const mediaIndex = Array.from(slides).findIndex(s => s.dataset.mediaId == targetMediaId);
            if (mediaIndex !== -1) setActiveMedia(mediaIndex);
          }

          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('variant', matchedVariant.id);
          window.history.replaceState({ path: newUrl.href }, '', newUrl.href);

        } else {
          if (addToCartBtn) {
            addToCartBtn.disabled = true;
            if (addToCartText) addToCartText.textContent = 'Unavailable';
          }
          if (stickyAddBtn) {
            stickyAddBtn.disabled = true;
            const stickyBtnSpan = stickyAddBtn.querySelector('span');
            if (stickyBtnSpan) stickyBtnSpan.textContent = 'Unavailable';
          }
        }
      });
    });

    // PDP Quantity Steppers
    const qtyInput = document.getElementById(`ProductQuantity-${sectionId}`);
    productSection.querySelectorAll('[data-action="qty-decrease"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (qtyInput) {
          const val = parseInt(qtyInput.value, 10) || 1;
          qtyInput.value = Math.max(1, val - 1);
        }
      });
    });

    productSection.querySelectorAll('[data-action="qty-increase"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (qtyInput) {
          const val = parseInt(qtyInput.value, 10) || 1;
          qtyInput.value = Math.min(99, val + 1);
        }
      });
    });

    // Sticky Mobile Purchase Bar
    if (stickyBar && addToCartBtn) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              stickyBar.classList.add('is-visible');
            } else {
              stickyBar.classList.remove('is-visible');
            }
          });
        }, { threshold: 0.1 });

        observer.observe(addToCartBtn);
      }

      if (stickyAddBtn) {
        stickyAddBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (addToCartBtn && !addToCartBtn.disabled) {
            addToCartBtn.click();
          }
        });
      }
    }
  }

  // 7. Recently Viewed Products Tracker
  initRecentlyViewed() {
    const productSection = document.querySelector('.product-section');
    const recentlyViewedSection = document.querySelector('.recently-viewed-section');

    const STORAGE_KEY = 'indiasilvo_recently_viewed';
    let viewedList = [];
    try {
      viewedList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      viewedList = [];
    }

    if (productSection) {
      const handle = productSection.closest('main')?.querySelector('[data-current-product-handle]')?.dataset.currentProductHandle;
      const currentHandle = handle || window.location.pathname.split('/products/')[1]?.split('?')[0];

      if (currentHandle) {
        viewedList = viewedList.filter(h => h !== currentHandle);
        viewedList.unshift(currentHandle);
        if (viewedList.length > 8) viewedList = viewedList.slice(0, 8);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedList));
        } catch (e) {}
      }
    }

    if (recentlyViewedSection) {
      const currentHandle = recentlyViewedSection.dataset.currentProductHandle;
      const displayHandles = viewedList.filter(h => h !== currentHandle).slice(0, 4);
      const grid = recentlyViewedSection.querySelector('.product-grid');

      if (displayHandles.length === 0 || !grid) {
        recentlyViewedSection.classList.add('is-hidden');
        return;
      }

      recentlyViewedSection.classList.remove('is-hidden');

      const fetchCardPromises = displayHandles.map(handle => {
        return fetch(`/products/${handle}?section_id=product-recommendations`)
          .then(res => res.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const card = doc.querySelector('.product-card');
            return card ? card.outerHTML : '';
          })
          .catch(() => '');
      });

      Promise.all(fetchCardPromises).then(cardsHtml => {
        const validCards = cardsHtml.filter(Boolean).join('');
        if (validCards) {
          grid.innerHTML = validCards;
          recentlyViewedSection.classList.remove('is-hidden');
        } else {
          recentlyViewedSection.classList.add('is-hidden');
        }
      });
    }
  }

  // 8. Product Recommendations Lazy Loading
  initProductRecommendations() {
    const section = document.querySelector('.product-recommendations-section');
    if (!section) return;

    const url = section.dataset.url;
    if (!url) return;

    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const recommendationsSection = doc.querySelector('.product-recommendations-section');
        if (recommendationsSection && recommendationsSection.innerHTML.trim().length > 0) {
          section.innerHTML = recommendationsSection.innerHTML;
        }
      })
      .catch(err => console.error('Recommendations loading error:', err));
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.IndiasilvoApp = new IndiasilvoTheme();
});
