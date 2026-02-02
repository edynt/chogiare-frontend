# Migration Guide: Store to Seller

## Overview

The Store model has been removed from the backend. Seller information is now part of the User model with fields like:

- `isSeller`, `sellerName`, `sellerSlug`, `sellerDescription`
- `sellerLogo`, `sellerBanner`, `sellerRating`
- etc.

## API Changes

### Endpoints

- **OLD**: `/stores/*`
- **NEW**: `/seller/*`

### Files Updated

#### 1. New Files Created

- `/src/hooks/useSeller.ts` - New seller hooks replacing store hooks
- This migration guide

#### 2. Files Marked as Deprecated

- `/src/hooks/useStores.ts` - Added deprecation notice
- `/src/domains/user/api/stores.ts` - Added deprecation notice
- `/src/api/index.ts` - Added deprecation comments for store exports

#### 3. Files Updated

- `/src/hooks/index.ts` - Added new seller hook exports
- `/src/domains/user/components/seller/seller/SellerDashboardContent.tsx` - Updated to use new hooks

## Hook Migration Map

| Old Hook (useStores.ts) | New Hook (useSeller.ts)     | Notes                               |
| ----------------------- | --------------------------- | ----------------------------------- |
| `useStores()`           | `useSellerProducts()`       | For listing products                |
| `useStore(id)`          | `useSellerProduct(id)`      | For single product                  |
| `useUserStore()`        | `useAuth().user`            | Seller info now in user object      |
| `useCreateStore()`      | N/A                         | Store creation removed              |
| `useUpdateStore()`      | N/A                         | Update seller info via user profile |
| `useDeleteStore()`      | N/A                         | Store deletion removed              |
| `useStoreStats()`       | `useSellerDashboardStats()` | Dashboard statistics                |
| `useUserStoreStats()`   | `useSellerDashboardStats()` | Same as above                       |
| `useStoreStatsById()`   | `useSellerDashboardStats()` | Same as above                       |
| `useDashboardStats()`   | `useSellerDashboardStats()` | Dashboard statistics                |
| `useLowStockProducts()` | `useLowStockProducts()`     | Same name, different location       |
| `usePromotedProducts()` | `usePromotedProducts()`     | Still in useStores (temporary)      |

## New Seller Hooks Available

### Dashboard & Stats

- `useSellerDashboardStats()` - Get seller dashboard statistics

### Product Management

- `useSellerProducts(filters)` - List seller's products
- `useSellerProduct(id)` - Get single product details
- `useCreateProduct()` - Create product (JSON)
- `useCreateProductWithImages()` - Create product with file uploads
- `useUpdateProduct()` - Update product
- `useDeleteProduct()` - Delete product
- `useBulkUpdateProducts()` - Bulk update products

### Stock Management

- `useUpdateStock()` - Update product stock
- `useLowStockProducts(threshold)` - Get low stock products

### Order Management

- `useSellerOrders(params)` - List seller's orders
- `useSellerOrder(id)` - Get order details
- `useUpdateOrderStatus()` - Update order status

### Revenue & Analytics

- `useRevenueStats(params)` - Get revenue statistics

### Notifications

- `useSellerNotifications(params)` - Get seller notifications
- `useMarkNotificationAsRead()` - Mark notification as read
- `useMarkAllNotificationsAsRead()` - Mark all as read

## Migration Steps

### Step 1: Update Imports

```typescript
// OLD
import { useStores, useUserStore, useDashboardStats } from '@/hooks/useStores'

// NEW
import { useSellerProducts, useSellerDashboardStats } from '@/hooks/useSeller'
import { useAuth } from '@/hooks/useAuth'
```

### Step 2: Update Hook Usage

```typescript
// OLD
const { data: userStore } = useUserStore()
const { data: stats } = useDashboardStats()

// NEW
const { user } = useAuth() // user.sellerName, user.sellerLogo, etc.
const { data: stats } = useSellerDashboardStats()
```

### Step 3: Update Data Access

```typescript
// OLD
const storeName = userStore?.name
const storeLogo = userStore?.logo

// NEW
const storeName = user?.sellerName
const storeLogo = user?.sellerLogo
```

## TypeScript Types

### Old Store Interface (Deprecated)

```typescript
interface Store {
  id: string
  userId: number
  name: string
  logo?: string
  // ... other fields
}
```

### New User Interface (with Seller fields)

```typescript
interface User {
  id: number
  email: string
  role: string
  isSeller: boolean
  sellerName?: string
  sellerSlug?: string
  sellerDescription?: string
  sellerLogo?: string
  sellerBanner?: string
  sellerRating?: number
  // ... other fields
}
```

## Backend Endpoint Changes

### Dashboard Stats

- **OLD**: `GET /stores/dashboard/stats`
- **NEW**: `GET /seller/dashboard/stats`

### Products

- **OLD**: `GET /stores/my` then `GET /products?storeId=...`
- **NEW**: `GET /seller/products`

### Orders

- **OLD**: `GET /stores/my` then `GET /orders?storeId=...`
- **NEW**: `GET /seller/orders`

## Remaining Work

### Files Still Using Deprecated Hooks

Search for these patterns in your codebase:

- `from '@/hooks/useStores'`
- `from '@user/api/stores'`
- `useUserStore`
- `useDashboardStats` (from useStores)
- `useStoreStats`

### Components to Update

Run this command to find files that need updating:

```bash
grep -r "useStore[s]?\|useUserStore\|useDashboardStats" src/ --include="*.tsx" --include="*.ts"
```

## FAQ

### Q: What about store creation/deletion?

**A:** These features are removed. Users become sellers by setting `isSeller: true` in their profile.

### Q: Where do I update seller information now?

**A:** Update the user profile. Seller fields are now part of the User model.

### Q: Are store IDs still used?

**A:** No. Use `userId` instead. Products, orders, etc. now reference `sellerId` which is the user's ID.

### Q: What about store verification?

**A:** Use user verification status. The `isSeller` field indicates if a user is a seller.

### Q: Can I still use the old hooks temporarily?

**A:** Yes, but they're deprecated and may be removed in future versions. Migrate as soon as possible.

## Support

If you encounter issues during migration:

1. Check the deprecation notices in the code
2. Refer to the new seller API documentation
3. Look at `SellerDashboardContent.tsx` for a working example
4. Check the backend API endpoints in the seller controller
