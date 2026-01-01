import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Progress } from './progress'
import { Upload, X, File, Image, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  id: string
  file: File
  url?: string
  progress?: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<UploadedFile[]>
  onRemove?: (fileId: string) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  multiple?: boolean
  disabled?: boolean
  className?: string
  uploadedFiles?: UploadedFile[]
}

export function FileUpload({
  onUpload,
  onRemove,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.csv'],
  },
  multiple = true,
  disabled = false,
  className,
  uploadedFiles = [],
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || isUploading) return

      setIsUploading(true)
      try {
        await onUpload(acceptedFiles)
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, disabled, isUploading]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
    multiple,
    disabled: disabled || isUploading,
  })

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={cn(
          'cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          disabled && 'cursor-not-allowed opacity-50',
          isUploading && 'cursor-wait'
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? 'Thả file vào đây...'
                : 'Kéo thả file vào đây hoặc click để chọn'}
            </p>
            <p className="text-sm text-muted-foreground">
              Tối đa {maxFiles} file, mỗi file không quá {formatFileSize(maxSize)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ: {Object.keys(accept).join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Files đã upload:</h4>
          {uploadedFiles.map((uploadedFile) => (
            <Card key={uploadedFile.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(uploadedFile.file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                    {uploadedFile.status === 'uploading' && uploadedFile.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={uploadedFile.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {uploadedFile.progress}%
                        </p>
                      </div>
                    )}
                    {uploadedFile.status === 'error' && uploadedFile.error && (
                      <p className="text-xs text-destructive mt-1">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(uploadedFile.id)}
                      disabled={uploadedFile.status === 'uploading'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
