# Admin CRUD Testing Guide

## Quick Start

1. Start backend:
```bash
cd "c:\Users\ahmed\Downloads\perfume website\backend"
npm install  # if needed
node index.js
```

2. Open admin dashboard:
```
http://localhost:3000/admin
```

## Test Scenarios

### Test 1: Create Product
1. Navigate to "إدارة المنتجات" (Products)
2. Click "+ إضافة منتج جديد" (Add New Product)
3. Fill in fields:
   - معرف: `test-product-001`
   - الاسم: `منتج اختبار`
   - السعر: `100`
   - الفئة: `test`
   - الوصف: `وصف الاختبار`
4. Click "حفظ" (Save)
5. Should see: "تم الحفظ بنجاح" (Success)
6. Product appears in table
7. Verify in backend/data/products.json file

**Expected Result:** ✅ Product saved to JSON

### Test 2: Edit Product
1. Click "تعديل" (Edit) on a product
2. Modal opens with existing data
3. Change name to: `منتج معدل`
4. Click "حفظ"
5. Table updates immediately
6. Check products.json - name should be updated

**Expected Result:** ✅ Product updated in JSON

### Test 3: Upload Product Image
1. Click "+ إضافة منتج جديد"
2. Fill basic fields (name, price required)
3. In "صورة المنتج" section, click file input
4. Select an image from your computer
5. Preview appears
6. Click "حفظ"
7. Check products.json - should have `image` field with URL

**Expected Result:** ✅ Image uploaded to /uploads, URL saved in JSON

### Test 4: Edit Product Image
1. Edit existing product
2. Existing image shows in preview
3. Click file input to change image
4. Select new image
5. Preview updates to new image
6. Click "حفظ"
7. Check products.json - image URL updated

**Expected Result:** ✅ New image uploaded, URL updated in JSON

### Test 5: Delete Product
1. Click "حذف" (Delete) button on any product
2. **Custom modal appears** (NOT browser confirm dialog)
3. Modal shows:
   - Title: "تأكيد الحذف"
   - Message: "هل أنت متأكد من حذف هذا المنتج؟"
   - Red "حذف" button
   - Gray "إلغاء" button
4. Click "حذف" button
5. Modal closes
6. "تم حذف المنتج بنجاح" toast appears
7. Product removed from table
8. Verify in backend/data/products.json - product gone

**Expected Result:** ✅ Custom modal (no alert), product deleted from JSON

### Test 6: Delete Product - Cancel
1. Click "حذف" on a product
2. Modal appears
3. Click "إلغاء" (Cancel) button
4. Modal closes
5. Product still in table

**Expected Result:** ✅ Nothing deleted, product still exists

### Test 7: Create Category
1. Navigate to "إدارة الفئات" (Categories)
2. Click "+ إضافة فئة جديدة"
3. Fill in:
   - معرف: `test-cat-001`
   - الاسم: `فئة اختبار`
   - الوصف: `وصف الفئة`
4. Click "حفظ"
5. Category appears in table
6. Check categories.json

**Expected Result:** ✅ Category saved to JSON

### Test 8: Edit Category
1. Click "تعديل" on any category
2. Modal opens with existing data
3. Change name: `فئة معدلة`
4. Click "حفظ"
5. Table updates
6. Check categories.json

**Expected Result:** ✅ Category updated in JSON

### Test 9: Delete Category
1. Click "حذف" on any category
2. Custom modal appears
3. Click "حذف"
4. Category removed
5. Check categories.json

**Expected Result:** ✅ Custom modal, category deleted from JSON

### Test 10: Verify Frontend Sync
1. Create/edit/delete products in admin
2. Go to http://localhost:3000/shop
3. Products should be current (new ones visible, deleted ones gone)
4. Refresh shop page if needed

**Expected Result:** ✅ Frontend shows updated products

## Verification Checklist

### No Dialogs
- [ ] No `alert()` dialogs appear anywhere
- [ ] No `confirm()` dialogs appear
- [ ] Only custom styled modals appear

### Delete Confirmations
- [ ] Delete shows custom modal (not browser dialog)
- [ ] Modal is centered, styled nicely
- [ ] Arabic text displays correctly
- [ ] Cancel button works
- [ ] Delete button works
- [ ] Click outside modal closes it

### Form Handling
- [ ] Product form has price, discount, stock, image fields
- [ ] Category form has only name and description fields
- [ ] No mixing of product fields in category form
- [ ] Edit loads existing data
- [ ] Image preview works for new uploads
- [ ] Image preview shows existing image when editing
- [ ] Submit works for both create and edit

### Data Integrity
- [ ] Product created: appears in table + JSON
- [ ] Product edited: changes saved to JSON
- [ ] Product deleted: removed from JSON
- [ ] Category created: appears in table + JSON
- [ ] Category edited: changes saved to JSON
- [ ] Category deleted: removed from JSON

### Error Handling
- [ ] Required field validation (price for products)
- [ ] Error messages display if API fails
- [ ] Success toasts appear on success
- [ ] No unhandled errors in console

## Browser Console Debugging

Check for errors:
```javascript
// Open console (F12)
// Try operations and check for errors
console.log('Admin app ready:', app)
console.log('Current section:', app.currentSection)
```

## File Locations for Verification

- **Products Data:** `backend/data/products.json`
- **Categories Data:** `backend/data/categories.json`
- **Admin Script:** `admin/app.js`
- **Uploaded Images:** `uploads/` folder

## Expected Behavior Timeline

1. **User clicks Delete:**
   - Modal appears (100ms)
   - User sees confirmation text
   
2. **User clicks Cancel:**
   - Modal closes (no action)
   
3. **User clicks Delete (Confirm):**
   - Modal closes
   - API DELETE request sent
   - Loading state (implicit in toast)
   - Success toast appears
   - Table reloads
   - Data removed from JSON file

## Known Working Features

✅ Product CRUD (Create, Read, Update, Delete)
✅ Category CRUD (Create, Read, Update, Delete)
✅ Image upload and storage
✅ Image preview on edit
✅ Form validation
✅ Error handling with messages
✅ Toast notifications
✅ Custom delete confirmation modal
✅ No alert() or confirm() usage
✅ Arabic text support
✅ RTL layout

