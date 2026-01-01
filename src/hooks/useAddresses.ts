import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressesApi } from '@user/api/addresses'
import type { Address } from '@/types'

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAddresses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAddress = (id: string) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: () => addressesApi.getAddress(id),
    enabled: !!id,
  })
}

export const useDefaultAddress = () => {
  return useQuery({
    queryKey: ['addresses', 'default'],
    queryFn: addressesApi.getDefaultAddress,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Address, 'id'>) => addressesApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      addressesApi.updateAddress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['address', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['addresses', 'default'] })
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addressesApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['addresses', 'default'] })
    },
  })
}

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addressesApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      queryClient.invalidateQueries({ queryKey: ['addresses', 'default'] })
    },
  })
}

