import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadApi, type UploadProgress } from '@shared/api/upload'

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: UploadProgress) => void }) =>
      uploadApi.uploadFile(file, onProgress),
  })
}

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: ({ 
      files, 
      onProgress 
    }: { 
      files: File[]; 
      onProgress?: (fileIndex: number, progress: UploadProgress) => void 
    }) => uploadApi.uploadFiles(files, onProgress),
  })
}

export const useUploadProductImages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      productId, 
      files, 
      onProgress 
    }: { 
      productId: string; 
      files: File[]; 
      onProgress?: (fileIndex: number, progress: UploadProgress) => void 
    }) => uploadApi.uploadProductImages(productId, files, onProgress),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products', productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUploadStoreImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      storeId, 
      file, 
      onProgress 
    }: { 
      storeId: string; 
      file: File; 
      onProgress?: (progress: UploadProgress) => void 
    }) => uploadApi.uploadStoreImage(storeId, file, onProgress),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['stores', storeId] })
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      file, 
      onProgress 
    }: { 
      file: File; 
      onProgress?: (progress: UploadProgress) => void 
    }) => uploadApi.uploadAvatar(file, onProgress),
    onSuccess: () => {
      // Update user profile with new avatar
      // This would need to be implemented with proper user update logic
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
    },
  })
}

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: uploadApi.deleteFile,
  })
}
