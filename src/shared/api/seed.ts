import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface SeedResponse {
  message: string
  count: number
  categories: number
  users: number
  products: number
}

export const seedApi = {
  seedProducts: async (count: number = 50): Promise<SeedResponse> => {
    const response = await apiClient.post<ApiResponse<SeedResponse>>(
      `/v1/products/seed?count=${count}`
    )
    return response.data.data
  },
}
