import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Progress } from '@shared/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table'
import { Alert, AlertDescription } from '@shared/components/ui/alert'
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
} from 'lucide-react'
import { useNotification } from '@shared/components/notification-provider'
import * as XLSX from 'xlsx'
import { useCreateProduct } from '@/hooks/useProducts'

interface ParsedProduct {
  title: string
  description: string
  price: number
  originalPrice?: number
  costPrice?: number
  sellingPrice?: number
  stock: number
  minStock?: number
  maxStock?: number
  categoryId: string
  images: string[]
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  tags: string[]
  badges: string[]
  location: string
  sku?: string
  barcode?: string
  warranty?: string
  returnPolicy?: string
}

// Vietnamese ↔ English column mapping for import/export
const viToEnMap: Record<string, string> = {
  'Tên sản phẩm': 'title',
  'Mô tả': 'description',
  'Giá bán': 'price',
  'Giá gốc': 'originalPrice',
  'Giá vốn': 'costPrice',
  'Giá bán lẻ': 'sellingPrice',
  'Số lượng': 'stock',
  'Tồn kho tối thiểu': 'minStock',
  'Tồn kho tối đa': 'maxStock',
  'Mã danh mục': 'categoryId',
  'Tình trạng': 'condition',
  'Địa điểm': 'location',
  'Mã SKU': 'sku',
  'Mã vạch': 'barcode',
  'Từ khóa': 'tags',
  'Nhãn': 'badges',
  'Hình ảnh': 'images',
  'Bảo hành': 'warranty',
  'Chính sách đổi trả': 'returnPolicy',
}

export default function ImportProductsPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const createProduct = useCreateProduct()

  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [previewData, setPreviewData] = useState<ParsedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errors, setErrors] = useState<string[]>([])
  const [successCount, setSuccessCount] = useState(0)

  const parseExcel = useCallback((file: File): Promise<ParsedProduct[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = e => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })

          // Find the data sheet — skip instruction sheets, prefer "Sản phẩm"
          let worksheet = null
          for (const name of workbook.SheetNames) {
            if (name === 'Sản phẩm' || name === 'Products') {
              worksheet = workbook.Sheets[name]
              break
            }
          }
          // Fallback to first sheet
          if (!worksheet) {
            worksheet = workbook.Sheets[workbook.SheetNames[0]]
          }

          // Convert to JSON (raw column headers)
          const rawData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]

          // Map Vietnamese headers to English field names
          const mapRow = (row: Record<string, unknown>): Record<string, unknown> => {
            const mapped: Record<string, unknown> = {}
            for (const [key, value] of Object.entries(row)) {
              const englishKey = viToEnMap[key] || key
              mapped[englishKey] = value
            }
            return mapped
          }

          const jsonData = rawData.map(mapRow)

          const products: ParsedProduct[] = []
          const parseErrors: string[] = []

          const parseNumber = (value: unknown): number | undefined => {
            if (value === undefined || value === null || value === '') return undefined
            if (typeof value === 'number') return value
            const parsed = parseFloat(String(value))
            return isNaN(parsed) ? undefined : parsed
          }

          const parseInteger = (value: unknown, defaultVal?: number): number | undefined => {
            if (value === undefined || value === null || value === '') return defaultVal
            if (typeof value === 'number') return Math.floor(value)
            const parsed = parseInt(String(value), 10)
            return isNaN(parsed) ? defaultVal : parsed
          }

          const parseStringArray = (value: unknown): string[] => {
            if (!value) return []
            return String(value).split(',').map((item: string) => item.trim()).filter(Boolean)
          }

          jsonData.forEach((row, index) => {
            try {
              const product: ParsedProduct = {
                title: (row.title as string) || (row.name as string) || '',
                description: (row.description as string) || '',
                price: parseNumber(row.price) || 0,
                originalPrice: parseNumber(row.originalPrice),
                costPrice: parseNumber(row.costPrice),
                sellingPrice: parseNumber(row.sellingPrice),
                stock: parseInteger(row.stock, 1) || 1,
                minStock: parseInteger(row.minStock),
                maxStock: parseInteger(row.maxStock),
                categoryId: String(row.categoryId || '1'),
                images: parseStringArray(row.images),
                condition: ((row.condition as string) || 'new') as
                  | 'new' | 'like_new' | 'good' | 'fair' | 'poor',
                tags: parseStringArray(row.tags),
                badges: parseStringArray(row.badges),
                location: (row.location as string) || 'Hà Nội',
                sku: row.sku ? String(row.sku) : undefined,
                barcode: row.barcode ? String(row.barcode) : undefined,
                warranty: row.warranty ? String(row.warranty) : undefined,
                returnPolicy: row.returnPolicy ? String(row.returnPolicy) : undefined,
              }

              if (!product.title || product.price <= 0) {
                parseErrors.push(`Dòng ${index + 2}: Thiếu tên sản phẩm hoặc giá không hợp lệ`)
                return
              }

              products.push(product)
            } catch (error) {
              parseErrors.push(`Dòng ${index + 2}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`)
            }
          })

          if (parseErrors.length > 0) {
            setErrors(parseErrors)
          }

          if (products.length === 0) {
            reject(new Error('Không tìm thấy sản phẩm nào trong file. Vui lòng kiểm tra lại file Excel.'))
            return
          }

          resolve(products)
        } catch (error) {
          reject(new Error(`Lỗi đọc file Excel: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`))
        }
      }

      reader.onerror = () => {
        reject(new Error('Không thể đọc file. Vui lòng thử lại.'))
      }

      reader.readAsBinaryString(file)
    })
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsProcessing(true)
      setErrors([])
      setImportStatus('idle')
      setParsedProducts([])
      setPreviewData([])

      try {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
          throw new Error(
            'Chỉ hỗ trợ file Excel (.xlsx, .xls). Vui lòng chọn file Excel.'
          )
        }

        const products = await parseExcel(file)

        setParsedProducts(products)
        setPreviewData(products.slice(0, 10))

        notify({
          type: 'success',
          title: 'Phân tích file thành công',
          message: `Đã tìm thấy ${products.length} sản phẩm. Vui lòng kiểm tra và xác nhận import.`,
        })
      } catch (error) {
        notify({
          type: 'error',
          title: 'Lỗi phân tích file',
          message:
            error instanceof Error ? error.message : 'Không thể đọc file.',
        })
        setImportStatus('error')
      } finally {
        setIsProcessing(false)
      }
    },
    [parseExcel, notify]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
  })

  const handleImport = async () => {
    if (parsedProducts.length === 0) return

    setIsProcessing(true)
    setImportProgress(0)
    setSuccessCount(0)
    setErrors([])
    setImportStatus('idle')

    const total = parsedProducts.length
    let success = 0
    const failed: string[] = []

    try {
      for (let i = 0; i < parsedProducts.length; i++) {
        const product = parsedProducts[i]

        try {
          // Only send fields the backend CreateProductDto accepts
          const productData: Record<string, unknown> = {
            title: product.title,
            price: product.price,
            stock: product.stock,
            categoryId:
              typeof product.categoryId === 'string'
                ? parseInt(product.categoryId, 10)
                : product.categoryId,
            condition: product.condition || 'new',
            status: 'active',
          }
          // Optional fields — only include if defined
          if (product.description) productData.description = product.description
          if (product.originalPrice) productData.originalPrice = product.originalPrice
          if (product.costPrice) productData.costPrice = product.costPrice
          if (product.sellingPrice) productData.sellingPrice = product.sellingPrice
          if (product.minStock) productData.minStock = product.minStock
          if (product.maxStock) productData.maxStock = product.maxStock
          if (product.location) productData.location = product.location
          if (product.sku) productData.sku = product.sku
          if (product.barcode) productData.barcode = product.barcode
          if (product.warranty) productData.warranty = product.warranty
          if (product.returnPolicy) productData.returnPolicy = product.returnPolicy
          if (product.tags && product.tags.length > 0) productData.tags = product.tags
          if (product.images && product.images.length > 0) {
            productData.images = product.images
          }

          await createProduct.mutateAsync(productData as unknown as Parameters<typeof createProduct.mutateAsync>[0])
          success++
          setSuccessCount(success)
        } catch (error) {
          failed.push(
            `${product.title}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`
          )
        }

        setImportProgress(((i + 1) / total) * 100)
      }

      if (success > 0) {
        setImportStatus('success')
        notify({
          type: 'success',
          title: 'Import thành công',
          message: `Đã import ${success}/${total} sản phẩm thành công.`,
        })

        // Reset after 3 seconds
        setTimeout(() => {
          setParsedProducts([])
          setPreviewData([])
          setImportProgress(0)
          setSuccessCount(0)
          navigate('/seller/products')
        }, 3000)
      }

      if (failed.length > 0) {
        setErrors(failed)
        setImportStatus('error')
      }
    } catch (error) {
      setImportStatus('error')
      notify({
        type: 'error',
        title: 'Import thất bại',
        message:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi import sản phẩm.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    // Single sheet with Vietnamese headers — condition defaults to 'new', badges removed
    const templateData = [
      {
        'Tên sản phẩm': 'iPhone 14 Pro Max 256GB',
        'Mô tả': 'Điện thoại iPhone 14 Pro Max 256GB, màu Deep Purple',
        'Giá bán': 25000000,
        'Giá gốc': 28000000,
        'Giá vốn': 22000000,
        'Giá bán lẻ': 25000000,
        'Số lượng': 10,
        'Tồn kho tối thiểu': 2,
        'Tồn kho tối đa': 50,
        'Mã danh mục': '1',
        'Địa điểm': 'Hà Nội',
        'Mã SKU': 'IP14PM-256-PUR',
        'Mã vạch': '1234567890123',
        'Từ khóa': 'smartphone,iphone,apple',
        'Hình ảnh': '',
        'Bảo hành': 'Bảo hành 10 tháng chính hãng Apple',
        'Chính sách đổi trả': 'Đổi trả trong 7 ngày nếu lỗi',
      },
      {
        'Tên sản phẩm': 'Samsung Galaxy S23 Ultra 512GB',
        'Mô tả': 'Samsung Galaxy S23 Ultra 512GB, Phantom Black, fullbox',
        'Giá bán': 22000000,
        'Giá gốc': 25000000,
        'Giá vốn': 19000000,
        'Giá bán lẻ': 22000000,
        'Số lượng': 8,
        'Tồn kho tối thiểu': 1,
        'Tồn kho tối đa': 30,
        'Mã danh mục': '1',
        'Địa điểm': 'TP.HCM',
        'Mã SKU': 'SS-S23U-512-BLK',
        'Mã vạch': '9876543210987',
        'Từ khóa': 'smartphone,samsung,android',
        'Hình ảnh': '',
        'Bảo hành': 'Bảo hành 12 tháng chính hãng',
        'Chính sách đổi trả': 'Đổi trả trong 30 ngày',
      },
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)

    ws['!cols'] = [
      { wch: 35 }, { wch: 50 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
      { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 25 },
      { wch: 35 }, { wch: 35 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm')
    XLSX.writeFile(wb, 'mau_import_san_pham.xlsx')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/seller/products')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            Import sản phẩm từ file Excel
          </h1>
          <p className="text-muted-foreground">
            Upload file Excel (.xlsx, .xls) để import hàng loạt sản phẩm vào hệ
            thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload file Excel</CardTitle>
                <CardDescription>
                  Hỗ trợ định dạng: XLS, XLSX. File phải có header row (dòng đầu
                  tiên chứa tên cột).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} disabled={isProcessing} />
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">
                        Đang xử lý file...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          {isDragActive
                            ? 'Thả file vào đây'
                            : 'Kéo thả file vào đây hoặc click để chọn'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Chỉ hỗ trợ file Excel (.xlsx, .xls) - tối đa 10MB
                        </p>
                      </div>
                      <Button variant="outline" type="button">
                        Chọn file
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={downloadTemplate}
                    className="text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải mẫu file Excel
                  </Button>
                  {parsedProducts.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      {parsedProducts.length} sản phẩm
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {previewData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Xem trước ({previewData.length}/{parsedProducts.length})
                  </CardTitle>
                  <CardDescription>
                    Kiểm tra dữ liệu trước khi import. Chỉ hiển thị 10 sản phẩm
                    đầu tiên.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead>Giá</TableHead>
                          <TableHead>Tồn kho</TableHead>
                          <TableHead>Điều kiện</TableHead>
                          <TableHead>Địa điểm</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {product.title}
                            </TableCell>
                            <TableCell>
                              {product.price.toLocaleString('vi-VN')} VNĐ
                            </TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.condition}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Có {errors.length} lỗi:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li>... và {errors.length - 10} lỗi khác</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Import Progress */}
            {isProcessing && parsedProducts.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Đang import...</span>
                      <span>
                        {successCount}/{parsedProducts.length}
                      </span>
                    </div>
                    <Progress value={importProgress} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Button */}
            {parsedProducts.length > 0 &&
              !isProcessing &&
              importStatus !== 'success' && (
                <Button onClick={handleImport} className="w-full" size="lg">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Import {parsedProducts.length} sản phẩm
                </Button>
              )}

            {importStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Import thành công! Đang chuyển hướng...
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Định dạng file
                  </h4>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Chỉ hỗ trợ file Excel: XLS hoặc XLSX</li>
                    <li>Bắt buộc có header row (dòng đầu tiên)</li>
                    <li>File phải có ít nhất 1 sheet</li>
                    <li>Dữ liệu bắt đầu từ dòng thứ 2</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Các trường bắt buộc
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• title (Tên sản phẩm)</li>
                    <li>• price (Giá bán)</li>
                    <li>• stock (Số lượng tồn kho)</li>
                    <li>• categoryId (ID danh mục)</li>
                    <li>• condition (Tình trạng)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Các trường tùy chọn</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• description (Mô tả)</li>
                    <li>• originalPrice (Giá gốc)</li>
                    <li>• costPrice (Giá vốn)</li>
                    <li>• sellingPrice (Giá bán)</li>
                    <li>• minStock / maxStock (Tồn kho min/max)</li>
                    <li>• location (Địa điểm)</li>
                    <li>• sku (Mã sản phẩm)</li>
                    <li>• barcode (Mã vạch)</li>
                    <li>• tags (Thẻ, phân cách bằng dấu phẩy)</li>
                    <li>• badges (Nhãn, phân cách bằng dấu phẩy)</li>
                    <li>• images (URL ảnh, phân cách bằng dấu phẩy)</li>
                    <li>• warranty (Bảo hành)</li>
                    <li>• returnPolicy (Chính sách đổi trả)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Giá trị condition</h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• new: Mới 100%</li>
                    <li>• like_new: Như mới</li>
                    <li>• good: Tốt</li>
                    <li>• fair: Khá</li>
                    <li>• poor: Trung bình</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
