import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Database, CheckCircle } from 'lucide-react'
import { useNotification } from '@/components/notification-provider'
import { parse } from 'papaparse'
import type { DemoData, Product, Category, User, Order } from '@/types'

interface DemoDataLoaderProps {
  onDataLoaded: (data: DemoData) => void
}

interface ParsedData {
  products: Product[]
  categories: Category[]
  users: User[]
  orders: Order[]
}

export function DemoDataLoader({ onDataLoaded }: DemoDataLoaderProps) {
  const { notify } = useNotification()
  const [activeTab, setActiveTab] = useState('upload')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [markdownInput, setMarkdownInput] = useState('')

  const generateId = () => Math.random().toString(36).substr(2, 9)
  const generateDate = () => new Date().toISOString()

  const parseCSV = useCallback((csvText: string): ParsedData => {
    const results = parse(csvText, { header: true, skipEmptyLines: true })
    const data = results.data as Record<string, unknown>[]

    const products: Product[] = data.map((row, index) => ({
      id: generateId(),
      title: (row.title as string) || (row.name as string) || `Product ${index + 1}`,
      description: (row.description as string) || '',
      price: parseFloat(row.price as string) || 0,
      originalPrice: row.originalPrice ? parseFloat(row.originalPrice as string) : undefined,
      categoryId: (row.categoryId as string) || '1',
      images: row.images ? (row.images as string).split(',').map((img: string) => img.trim()) : ['https://via.placeholder.com/400'],
      condition: ((row.condition as string) || 'new') as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
      tags: row.tags ? (row.tags as string).split(',').map((tag: string) => tag.trim()) : [],
      location: (row.location as string) || 'Hà Nội',
      stock: parseInt(row.stock as string) || 1,
      sellerId: (row.sellerId as string) || '1',
      status: 'active' as const,
      badges: row.badges ? (row.badges as string).split(',').map((badge: string) => badge.trim()) as ('NEW' | 'FEATURED' | 'PROMO' | 'HOT' | 'SALE')[] : [],
      rating: parseFloat(row.rating as string) || 4.5,
      reviewCount: parseInt(row.reviewCount as string) || 0,
      viewCount: parseInt(row.viewCount as string) || 0,
      isFeatured: (row.isFeatured as string) === 'true' || false,
      isPromoted: (row.isPromoted as string) === 'true' || false,
      createdAt: generateDate(),
      updatedAt: generateDate(),
    }))

    return {
      products,
      categories: [],
      users: [],
      orders: [],
    }
  }, [])

  const parseMarkdown = useCallback((markdownText: string): ParsedData => {
    // Simple markdown table parser
    const lines = markdownText.split('\n').filter(line => line.trim())
    const tableLines = lines.filter(line => line.includes('|'))
    
    if (tableLines.length < 2) {
      throw new Error('No valid markdown table found')
    }

    const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h)
    const data = tableLines.slice(2).map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(c => c)
      const row: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        row[header.toLowerCase()] = cells[index] || ''
      })
      return row
    })

    return parseCSV(data.map(row => Object.values(row).join(',')).join('\n'))
  }, [parseCSV])

  const parseJSON = useCallback((jsonText: string): ParsedData => {
    const data = JSON.parse(jsonText) as Record<string, unknown> | Record<string, unknown>[]
    
    if ((data as any).products) {
      return data as unknown as ParsedData
    }

    // If it's an array of products
    if (Array.isArray(data)) {
      return {
        products: data.map((item: Record<string, unknown>, index) => ({
          id: generateId(),
          title: (item.title as string) || (item.name as string) || `Product ${index + 1}`,
          description: (item.description as string) || '',
          price: parseFloat(item.price as string) || 0,
          originalPrice: item.originalPrice ? parseFloat(item.originalPrice as string) : undefined,
          categoryId: (item.categoryId as string) || '1',
          images: (item.images as string[]) || ['https://via.placeholder.com/400'],
          condition: ((item.condition as string) || 'new') as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
          tags: (item.tags as string[]) || [],
          location: (item.location as string) || 'Hà Nội',
          stock: parseInt(item.stock as string) || 1,
          sellerId: (item.sellerId as string) || '1',
          status: 'active' as const,
          badges: (item.badges as ('NEW' | 'FEATURED' | 'PROMO' | 'HOT' | 'SALE')[]) || [],
          rating: parseFloat(item.rating as string) || 4.5,
          reviewCount: parseInt(item.reviewCount as string) || 0,
          viewCount: parseInt(item.viewCount as string) || 0,
          isFeatured: (item.isFeatured as boolean) || false,
          isPromoted: (item.isPromoted as boolean) || false,
          createdAt: generateDate(),
          updatedAt: generateDate(),
        })),
        categories: [],
        users: [],
        orders: [],
      }
    }

    throw new Error('Invalid JSON format')
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        let data: ParsedData

        if (file.name.endsWith('.csv')) {
          data = parseCSV(text)
        } else if (file.name.endsWith('.json')) {
          data = parseJSON(text)
        } else if (file.name.endsWith('.md')) {
          data = parseMarkdown(text)
        } else {
          throw new Error('Unsupported file format')
        }

        setParsedData(data)
        setPreviewData(data.products.slice(0, 5) as any)
        notify({
          type: 'success',
          title: 'File parsed successfully',
          message: `Found ${data.products.length} products`,
        })
      } catch (error) {
        notify({
          type: 'error',
          title: 'Parse error',
          message: error instanceof Error ? error.message : 'Failed to parse file',
        })
      } finally {
        setIsProcessing(false)
      }
    }

    reader.readAsText(file)
  }, [parseCSV, parseJSON, parseMarkdown, notify])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/markdown': ['.md'],
    },
    multiple: false,
  })

  const handleProcessInput = () => {
    if (!jsonInput.trim() && !markdownInput.trim()) return

    setIsProcessing(true)
    try {
      let data: ParsedData

      if (activeTab === 'json' && jsonInput.trim()) {
        data = parseJSON(jsonInput)
      } else if (activeTab === 'markdown' && markdownInput.trim()) {
        data = parseMarkdown(markdownInput)
      } else {
        throw new Error('Please enter data to process')
      }

      setParsedData(data)
      setPreviewData(data.products.slice(0, 5) as any)
      notify({
        type: 'success',
        title: 'Data parsed successfully',
        message: `Found ${data.products.length} products`,
      })
    } catch (error) {
      notify({
        type: 'error',
        title: 'Parse error',
        message: error instanceof Error ? error.message : 'Failed to parse data',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSeedData = () => {
    if (!parsedData) return

    onDataLoaded(parsedData)
    notify({
      type: 'success',
      title: 'Demo data seeded',
      message: 'Data has been loaded into the application',
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Demo Data Loader
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="json">JSON Input</TabsTrigger>
            <TabsTrigger value="markdown">Markdown Table</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports CSV, JSON, and Markdown table formats
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                JSON Data
              </label>
              <Textarea
                placeholder="Paste your JSON data here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleProcessInput} disabled={isProcessing || !jsonInput.trim()}>
              {isProcessing ? 'Processing...' : 'Parse JSON'}
            </Button>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Markdown Table
              </label>
              <Textarea
                placeholder="Paste your markdown table here..."
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleProcessInput} disabled={isProcessing || !markdownInput.trim()}>
              {isProcessing ? 'Processing...' : 'Parse Markdown'}
            </Button>
          </TabsContent>
        </Tabs>

        {parsedData && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Data parsed successfully!</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{parsedData.products.length}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{parsedData.categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{parsedData.users.length}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{parsedData.orders.length}</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
            </div>

            {previewData.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Preview (first 5 items):</h4>
                <div className="space-y-2">
                  {previewData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{(item as any).title}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {(item as any).price ? `$${(item as any).price}` : 'No price'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleSeedData} className="w-full">
              Seed Demo Data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
