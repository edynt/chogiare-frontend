import { apiClient } from '@shared/api/axios'
import type { ApiResponse } from '@/types'

export interface WalletBalance {
  balance: number
  currency: string
  updatedAt: string
}

export interface Transaction {
  id: number
  type: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethod: string | null
  reference: string | null
  description: string | null
  createdAt: string
  updatedAt: string
  fee?: number
  netAmount?: number
  completedAt?: string
  method?: string
}

export interface TransactionListResponse {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DepositRequest {
  amount: number
  paymentMethod: string
  reference?: string
  description?: string
}

export interface DepositResponse {
  transaction: {
    id: number
    amount: number
    currency: string
    status: string
    paymentMethod: string
    createdAt: string
  }
  balance: {
    previousBalance: number
    newBalance: number
  }
}

export interface QueryTransactionParams {
  page?: number
  pageSize?: number
  type?: 'deposit' | 'sale' | 'refund' | 'commission' | 'bonus' | 'boost'
  status?: 'pending' | 'completed' | 'failed' | 'cancelled'
}

export interface DepositPackage {
  id: number
  name: string
  amount: number
  displayOrder: number
}

export const walletApi = {
  getBalance: async (): Promise<WalletBalance> => {
    const response =
      await apiClient.get<ApiResponse<WalletBalance>>('/payments/balance')
    return response.data.data
  },

  getTransactions: async (
    params?: QueryTransactionParams
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get<ApiResponse<TransactionListResponse>>(
      '/payments/transactions',
      {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          type: params?.type,
          status: params?.status,
        },
      }
    )
    return response.data.data
  },

  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      `/payments/transactions/${id}`
    )
    return response.data.data
  },

  deposit: async (data: DepositRequest): Promise<DepositResponse> => {
    const response = await apiClient.post<ApiResponse<DepositResponse>>(
      '/payments/deposit',
      data
    )
    return response.data.data
  },

  getDepositPackages: async (): Promise<DepositPackage[]> => {
    const response = await apiClient.get<ApiResponse<DepositPackage[]>>(
      '/payments/deposit-packages'
    )
    return response.data.data
  },
}
