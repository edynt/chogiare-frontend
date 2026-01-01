import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@user/api/cart'
import { useCartStore } from '@/stores/cartStore'
import type { UpdateCartItemQuantityRequest } from '@user/api/cart'

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string | number; quantity: number }) =>
      cartApi.addItem({ 
        productId: typeof productId === 'string' ? parseInt(productId, 10) : productId, 
        quantity 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'stats'] })
    },
  })
}

export const useUpdateCartItem = () => {
  const { updateQuantity } = useCartStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemQuantityRequest }) =>
      cartApi.updateItemQuantity(itemId, data),
    onSuccess: (data) => {
      updateQuantity(data.productId, data.quantity)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRemoveFromCart = () => {
  const { removeItem } = useCartStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (_, itemId) => {
      removeItem(itemId)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useClearCart = () => {
  const { clearCart } = useCartStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useCartStats = () => {
  return useQuery({
    queryKey: ['cart', 'stats'],
    queryFn: cartApi.getCartStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
