# صيدلية نهاد عبدالرحمن — Pharmacy E-Commerce Website

Static pharmacy e-commerce website built with vanilla HTML, CSS, and JavaScript. No build tools, no backend dependencies, no frameworks — pure frontend.

## Features

- **Product Catalog** — Browse pharmacy and cosmetic products organized by category
- **Shopping Cart** — Add/remove items, persistent via localStorage
- **Product Details** — View detailed information about each product with scent notes and benefits
- **Wishlist** — Save favorite products for later
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Newsletter Signup** — Static form for mailing list
- **Order Form** — Checkout process with customer information collection

## Files

Core files:

- `index.html` — Home page with hero section and featured products
- `shop.html` — Full product catalog with search and filtering
- `product.html` — Individual product detail pages
- `cart.html` — Shopping cart with checkout
- `wishlist.html` — Saved favorite products
- `about.html`, `contact.html` — Static info pages
- `css/styles.css` — All styling, responsive design, color palette
- `js/` — Modular JavaScript for cart, products, wishlist management

## How to Use

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. Browse products on the shop page
3. Add items to cart or wishlist
4. Proceed to checkout to enter shipping information

## Data Storage

All cart and wishlist data is saved to browser's localStorage:

- `elegance_cart_v1` — Shopping cart items
- `wishlist_items` — Saved products

Clear browser cache/localStorage to reset all data.

## Customization

**Update Product Catalog:**
Edit `js/products.js` — the `PRODUCTS` object contains all product data including name, price, description, and category.

**Change Colors & Design:**
Modify CSS custom properties in `css/styles.css` (`:root` section):

```css
--accent: #ee7213;        /* Primary accent color */
--text: #2C2C2C;          /* Text color */
--bg: #ffffff;            /* Background */
```

**Add Real Product Images:**
Replace `assets/bottle.svg` with actual pharmacy product photos in `assets/` folder, then update image paths in product cards.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
