import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/api/cart'
import { useAppDispatch } from '@/store'
import { addToCart, removeFromCart, updateCartItem, clearCart } from '@/store/slices/cartSlice'
import type { UpdateCartItemQuantityRequest } from '@/api/cart'

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useAddToCart = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: (data) => {
      dispatch(addToCart(data))
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useUpdateCartItem = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemQuantityRequest }) =>
      cartApi.updateItemQuantity(itemId, data),
    onSuccess: (data) => {
      dispatch(updateCartItem(data))
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRemoveFromCart = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (_, itemId) => {
      dispatch(removeFromCart(itemId))
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useClearCart = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      dispatch(clearCart())
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
