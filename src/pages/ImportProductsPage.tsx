import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, Download, ArrowLeft } from 'lucide-react'
import { useNotification } from '@/components/notification-provider'
import * as XLSX from 'xlsx'
import { useCreateProduct } from '@/hooks/useProducts'
import { PLACEHOLDER_IMAGE } from '@/lib/utils'

interface ParsedProduct {
  title: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  categoryId: string
  images: string[]
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  tags: string[]
  location: string
}

export default function ImportProductsPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const createProduct = useCreateProduct()
  
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [previewData, setPreviewData] = useState<ParsedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<string[]>([])
  const [successCount, setSuccessCount] = useState(0)

  const parseExcel = useCallback((file: File): Promise<ParsedProduct[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]
          
          const products: ParsedProduct[] = []
          const parseErrors: string[] = []

          jsonData.forEach((row, index) => {
            try {
              const product: ParsedProduct = {
                title: (row.title as string) || (row.name as string) || '',
                description: (row.description as string) || '',
                price: typeof row.price === 'number' ? row.price : parseFloat(String(row.price || '0')) || 0,
                originalPrice: row.originalPrice ? (typeof row.originalPrice === 'number' ? row.originalPrice : parseFloat(String(row.originalPrice)) || undefined) : undefined,
                stock: typeof row.stock === 'number' ? row.stock : parseInt(String(row.stock || '1')) || 1,
                categoryId: String(row.categoryId || '1'),
                images: row.images ? String(row.images).split(',').map((img: string) => img.trim()).filter(Boolean) : [],
                condition: ((row.condition as string) || 'new') as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
                tags: row.tags ? String(row.tags).split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
                location: (row.location as string) || 'Hà Nội',
              }

              // Validate required fields
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    setErrors([])
    setImportStatus('idle')
    setParsedProducts([])
    setPreviewData([])

    try {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Chỉ hỗ trợ file Excel (.xlsx, .xls). Vui lòng chọn file Excel.')
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
        message: error instanceof Error ? error.message : 'Không thể đọc file.',
      })
      setImportStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }, [parseExcel, notify])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
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
          // Convert to Product type
          const productData = {
            title: product.title,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            categoryId: product.categoryId,
            images: product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE],
            condition: product.condition,
            tags: product.tags,
            location: product.location,
            status: 'active' as const,
            sellerId: '', // Will be set by backend
            badges: [],
            rating: 0,
            reviewCount: 0,
            viewCount: 0,
            isFeatured: false,
            isPromoted: false,
          }

          await createProduct.mutateAsync(productData as Parameters<typeof createProduct.mutateAsync>[0])
          success++
          setSuccessCount(success)
        } catch (error) {
          failed.push(`${product.title}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`)
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
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi import sản phẩm.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        title: 'iPhone 14 Pro Max',
        description: 'Điện thoại iPhone 14 Pro Max 256GB',
        price: 25000000,
        originalPrice: 28000000,
        stock: 10,
        categoryId: '1',
        condition: 'new',
        location: 'Hà Nội',
        tags: 'smartphone,iphone',
        images: 'https://example.com/image1.jpg'
      },
      {
        title: 'Samsung Galaxy S23 Ultra',
        description: 'Điện thoại Samsung Galaxy S23 Ultra 512GB',
        price: 22000000,
        originalPrice: 25000000,
        stock: 8,
        categoryId: '1',
        condition: 'new',
        location: 'TP.HCM',
        tags: 'smartphone,samsung',
        images: 'https://example.com/image2.jpg'
      }
    ]

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    XLSX.utils.book_append_sheet(wb, ws, 'Products')

    // Download file
    XLSX.writeFile(wb, 'product_import_template.xlsx')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/seller/products')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold mb-2">Import sản phẩm từ file Excel</h1>
          <p className="text-muted-foreground">
            Upload file Excel (.xlsx, .xls) để import hàng loạt sản phẩm vào hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload file Excel</CardTitle>
                <CardDescription>
                  Hỗ trợ định dạng: XLS, XLSX. File phải có header row (dòng đầu tiên chứa tên cột).
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
                      <p className="text-muted-foreground">Đang xử lý file...</p>
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
                          {isDragActive ? 'Thả file vào đây' : 'Kéo thả file vào đây hoặc click để chọn'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Chỉ hỗ trợ file Excel (.xlsx, .xls) - tối đa 10MB
                        </p>
                      </div>
                      <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                        Chọn file
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="outline" onClick={downloadTemplate} className="text-sm">
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
                  <CardTitle>Xem trước ({previewData.length}/{parsedProducts.length})</CardTitle>
                  <CardDescription>
                    Kiểm tra dữ liệu trước khi import. Chỉ hiển thị 10 sản phẩm đầu tiên.
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
                            <TableCell className="font-medium">{product.title}</TableCell>
                            <TableCell>{product.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.condition}</Badge>
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
                    {errors.length > 10 && <li>... và {errors.length - 10} lỗi khác</li>}
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
                      <span>{successCount}/{parsedProducts.length}</span>
                    </div>
                    <Progress value={importProgress} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Button */}
            {parsedProducts.length > 0 && !isProcessing && importStatus !== 'success' && (
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
                    <li>• price (Giá)</li>
                    <li>• stock (Tồn kho)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Các trường tùy chọn</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• description</li>
                    <li>• originalPrice</li>
                    <li>• categoryId</li>
                    <li>• condition (new, like_new, good, fair, poor)</li>
                    <li>• location</li>
                    <li>• tags (phân cách bằng dấu phẩy)</li>
                    <li>• images (URL, phân cách bằng dấu phẩy)</li>
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

