/**
 * Shop Page Handler Module
 * Product listing, filtering, sorting, and pagination
 */

document.addEventListener('DOMContentLoaded', async function () {
  'use strict';

  const searchInput = AppUtils.DOM.query('#search-input');
  const sortSelect = AppUtils.DOM.query('#sort-select');
  const categoryFilter = AppUtils.DOM.query('#category-filter');
  const productsGrid = AppUtils.DOM.query('#products-grid');
  const paginationEl = AppUtils.DOM.query('#pagination');
  const emptyState = AppUtils.DOM.query('#empty-state');
  const resetBtn = AppUtils.DOM.query('#reset-filters');

  if (!searchInput || !productsGrid) return;

  let allProducts = [];
  let selectedCategory = null;
  const PRODUCTS_PER_PAGE = 12;
  let currentPage = 1;
  let filteredProducts = [];
  let allCategories = [];

  // Load categories from API and render filter buttons
  async function loadCategories() {
    try {
      const response = await fetch('http://localhost:3000/api/categories');
      if (!response.ok) throw new Error('فشل تحميل الفئات');
      allCategories = await response.json();

      if (!categoryFilter || !allCategories.length) return;

      // Check if mobile screen (max-width: 520px)
      const isMobile = window.innerWidth <= 520;
      let html = '';

      if (isMobile) {
        // Render as dropdown select on mobile
        html = `<select id="category-select" class="category-select" aria-label="اختر الفئة">
          <option value="">جميع الفئات</option>
          ${allCategories.map(cat => `
            <option value="${AppUtils.HTML.escape(cat.name)}">
              ${AppUtils.HTML.escape(cat.name)}
            </option>
          `).join('')}
        </select>`;
      } else {
        // Render as buttons on desktop/tablet
        const grouped = [];
        for (let i = 0; i < allCategories.length; i += 3) {
          grouped.push(allCategories.slice(i, i + 3));
        }

        html = grouped.map(group => `
          <div class="category-group">
            ${group.map(cat => `
              <button class="category-btn" data-category="${AppUtils.HTML.escape(cat.name)}">
                ${AppUtils.HTML.escape(cat.name)}
              </button>
            `).join('')}
          </div>
        `).join('');
      }

      AppUtils.DOM.setHTML(categoryFilter, html);
      
      // Attach event listeners based on view type
      if (isMobile) {
        const select = categoryFilter.querySelector('#category-select');
        if (select) {
          select.addEventListener('change', function () {
            selectedCategory = this.value || null;
            filterAndSort();
          });
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  // Load products from API
  async function loadProducts() {
    try {
      const products = await ProductManager.getAll(true); // Force fresh API call
      allProducts = products || [];
      if (allProducts.length === 0) {
        AppUtils.DOM.setHTML(productsGrid, '<div style="padding:40px;text-align:center;grid-column:1/-1"><p>عذراً، حدث خطأ في تحميل المنتجات.</p></div>');
        return;
      }
      filterAndSort();
    } catch (err) {
      console.error('Error loading products:', err);
      AppUtils.DOM.setHTML(productsGrid, '<div style="padding:40px;text-align:center;grid-column:1/-1"><p>عذراً، فشل تحميل المنتجات.</p></div>');
    }
  }

  /**
   * Render product grid with pagination
   */
  function renderProducts(products, page = 1) {
    filteredProducts = products;
    currentPage = page;

    if (!products.length) {
      AppUtils.DOM.setHTML(productsGrid, '');
      AppUtils.DOM.setStyle(paginationEl, 'display', 'none');
      AppUtils.DOM.setStyle(emptyState, 'display', 'block');
      return;
    }

    AppUtils.DOM.setStyle(emptyState, 'display', 'none');

    const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
    const endIdx = startIdx + PRODUCTS_PER_PAGE;
    const pageProducts = products.slice(startIdx, endIdx);

   const html = pageProducts.map(product => {
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  const defaultVolume = product.defaultVolume || product.volumes?.[0] || '';
  const imgSrc = product.image ? product.image : 'assets/bottle.svg';

  return `
  <article class="product-card">

    <div class="product-image">
      <img 
        src="${AppUtils.HTML.escape(imgSrc)}" 
        alt="${AppUtils.HTML.escape(product.name)}"
        loading="lazy"
      >

      ${discount > 0 ? `<span class="discount-badge">SALE</span>` : ''}
    </div>

    <div class="product-body">
      <h3 class="product-title">${AppUtils.HTML.escape(product.name)}</h3>

      <div class="info-strip">
        <span>${AppUtils.HTML.escape(product.category || '—')}</span>
        <span>${defaultVolume || '—'}</span>
      </div>

      <div class="rating-strip">
        <span class="stars">${'⭐'.repeat(Math.floor(product.rating || 0))}${(product.rating || 0) % 1 >= 0.5 ? '½' : ''}</span>
        <span class="rating-value">${(product.rating || 0).toFixed(1)}</span>
        <span class="review-count">(${product.reviewCount || 0})</span>
      </div>

      <div class="card-actions">

        <div class="action-top">
          <div class="price-section">
            ${discount > 0 ? `
              <span class="price-original">${price} جنيه</span>
              <span class="price-current">${finalPrice} جنيه</span>
            ` : `
              <span class="price-current">${price} جنيه</span>
            `}
          </div>

          <div class="qty-control">
            <button class="qty-btn" data-action="dec">-</button>
            <span class="qty-value">1</span>
            <button class="qty-btn" data-action="inc">+</button>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            class="btn-cart add-to-cart"
            type="button"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${finalPrice}"
            data-original-price="${price}"
            data-volume="${defaultVolume}"
            data-image="${AppUtils.HTML.escape(imgSrc)}"
          >
                    <img src="image/shopping-cart.svg" color="white" width="24" alt="cart icon">
          </button>

          <a 
            class="btn-outline"
            href="product.html?id=${product.id}"
            aria-label="عرض التفاصيل ${product.name}"
          >
            التفاصيل
          </a>
        </div>

      </div>
    </div>

  </article>
  `;
}).join('');

    AppUtils.DOM.setHTML(productsGrid, html);

    // Attach quantity control handlers
    document.querySelectorAll('.product-card').forEach(card => {
      const qtyValue = card.querySelector('.qty-value');
      const decBtn = card.querySelector('.qty-btn[data-action="dec"]');
      const incBtn = card.querySelector('.qty-btn[data-action="inc"]');
      const addBtn = card.querySelector('.add-to-cart');

      if (decBtn && incBtn && qtyValue && addBtn) {
        decBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let qty = parseInt(qtyValue.textContent) || 1;
          if (qty > 1) {
            qty--;
            qtyValue.textContent = qty;
          }
        });

        incBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let qty = parseInt(qtyValue.textContent) || 1;
          qty++;
          qtyValue.textContent = qty;
        });

        // Update add-to-cart to use selected quantity (add all at once)
        addBtn.addEventListener('click', (e) => {
          const qty = parseInt(qtyValue.textContent) || 1;
          // Store quantity in data attribute
          addBtn.dataset.qty = qty;
        });
      }
    });

    // Render pagination
    renderPagination(products.length);
  }

  /**
   * Render pagination controls
   */
  function renderPagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) {
      AppUtils.DOM.setStyle(paginationEl, 'display', 'none');
      return;
    }

    AppUtils.DOM.setStyle(paginationEl, 'display', 'flex');

    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
      paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}">السابق</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages <= 7) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === 2 || i === totalPages - 1) {
          paginationHTML += `<span style="color:var(--muted);padding:10px 4px;">...</span>`;
        }
      }
    }

    // Next button
    if (currentPage < totalPages) {
      paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}">التالي</button>`;
    }

    AppUtils.DOM.setHTML(paginationEl, paginationHTML);

    // Attach pagination click handlers
    AppUtils.DOM.queryAll('.page-btn', paginationEl).forEach(btn => {
      btn.addEventListener('click', function () {
        const page = parseInt(this.dataset.page);
        renderProducts(filteredProducts, page);
        AppUtils.Navigation.scrollToTop();
      });
    });
  }

  /**
   * Filter and sort products
   */
  function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;

    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.tagline || '').toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply sort
    if (sortValue === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered, 1);
  }
  /**
   * Handle category button clicks (desktop/tablet only)
   */
  if (categoryFilter) {
    document.addEventListener('click', function (ev) {
      const btn = ev.target.closest('.category-btn');
      if (!btn) return;

      AppUtils.DOM.queryAll('.category-btn').forEach(b => AppUtils.DOM.removeClass(b, 'active'));

      if (btn.dataset.category === selectedCategory) {
        selectedCategory = null;
      } else {
        AppUtils.DOM.addClass(btn, 'active');
        selectedCategory = btn.dataset.category || null;
      }

      filterAndSort();
    });
  }

  // Event listeners
  searchInput.addEventListener('input', filterAndSort);
  sortSelect.addEventListener('change', filterAndSort);
  resetBtn.addEventListener('click', function () {
    searchInput.value = '';
    sortSelect.value = '';
    selectedCategory = null;
    AppUtils.DOM.queryAll('.category-btn').forEach(b => AppUtils.DOM.removeClass(b, 'active'));
    filterAndSort();
  });

  // Initial render - load categories and products from API
  loadCategories();
  loadProducts();
});
