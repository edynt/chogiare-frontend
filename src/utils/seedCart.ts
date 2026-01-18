import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types'

/**
 * Seed fake cart data with products from different sellers/stores
 * This function adds sample products to the cart grouped by seller
 */
export function seedFakeCartData(products: Product[]) {
  const { addItem, clearCart } = useCartStore.getState()

  // Clear existing cart first
  clearCart()

  // Filter products that have seller/store info
  const validProducts = products.filter(
    p => p.sellerId && (p.seller || p.store)
  )

  if (validProducts.length === 0) {
    console.warn('⚠️ No products with seller/store info found for seeding cart')
    return
  }

  // Group products by seller
  const productsBySeller = new Map<string, Product[]>()
  validProducts.forEach(product => {
    const sellerId = product.sellerId || 'unknown'
    if (!productsBySeller.has(sellerId)) {
      productsBySeller.set(sellerId, [])
    }
    productsBySeller.get(sellerId)!.push(product)
  })

  // Add 2-3 products from each seller to cart
  let addedCount = 0
  const maxProductsPerSeller = 3
  const maxSellers = 4 // Limit to 4 different sellers

  for (const [sellerId, sellerProducts] of productsBySeller.entries()) {
    if (addedCount >= maxSellers) break

    // Take up to maxProductsPerSeller products from this seller
    const productsToAdd = sellerProducts.slice(0, maxProductsPerSeller)

    productsToAdd.forEach((product, index) => {
      // Add with different quantities
      const quantity = index + 1 // 1, 2, or 3
      addItem(product, quantity)
    })

    addedCount++
  }

  console.log(`✅ Seeded cart with products from ${addedCount} sellers`)
}

/**
 * Initialize cart with fake data if cart is empty
 * This can be called on app startup or when needed
 */
export function initializeFakeCart(products: Product[]) {
  const { items } = useCartStore.getState()

  if (items.length === 0 && products.length > 0) {
    seedFakeCartData(products)
  }
}
