import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi, getCategories } from '@/api/products'
import { useProductStore } from '@/stores/productStore'
import type { Product, SearchFilters } from '@/types'

export const useProducts = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  })
}

export const useFeaturedProducts = (limit = 10) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productsApi.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useSearchProducts = (query: string, filters: Omit<SearchFilters, 'query'> = {}) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productsApi.searchProducts(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
    },
  })
}

export const useSellerProducts = (filters: Omit<SearchFilters, 'sellerId'> = {}) => {
  return useQuery({
    queryKey: ['seller', 'products', filters],
    queryFn: () => productsApi.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.bulkUpdateProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useMyProducts = (filters: Omit<SearchFilters, 'sellerId'> = {}) => {
  return useQuery({
    queryKey: ['products', 'my', filters],
    queryFn: () => productsApi.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
