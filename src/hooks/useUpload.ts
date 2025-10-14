import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadApi, type UploadProgress } from '@/api/upload'
import { useAppDispatch } from '@/store'
import { updateProfile } from '@/store/slices/authSlice'

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
      type, 
      onProgress 
    }: { 
      storeId: string; 
      file: File; 
      type: 'logo' | 'banner'; 
      onProgress?: (progress: UploadProgress) => void 
    }) => uploadApi.uploadStoreImage(storeId, file, type, onProgress),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ['stores', storeId] })
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}

export const useUploadAvatar = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      file, 
      onProgress 
    }: { 
      file: File; 
      onProgress?: (progress: UploadProgress) => void 
    }) => uploadApi.uploadAvatar(file, onProgress),
    onSuccess: (data) => {
      // Update user profile with new avatar
      dispatch(updateProfile({ avatar: data.url }))
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
    },
  })
}

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: uploadApi.deleteFile,
  })
}
