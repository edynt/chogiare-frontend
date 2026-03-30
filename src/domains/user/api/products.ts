import { apiClient } from '@shared/api/axios'
import type {
  Product,
  Category,
  SearchFilters,
  PaginatedResponse,
  ApiResponse,
  ProductStatus,
} from '@/types'
import {
  transformProduct,
  transformPaginatedProducts,
  transformProducts,
} from '@shared/utils/transform-product'

export interface BoostPackage {
  id: number
  name: string
  displayName: string
  description: string | null
  durationDays: number
  price: number
  features: string[]
  viewBoost?: number
}

export interface BoostProductResponse {
  boost: {
    id: number
    productId: number
    packageId: number
    pricePaid: number
    durationDays: number
    startAt: string
    endAt: string
  }
  balance: {
    current: number
  }
}

export interface PriceHistoryItem {
  id: number
  oldPrice: number
  newPrice: number
  createdAt: string
}

export interface PriceHistoryResponse {
  productId: number
  currentPrice: number
  history: PriceHistoryItem[]
}

export interface BoostStatus {
  isPromoted: boolean
  boost: {
    id: number
    packageName: string
    startAt: string
    endAt: string
    remainingDays: number
  } | null
}

export const productsApi = {
  // Product CRUD operations
  getProducts: async (
    filters: SearchFilters = {}
  ): Promise<PaginatedResponse<Product>> => {
    const params: Record<string, unknown> = {}

    if (filters.cursor !== undefined) params.cursor = filters.cursor
    if (filters.page !== undefined) params.page = filters.page
    if (filters.pageSize !== undefined) params.pageSize = filters.pageSize
    else if (filters.limit !== undefined) params.pageSize = filters.limit

    if (filters.categoryId !== undefined) params.categoryId = filters.categoryId
    if (filters.sellerId !== undefined) params.sellerId = filters.sellerId
    if (filters.status !== undefined) params.status = filters.status
    if (filters.search !== undefined) params.search = filters.search
    if (filters.query !== undefined) params.search = filters.query
    if (filters.featured !== undefined) params.isFeatured = filters.featured
    if (filters.promoted !== undefined) params.isPromoted = filters.promoted
    if (filters.minPrice !== undefined && filters.minPrice > 0)
      params.minPrice = filters.minPrice
    if (filters.maxPrice !== undefined && filters.maxPrice < 10000000)
      params.maxPrice = filters.maxPrice
    if (filters.condition !== undefined) params.condition = filters.condition
    if (filters.location !== undefined && filters.location !== '')
      params.location = filters.location
    if (filters.sortBy !== undefined) params.sortBy = filters.sortBy
    if (filters.sortOrder !== undefined) params.sortOrder = filters.sortOrder
    if (filters.rating !== undefined && filters.rating > 0)
      params.rating = filters.rating

    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products', { params })
    return transformPaginatedProducts(response.data.data)
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    )
    return transformProduct(response.data.data)
  },

  createProduct: async (data: {
    title: string
    description?: string
    categoryId: number
    price: number
    originalPrice?: number
    condition: string
    location?: string
    stock: number
    tags?: string[]
    badges?: string[]
    minStock?: number
    maxStock?: number
    costPrice?: number
    sellingPrice?: number
    sku?: string
    sellerId?: number
  }): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      '/products',
      data
    )
    return transformProduct(response.data.data)
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}`,
      data
    )
    return transformProduct(response.data.data)
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },

  // Product search and filtering
  searchProducts: async (
    query: string,
    filters: Omit<SearchFilters, 'query'> = {}
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products/search', { params: { query, ...filters } })
    return transformPaginatedProducts(response.data.data)
  },

  getProductsByCategory: async (
    categoryId: string,
    filters: Omit<SearchFilters, 'categoryId'> = {}
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >(`/categories/${categoryId}/products`, { params: filters })
    return transformPaginatedProducts(response.data.data)
  },

  getProductsBySeller: async (
    sellerId: string,
    filters: Omit<SearchFilters, 'sellerId'> = {}
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >(`/seller/${sellerId}/products`, { params: filters })
    return transformPaginatedProducts(response.data.data)
  },

  // Featured products
  getFeaturedProducts: async (limit = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products/featured',
      {
        params: { limit },
      }
    )
    return transformProducts(response.data.data)
  },

  // My products (seller's products)
  getMyProducts: async (
    filters: Omit<SearchFilters, 'sellerId'> = {}
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/seller/products', { params: filters })
    return transformPaginatedProducts(response.data.data)
  },

  // Bulk operations
  bulkUpdateProducts: async (
    updates: Array<{ id: string; data: Partial<Product> }>
  ): Promise<Product[]> => {
    const response = await apiClient.patch<ApiResponse<Product[]>>(
      '/products/bulk',
      { updates }
    )
    return transformProducts(response.data.data)
  },

  // Product management
  updateProductStatus: async (
    id: string,
    status: ProductStatus
  ): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}/status`,
      {},
      { params: { status } }
    )
    return transformProduct(response.data.data)
  },

  updateProductStock: async (id: string, stock: number): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}/stock`,
      {},
      { params: { stock } }
    )
    return transformProduct(response.data.data)
  },

  // Analytics
  getProductStats: async (
    id: string
  ): Promise<{ views: number; sales: number; rating: number }> => {
    const response = await apiClient.get<
      ApiResponse<{ views: number; sales: number; rating: number }>
    >(`/products/${id}/stats`)
    return response.data.data
  },

  incrementProductViews: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/views`)
  },

  // Boost packages and product boost
  getBoostPackages: async (): Promise<BoostPackage[]> => {
    const response = await apiClient.get<ApiResponse<BoostPackage[]>>(
      '/products/boost-packages'
    )
    return response.data.data
  },

  boostProduct: async (
    productId: string,
    packageId: number
  ): Promise<BoostProductResponse> => {
    const response = await apiClient.post<ApiResponse<BoostProductResponse>>(
      `/products/${productId}/boost`,
      { packageId }
    )
    return response.data.data
  },

  getBoostStatus: async (productId: string): Promise<BoostStatus> => {
    const response = await apiClient.get<ApiResponse<BoostStatus>>(
      `/products/${productId}/boost-status`
    )
    return response.data.data
  },

  getPriceHistory: async (
    productId: string,
    days = 90
  ): Promise<PriceHistoryResponse> => {
    const response = await apiClient.get<ApiResponse<PriceHistoryResponse>>(
      `/products/${productId}/price-history`,
      { params: { days } }
    )
    return response.data.data
  },
}

export const categoriesApi = {
  // Category CRUD operations
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<
      ApiResponse<Category[] | { items: Category[]; total: number }>
    >('/categories', { params: { pageSize: 200 } })
    const data = response.data.data
    if (Array.isArray(data)) {
      return data
    }
    if (data && typeof data === 'object' && 'items' in data) {
      return (data as { items: Category[] }).items
    }
    return []
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${id}`
    )
    return response.data.data
  },

  createCategory: async (
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      '/categories',
      data
    )
    return response.data.data
  },

  updateCategory: async (
    id: string,
    data: Partial<Category>
  ): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    )
    return response.data.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },

  // Category hierarchy
  getSubCategories: async (parentId: string): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      `/categories/${parentId}/subcategories`
    )
    return response.data.data
  },

  getCategoryStats: async (
    id: string
  ): Promise<{ productCount: number; subcategoryCount: number }> => {
    const response = await apiClient.get<
      ApiResponse<{ productCount: number; subcategoryCount: number }>
    >(`/categories/${id}/stats`)
    return response.data.data
  },
}

// Add getCategories to productsApi for backward compatibility
export const getCategories = categoriesApi.getCategories
