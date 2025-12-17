import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import type { DepositRequest, QueryTransactionParams } from '@/api/wallet'
import { queryKeys } from '@/constants/queryKeys'

export const useWalletBalance = () => {
  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: () => walletApi.getBalance(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export const useTransactions = (params?: QueryTransactionParams) => {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: () => walletApi.getTransactions(params),
    staleTime: 1 * 60 * 1000,
  })
}

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: queryKeys.wallet.transaction(id),
    queryFn: () => walletApi.getTransaction(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  })
}

export const useDeposit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DepositRequest) => walletApi.deposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions() })
    },
  })
}

