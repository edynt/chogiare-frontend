/**
 * Utility for constructing FormData from structured objects.
 * Handles primitives, arrays, and file objects.
 */

export interface FormDataOptions {
  /** Skip null/undefined values */
  skipEmpty?: boolean
  /** Convert numbers to strings */
  stringifyNumbers?: boolean
}

/**
 * Append a value to FormData, handling different types
 */
export function appendToFormData(
  formData: FormData,
  key: string,
  value: unknown,
  options: FormDataOptions = {}
): void {
  const { skipEmpty = true, stringifyNumbers = true } = options

  // Skip empty values
  if (skipEmpty && (value === null || value === undefined || value === '')) {
    return
  }

  // Handle arrays
  if (Array.isArray(value)) {
    value.forEach(item => {
      if (item instanceof File) {
        formData.append(key, item)
      } else if (typeof item === 'string') {
        formData.append(key, item)
      } else if (typeof item === 'number') {
        formData.append(
          key,
          stringifyNumbers ? String(item) : (item as unknown as string | Blob)
        )
      }
    })
    return
  }

  // Handle File
  if (value instanceof File) {
    formData.append(key, value)
    return
  }

  // Handle numbers
  if (typeof value === 'number') {
    formData.append(
      key,
      stringifyNumbers ? String(value) : (value as unknown as string | Blob)
    )
    return
  }

  // Handle strings
  if (typeof value === 'string') {
    formData.append(key, value)
    return
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    formData.append(key, String(value))
    return
  }
}

/**
 * Product creation form data input type
 */
export interface CreateProductFormDataInput {
  title: string
  description?: string
  categoryId: number
  price: number
  originalPrice?: number
  condition: string
  location?: string
  stock: number
  minStock?: number
  maxStock?: number
  costPrice?: number
  sellingPrice?: number
  sku?: string
  barcode?: string
  storeId?: number
  tags?: string[]
  badges?: string[]
}

/**
 * Construct FormData for product creation with images
 */
export function constructProductFormData(
  data: CreateProductFormDataInput,
  files: File[]
): FormData {
  const formData = new FormData()

  // Required fields
  appendToFormData(formData, 'title', data.title)
  appendToFormData(formData, 'categoryId', data.categoryId)
  appendToFormData(formData, 'price', data.price)
  appendToFormData(formData, 'condition', data.condition)
  appendToFormData(formData, 'stock', data.stock)

  // Optional fields
  appendToFormData(formData, 'description', data.description)
  appendToFormData(formData, 'originalPrice', data.originalPrice)
  appendToFormData(formData, 'location', data.location)
  appendToFormData(formData, 'minStock', data.minStock)
  appendToFormData(formData, 'maxStock', data.maxStock)
  appendToFormData(formData, 'costPrice', data.costPrice)
  appendToFormData(formData, 'sellingPrice', data.sellingPrice)
  appendToFormData(formData, 'sku', data.sku)
  appendToFormData(formData, 'barcode', data.barcode)
  appendToFormData(formData, 'storeId', data.storeId)

  // Array fields (tags and badges are sent as comma-separated strings for multipart)
  if (data.tags && data.tags.length > 0) {
    appendToFormData(formData, 'tags', data.tags.join(','))
  }
  if (data.badges && data.badges.length > 0) {
    appendToFormData(formData, 'badges', data.badges.join(','))
  }

  // Files
  files.forEach(file => {
    formData.append('images', file)
  })

  return formData
}
