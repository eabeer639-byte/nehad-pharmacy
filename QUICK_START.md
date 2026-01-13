# 🚀 Quick Start Guide

## Admin Control Panel Setup

Follow these steps to get your pharmacy admin panel up and running.

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This will install:
- Express.js (web framework)
- CORS (cross-origin requests)
- body-parser (JSON parsing)

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
✅ Data directory initialized
✅ Server running on http://localhost:3000
✅ Admin dashboard: http://localhost:3000/admin
```

### Step 3: Open Admin Dashboard
Visit in your browser:
```
http://localhost:3000/admin
```

### Step 4: Test the System

**Dashboard Section:**
- View overview statistics
- See total products, orders, sales
- Monitor pending orders

**Products Section:**
- View all 16 products loaded from products.json
- Click "إضافة منتج" to add new product
- Click "تعديل" to edit existing product
- Click "حذف" to delete product

**Categories Section:**
- View all 8 categories
- Manage category listings
- Add/edit/delete categories

**Orders Section:**
- Track customer orders
- Update order status
- View order details

**Pages Section:**
- Edit home, about, contact page content
- Update store information

**Settings Section:**
- Configure store name and contact info
- Set business hours
- Customize colors
- Configure currency

### Data Files

All data is stored in JSON files:
- `backend/data/products.json` - All products
- `backend/data/categories.json` - Product categories
- `backend/data/orders.json` - Customer orders
- `backend/data/pages.json` - Website pages content
- `backend/data/settings.json` - Site settings

### API Base URL

All API calls use:
```
http://localhost:3000/api
```

### Example API Calls

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Get site settings:**
```bash
curl http://localhost:3000/api/settings
```

**Create new order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "أحمد محمد",
    "customerEmail": "ahmed@example.com",
    "items": [{"id": "product-1", "name": "منتج", "qty": 2, "price": 100}],
    "total": 200,
    "status": "pending"
  }'
```

### Key Features

✅ **Products Management**
- Add/edit/delete products
- Set prices and discounts
- Assign to categories
- Manage stock levels

✅ **Categories Management**
- Organize products by category
- Create new categories
- Edit category details

✅ **Orders Management**
- Track customer orders
- Update order status
- View order details
- See order history

✅ **Pages Management**
- Edit website page content
- Update store information
- Add promotional content

✅ **Settings Management**
- Configure store details
- Set business hours
- Customize appearance
- Configure currency

### Troubleshooting

**Port 3000 already in use:**
```bash
# Kill process using port 3000 (Windows PowerShell)
Get-Process | Where-Object {$_.Port -eq 3000} | Stop-Process

# Or change port in backend/index.js line 351
```

**Database issues:**
Delete `backend/data/` and restart - it will recreate with sample data

**CORS errors:**
Ensure frontend is making requests to `http://localhost:3000/api`

**Changes not saving:**
Check if `backend/data/` directory exists and has write permissions

### Next Steps

1. ✅ Start the backend server
2. ✅ Open admin dashboard
3. ✅ Test CRUD operations
4. ✅ Update frontend to fetch from APIs
5. ✅ Test live changes reflection

### Frontend Integration

Update your website to fetch products from the API:

**Before:**
```javascript
const products = PRODUCTS; // Hardcoded
```

**After:**
```javascript
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(products => {
    // Use API products
    ProductManager.init(products);
  });
```

### Support

For detailed API documentation, see [backend/README.md](README.md)

For common issues and solutions, check the troubleshooting section above.

---

**Ready to manage your pharmacy? Start the server and visit http://localhost:3000/admin! 🎉**
