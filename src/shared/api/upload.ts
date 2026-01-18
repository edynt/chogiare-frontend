import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadResult {
  url: string
  key: string
  fileName: string
  size: number
  mimeType: string
}

export interface UploadFileRequest {
  file: File
  onProgress?: (progress: UploadProgress) => void
}

export interface UploadFilesRequest {
  files: File[]
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
}

export interface UploadProductImagesRequest {
  productId: string
  files: File[]
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
}

export interface UploadStoreImageRequest {
  storeId: string
  file: File
  onProgress?: (progress: UploadProgress) => void
}

export const uploadApi = {
  // Single file upload
  uploadFile: async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>(
      '/upload/file',
      formData,
      {
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            }
            onProgress(progress)
          }
        },
      }
    )

    return response.data.data
  },

  // Multiple files upload
  uploadFiles: async (
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append(`files`, file)
    })

    const response = await apiClient.post<ApiResponse<UploadResult[]>>(
      '/upload/files',
      formData,
      {
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            }
            // For multiple files, we'll call onProgress for each file
            // This is a simplified implementation - in real scenario you might want more granular progress
            files.forEach((_, index) => {
              onProgress(index, progress)
            })
          }
        },
      }
    )

    return response.data.data
  },

  // Product images upload
  uploadProductImages: async (
    files: File[],
    productId?: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await apiClient.post<ApiResponse<UploadResult[]>>(
      '/upload/product-images',
      formData,
      {
        params: productId ? { productId } : undefined,
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            }
            files.forEach((_, index) => {
              onProgress(index, progress)
            })
          }
        },
      }
    )

    return response.data.data
  },

  // Store image upload (logo or banner)
  uploadStoreImage: async (
    storeId: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>(
      '/upload/store-image',
      formData,
      {
        params: { storeId },
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            }
            onProgress(progress)
          }
        },
      }
    )

    return response.data.data
  },

  // Avatar upload
  uploadAvatar: async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>(
      '/upload/avatar',
      formData,
      {
        onUploadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              ),
            }
            onProgress(progress)
          }
        },
      }
    )

    return response.data.data
  },

  // Delete file by key
  deleteFile: async (key: string): Promise<void> => {
    await apiClient.delete(`/upload/files/${key}`)
  },

  // Get file info by key
  getFileInfo: async (key: string): Promise<UploadResult> => {
    const response = await apiClient.get<ApiResponse<UploadResult>>(
      `/upload/files/${key}`
    )
    return response.data.data
  },

  // List user files
  getUserFiles: async (filters?: {
    path?: string
    folder?: string
  }): Promise<UploadResult[]> => {
    const response = await apiClient.get<ApiResponse<UploadResult[]>>(
      '/upload/files',
      {
        params: filters,
      }
    )
    return response.data.data
  },
}
