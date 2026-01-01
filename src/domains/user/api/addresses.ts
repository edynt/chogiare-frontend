import { apiClient } from '@shared/api/axios'
import type { Address, ApiResponse } from '@/types'

export const addressesApi = {
  // Get all addresses for current user
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>('/addresses')
    return response.data.data
  },

  // Get address by ID
  getAddress: async (id: string): Promise<Address> => {
    const response = await apiClient.get<ApiResponse<Address>>(`/addresses/${id}`)
    return response.data.data
  },

  // Get default address
  getDefaultAddress: async (): Promise<Address | null> => {
    const response = await apiClient.get<ApiResponse<Address | null>>('/addresses/default')
    return response.data.data
  },

  // Create new address
  createAddress: async (data: Omit<Address, 'id'>): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>('/addresses', data)
    return response.data.data
  },

  // Update address
  updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(`/addresses/${id}`, data)
    return response.data.data
  },

  // Delete address
  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`)
  },

  // Set default address
  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await apiClient.patch<ApiResponse<Address>>(`/addresses/${id}/set-default`)
    return response.data.data
  },
}

