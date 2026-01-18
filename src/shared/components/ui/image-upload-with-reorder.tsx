import React, { useCallback, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from './button'
import { Badge } from './badge'
import { Card, CardContent } from './card'
import { Upload, X, GripVertical, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImageItem {
  id: string
  file: File
  url: string
}

interface SortableImageProps {
  image: ImageItem
  index: number
  onRemove: (id: string) => void
}

function SortableImage({ image, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group rounded-lg overflow-hidden border-2 aspect-square',
        isDragging ? 'border-primary shadow-lg' : 'border-border',
        index === 0 && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <img
        src={image.url}
        alt={`Product ${index + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Kéo để sắp xếp"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Remove button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(image.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Primary image badge */}
      {index === 0 && (
        <Badge className="absolute bottom-2 left-2 bg-primary">
          Ảnh đại diện
        </Badge>
      )}

      {/* Image number */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {index + 1}
      </div>
    </div>
  )
}

interface ImageUploadWithReorderProps {
  images: ImageItem[]
  onImagesChange: (images: ImageItem[]) => void
  maxImages?: number
  className?: string
}

export function ImageUploadWithReorder({
  images,
  onImagesChange,
  maxImages = 10,
  className,
}: ImageUploadWithReorderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id)
      const newIndex = images.findIndex(img => img.id === over.id)
      onImagesChange(arrayMove(images, oldIndex, newIndex))
    }
  }

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const remainingSlots = maxImages - images.length
      if (remainingSlots <= 0) return

      const newFiles = Array.from(files).slice(0, remainingSlots)
      const newImages: ImageItem[] = newFiles.map((file, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: URL.createObjectURL(file),
      }))

      onImagesChange([...images, ...newImages])
    },
    [images, maxImages, onImagesChange]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    e.target.value = '' // Reset input
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleRemove = useCallback(
    (id: string) => {
      const image = images.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.url)
      }
      onImagesChange(images.filter(img => img.id !== id))
    },
    [images, onImagesChange]
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver && 'border-primary bg-primary/5',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <label
            htmlFor="image-upload"
            className={cn(
              'flex flex-col items-center cursor-pointer',
              images.length >= maxImages && 'cursor-not-allowed'
            )}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">
              {isDragOver
                ? 'Thả ảnh vào đây...'
                : 'Kéo thả ảnh hoặc click để chọn'}
            </p>
            <p className="text-xs text-muted-foreground">
              Tối đa {maxImages} ảnh • PNG, JPG, WEBP
            </p>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              disabled={images.length >= maxImages}
              className="hidden"
            />
          </label>
        </CardContent>
      </Card>

      {/* Image grid with drag-and-drop */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {images.length} ảnh đã chọn
            </p>
            <p className="text-xs text-muted-foreground">
              Kéo để sắp xếp • Ảnh đầu tiên là ảnh đại diện
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(img => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    index={index}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
