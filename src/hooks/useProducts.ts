import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { productsApi, getCategories, type BoostPackage } from '@user/api/products'
import { queryKeys } from '@/constants/queryKeys'
import { sellerApi } from '@user/api/seller'
import type { Product, SearchFilters } from '@/types'

export const useProducts = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useInfiniteProducts = (
  filters: Omit<SearchFilters, 'page'> = {}
) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => {
      return productsApi.getProducts({
        ...filters,
        page: pageParam,
        limit: filters.limit || 20,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length
      const totalPages = lastPage.totalPages || 1
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
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

export const useSearchProducts = (
  query: string,
  filters: Omit<SearchFilters, 'query'> = {}
) => {
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
    mutationFn: sellerApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
    },
  })
}

export const useCreateProductWithImages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: Parameters<typeof sellerApi.createProductWithImages>[0]
      files: File[]
    }) => sellerApi.createProductWithImages(data, files),
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
      sellerApi.updateProduct(id, data),
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
    mutationFn: sellerApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
    },
  })
}

export const useSellerProducts = (
  filters: Omit<SearchFilters, 'sellerId'> = {}
) => {
  return useQuery({
    queryKey: ['seller', 'products', filters],
    queryFn: () => sellerApi.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sellerApi.bulkUpdateProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useMyProducts = (
  filters: Omit<SearchFilters, 'sellerId'> = {}
) => {
  return useQuery({
    queryKey: ['products', 'my', filters],
    queryFn: () => sellerApi.getMyProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Boost-related hooks
export const useBoostPackages = () => {
  return useQuery({
    queryKey: ['products', 'boost-packages'],
    queryFn: () => productsApi.getBoostPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBoostStatus = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: ['products', productId, 'boost-status'],
    queryFn: () => productsApi.getBoostStatus(productId),
    enabled: !!productId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useBoostProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      packageId,
    }: {
      productId: string
      packageId: number
    }) => productsApi.boostProduct(productId, packageId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ['products', productId, 'boost-status'],
      })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
    },
  })
}
