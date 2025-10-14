import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadResult {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
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
  type: 'logo' | 'banner'
  onProgress?: (progress: UploadProgress) => void
}

export const uploadApi = {
  // Single file upload
  uploadFile: async (file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>('/v1/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          }
          onProgress(progress)
        }
      },
    })

    return response.data.data
  },

  // Multiple files upload
  uploadFiles: async (files: File[], onProgress?: (fileIndex: number, progress: UploadProgress) => void): Promise<UploadResult[]> => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files`, file)
    })

    const response = await apiClient.post<ApiResponse<UploadResult[]>>('/v1/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          }
          // For multiple files, we'll call onProgress for each file
          // This is a simplified implementation - in real scenario you might want more granular progress
          files.forEach((_, index) => {
            onProgress(index, progress)
          })
        }
      },
    })

    return response.data.data
  },

  // Product images upload
  uploadProductImages: async (productId: string, files: File[], onProgress?: (fileIndex: number, progress: UploadProgress) => void): Promise<UploadResult[]> => {
    const formData = new FormData()
    formData.append('productId', productId)
    files.forEach((file) => {
      formData.append('images', file)
    })

    const response = await apiClient.post<ApiResponse<UploadResult[]>>('/v1/upload/product-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          }
          files.forEach((_, index) => {
            onProgress(index, progress)
          })
        }
      },
    })

    return response.data.data
  },

  // Store image upload (logo or banner)
  uploadStoreImage: async (storeId: string, file: File, type: 'logo' | 'banner', onProgress?: (progress: UploadProgress) => void): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('storeId', storeId)
    formData.append('type', type)
    formData.append('file', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>('/v1/upload/store-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          }
          onProgress(progress)
        }
      },
    })

    return response.data.data
  },

  // Avatar upload
  uploadAvatar: async (file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post<ApiResponse<UploadResult>>('/v1/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          }
          onProgress(progress)
        }
      },
    })

    return response.data.data
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/v1/upload/files/${fileId}`)
  },

  // Get file info
  getFileInfo: async (fileId: string): Promise<UploadResult> => {
    const response = await apiClient.get<ApiResponse<UploadResult>>(`/v1/upload/files/${fileId}`)
    return response.data.data
  },

  // List user files
  getUserFiles: async (page = 1, pageSize = 20): Promise<{ files: UploadResult[]; total: number; page: number; pageSize: number; totalPages: number }> => {
    const response = await apiClient.get<ApiResponse<{ files: UploadResult[]; total: number; page: number; pageSize: number; totalPages: number }>>('/v1/upload/files', {
      params: { page, page_size: pageSize }
    })
    return response.data.data
  },
}