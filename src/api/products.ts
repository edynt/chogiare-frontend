import { apiClient } from './axios'
import type { 
  Product, 
  Category, 
  SearchFilters, 
  PaginatedResponse, 
  ApiResponse,
  ProductStatus 
} from '@/types'

export const productsApi = {
  // Product CRUD operations
  getProducts: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/v1/products',
      { params: filters }
    )
    return response.data.data
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/v1/products/${id}`)
    return response.data.data
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/v1/products', data)
    return response.data.data
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/v1/products/${id}`, data)
    return response.data.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/products/${id}`)
  },

  // Product search and filtering
  searchProducts: async (query: string, filters: Omit<SearchFilters, 'query'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/v1/products/search',
      { params: { query, ...filters } }
    )
    return response.data.data
  },

  getProductsByCategory: async (categoryId: string, filters: Omit<SearchFilters, 'categoryId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/v1/categories/${categoryId}/products`,
      { params: filters }
    )
    return response.data.data
  },

  getProductsByStore: async (storeId: string, filters: Omit<SearchFilters, 'storeId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/v1/stores/${storeId}/products`,
      { params: filters }
    )
    return response.data.data
  },

  // Featured products
  getFeaturedProducts: async (limit = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/v1/products/featured', {
      params: { limit }
    })
    return response.data.data
  },

  // My products (seller's products)
  getMyProducts: async (filters: Omit<SearchFilters, 'sellerId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/v1/products/my',
      { params: filters }
    )
    return response.data.data
  },

  // Bulk operations
  bulkUpdateProducts: async (updates: Array<{ id: string; data: Partial<Product> }>): Promise<Product[]> => {
    const response = await apiClient.patch<ApiResponse<Product[]>>('/v1/products/bulk', { updates })
    return response.data.data
  },

  // Product management
  updateProductStatus: async (id: string, status: ProductStatus): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/v1/products/${id}/status`,
      { status }
    )
    return response.data.data
  },

  updateProductStock: async (id: string, stock: number): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/v1/products/${id}/stock`,
      { stock }
    )
    return response.data.data
  },

  // Analytics
  getProductStats: async (id: string): Promise<{ views: number; sales: number; rating: number }> => {
    const response = await apiClient.get<ApiResponse<{ views: number; sales: number; rating: number }>>(`/v1/products/${id}/stats`)
    return response.data.data
  },

  incrementProductViews: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/products/${id}/views`)
  },
}

export const categoriesApi = {
  // Category CRUD operations
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/v1/categories')
    return response.data.data
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/v1/categories/${id}`)
    return response.data.data
  },

  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/v1/categories', data)
    return response.data.data
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/v1/categories/${id}`, data)
    return response.data.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/categories/${id}`)
  },

  // Category hierarchy
  getSubCategories: async (parentId: string): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`/v1/categories/${parentId}/subcategories`)
    return response.data.data
  },

  getCategoryStats: async (id: string): Promise<{ productCount: number; subcategoryCount: number }> => {
    const response = await apiClient.get<ApiResponse<{ productCount: number; subcategoryCount: number }>>(`/v1/categories/${id}/stats`)
    return response.data.data
  },
}

// Add getCategories to productsApi for backward compatibility
productsApi.getCategories = categoriesApi.getCategories
