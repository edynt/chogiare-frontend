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
  getProducts: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/products',
      { params: filters }
    )
    return response.data.data
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    return response.data.data
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data)
    return response.data.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
    return response.data.data
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`)
    return response.data.data
  },

  getFeaturedProducts: async (limit = 10): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products/featured',
      { params: { limit } }
    )
    return response.data.data
  },

  searchProducts: async (query: string, filters: Omit<SearchFilters, 'query'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/products/search',
      { params: { query, ...filters } }
    )
    return response.data.data
  },

  getProductsByCategory: async (categoryId: string, filters: Omit<SearchFilters, 'categoryId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/categories/${categoryId}/products`,
      { params: filters }
    )
    return response.data.data
  },

  getProductsBySeller: async (sellerId: string, filters: Omit<SearchFilters, 'sellerId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      `/sellers/${sellerId}/products`,
      { params: filters }
    )
    return response.data.data
  },

  // Seller-specific endpoints
  getMyProducts: async (filters: Omit<SearchFilters, 'sellerId'> = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/seller/products',
      { params: filters }
    )
    return response.data.data
  },

  updateProductStatus: async (id: string, status: ProductStatus): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/seller/products/${id}/status`,
      { status }
    )
    return response.data.data
  },

  bulkUpdateProducts: async (ids: string[], updates: Partial<Product>): Promise<Product[]> => {
    const response = await apiClient.patch<ApiResponse<Product[]>>(
      '/seller/products/bulk',
      { ids, updates }
    )
    return response.data.data
  },

  // Analytics
  getProductViews: async (id: string): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ views: number }>>(`/products/${id}/views`)
    return response.data.data.views
  },

  incrementProductViews: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/views`)
  },
}
