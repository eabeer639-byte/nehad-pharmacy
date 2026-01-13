/**
 * Product Details Page Handler
 * Loads and renders individual product details from API
 */

document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const root = AppUtils.DOM.query('#product-root');
  if (!root) {
    console.warn('Product root element not found');
    return;
  }

  // Get product ID from URL params
  const productId = AppUtils.Navigation.getParam('id') || 'skincare-moisturizer';

  let product;
  try {
    product = await ProductManager.getById(productId);
  } catch (err) {
    console.error('Error loading product:', err);
  }

  if (!product) {
    AppUtils.DOM.setHTML(root, '<div style="padding:40px;text-align:center"><p>المنتج غير متوفر.</p><p style="margin-top:14px"><a class="btn btn--ghost" href="shop.html">العودة للمتجر</a></p></div>');
    return;
  }

  // Scroll to top on page load
  AppUtils.Navigation.scrollToTop();

  // Build volume buttons
  const volumeButtons = (product.volumes || []).map(vol => {
    const isDefault = vol === product.defaultVolume ? 'aria-pressed="true"' : '';
    return `<button class="size-option" ${isDefault}>${AppUtils.HTML.escape(vol)}</button>`;
  }).join('');

  // Build scent notes list
  const notes = product.notes || {};

  const notesList = [
    notes.top?.length ? `<li>${notes.top.map(n => AppUtils.HTML.escape(n)).join(', ')}</li>` : '',
    notes.heart?.length ? `<li>${notes.heart.map(n => AppUtils.HTML.escape(n)).join(', ')}</li>` : '',
    notes.base?.length ? `<li>${notes.base.map(n => AppUtils.HTML.escape(n)).join(', ')}</li>` : ''
  ].filter(Boolean).join('');

  // Get product details with category-aware content
  let details = {
    benefits: [],
    howToUse: 'اتبع التعليمات على العبوة للاستخدام الأمثل.',
    suitableFor: 'مناسب لجميع الاستخدامات',
    brandInfo: 'منتج من صيدلية NEHAD ABDELRAMAN'
  };

  try {
    if (ProductManager && ProductManager.getDetails) {
      const fetchedDetails = ProductManager.getDetails(product);
      if (fetchedDetails && typeof fetchedDetails === 'object') {
        details = { ...details, ...fetchedDetails };
      }
    }
  } catch (e) {
    console.warn('Error loading product details:', e);
    // Use defaults already set above
  }

  // Render product page
  AppUtils.DOM.setHTML(root, `
    <div class="product-grid">
      <div class="product-visual">
        <div class="pedestal">
          <img src="${AppUtils.HTML.escape(product.image || 'assets/bottle.svg')}" alt="${AppUtils.HTML.escape(product.name)} زجاجة دواء" loading="lazy">
        </div>
      </div>

      <div class="product-info">
        <div class="product-info-header">
          <div>
            <p class="eyebrow">صيدلية NEHAD</p>
            <h1>${AppUtils.HTML.escape(product.name)}</h1>
          </div>
          <button class="wishlist-btn wishlist-btn--large" type="button" data-id="${product.id}" data-name="${product.name}" aria-label="إضافة للمفضلة" aria-pressed="false">
            <span aria-hidden="true">♡</span>
          </button>
        </div>
        <p class="lead">${AppUtils.HTML.escape(product.tagline || '')}</p>

        <div class="rating-section">
          <div class="rating-stars">
            <span class="stars">${'⭐'.repeat(Math.floor(product.rating || 0))}${(product.rating || 0) % 1 >= 0.5 ? '½' : ''}</span>
            <span class="rating-value">${(product.rating || 0).toFixed(1)}</span>
            <span class="review-count">(${product.reviewCount || 0} تقييم)</span>
          </div>
        </div>

        <div class="product-pricing">
          ${DiscountUtils.getPriceHTML(product)}
          <span class="volume">/ ${AppUtils.HTML.escape(product.defaultVolume || '')}</span>
          ${DiscountUtils.getDiscountBadgeHTML(product)}
        </div>

        <div class="stock-info">
          <span class="stock-label">المتوفر:</span>
          <span class="stock-value ${(product.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}">
            ${(product.stock || 0) > 0 ? `${product.stock} وحدة` : 'غير متوفر'}
          </span>
        </div>

        <div class="size">
          <div class="size-options" aria-hidden="true">
            ${volumeButtons}
          </div>
        </div>

        <div class="quantity-selector">
          <label for="product-qty">الكمية:</label>
          <div class="qty-control-product">
            <button class="qty-btn-product" id="qty-dec" type="button" aria-label="تقليل الكمية">−</button>
            <span id="product-qty">1</span>
            <button class="qty-btn-product" id="qty-inc" type="button" aria-label="زيادة الكمية">+</button>
          </div>
        </div>

        <p class="desc">${AppUtils.HTML.escape(product.description || '')}</p>

        <ul class="notes" aria-hidden="true">
          ${notesList}
        </ul>

        <div class="product-ctas">
          <button class="btn btn--primary add-to-cart" type="button" id="add-to-cart-btn"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${DiscountUtils.getEffectivePrice(product)}"
            data-volume="${AppUtils.HTML.escape(product.defaultVolume || '')}"
            ${(product.stock || 0) <= 0 ? 'disabled' : ''}>
            ${(product.stock || 0) > 0 ? 'أضف للسلة' : 'غير متوفر'}
          </button>
          <a class="btn btn--ghost" href="shop.html">العودة للتسوق</a>
        </div>
      </div>
    </div>

    <div class="product-details-sections">
      <section class="details-section">
        <h2>المزايا الرئيسية</h2>
        <ul class="benefits-list">
          ${(details.benefits || []).map(benefit => `<li>${AppUtils.HTML.escape(benefit || '')}</li>`).join('')}
        </ul>
      </section>

      <section class="details-section">
        <h2>كيفية الاستخدام</h2>
        <p>${AppUtils.HTML.escape(details.howToUse || 'اتبع التعليمات على العبوة للاستخدام الأمثل.')}</p>
      </section>

      <section class="details-section">
        <h2>مناسب لـ</h2>
        <p>${AppUtils.HTML.escape(details.suitableFor || 'مناسب لجميع الاستخدامات')}</p>
      </section>

      <section class="details-section">
        <h2>معلومات العلامة التجارية</h2>
        <div class="brand-info">
          <p><strong>الاسم:</strong> ${AppUtils.HTML.escape(details.brandInfo || '')}</p>
          <p><strong>الفئة:</strong> ${AppUtils.HTML.escape(product.category || '')}</p>
          <p><strong>التكوين:</strong> مكونات طبيعية 100%</p>
          <p><strong>الموقع:</strong> <a href="contact.html">اتصل بنا</a></p>
        </div>
      </section>
    </div>
  `);

  // Update page title
  document.title = `${product.name} — صيدلية NEHAD ABDELRAMAN`;

  // Wire up size option clicks to update volume display
  document.addEventListener('click', function (ev) {
    const sizeBtn = ev.target.closest('.size-option');
    if (!sizeBtn) return;

    const container = sizeBtn.closest('.size-options');
    if (!container) return;

    // Update pressed state
    AppUtils.DOM.queryAll('.size-option').forEach(btn => btn.removeAttribute('aria-pressed'));
    sizeBtn.setAttribute('aria-pressed', 'true');

    // Update volume display
    const volumeSpan = AppUtils.DOM.query('.product-info .volume');
    if (volumeSpan) {
      AppUtils.DOM.setText(volumeSpan, `/ ${sizeBtn.textContent.trim()}`);
    }

    // Update Add to Cart button data
    const addBtn = AppUtils.DOM.query('.add-to-cart');
    if (addBtn) {
      addBtn.dataset.volume = sizeBtn.textContent.trim();
    }
  });

  // ===== Quantity Selector Handlers =====
  let currentQty = 1;
  const maxQty = product.stock || 1;
  
  document.addEventListener('click', function (ev) {
    const qtyDisplay = AppUtils.DOM.query('#product-qty');
    
    // Decrement button
    if (ev.target.closest('#qty-dec')) {
      ev.preventDefault();
      if (currentQty > 1) {
        currentQty--;
        if (qtyDisplay) AppUtils.DOM.setText(qtyDisplay, String(currentQty));
      }
    }
    
    // Increment button
    if (ev.target.closest('#qty-inc')) {
      ev.preventDefault();
      if (currentQty < maxQty) {
        currentQty++;
        if (qtyDisplay) AppUtils.DOM.setText(qtyDisplay, String(currentQty));
      }
    }
    
    // Update cart button with quantity
    if (ev.target.closest('.add-to-cart')) {
      const addBtn = ev.target.closest('.add-to-cart');
      if (addBtn) {
        addBtn.dataset.qty = currentQty;
      }
    }
  });
});

