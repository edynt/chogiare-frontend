import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useNotification } from '@/components/notification-provider'
import { seedApi } from '@/api/seed'
import { 
  Database, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'

interface SeedResult {
  message: string
  count: number
  categories: number
  users: number
  products: number
}

export function DataSeeder() {
  const { notify } = useNotification()
  const [isSeeding, setIsSeeding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [seedCount, setSeedCount] = useState(50)
  const [lastResult, setLastResult] = useState<SeedResult | null>(null)

  const handleSeed = async () => {
    if (seedCount <= 0 || seedCount > 1000) {
      notify({
        type: 'error',
        title: 'Lỗi',
        message: 'Số lượng sản phẩm phải từ 1 đến 1000',
      })
      return
    }

    setIsSeeding(true)
    setProgress(0)
    setLastResult(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await seedApi.seedProducts(seedCount)
      
      clearInterval(progressInterval)
      setProgress(100)
      setLastResult(result)

      notify({
        type: 'success',
        title: 'Seeding thành công!',
        message: `Đã tạo ${result.products} sản phẩm, ${result.users} người dùng, ${result.categories} danh mục`,
      })
    } catch (error) {
      notify({
        type: 'error',
        title: 'Seeding thất bại',
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi seeding dữ liệu',
      })
    } finally {
      setIsSeeding(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Seeder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="seed-count">Số lượng sản phẩm cần tạo</Label>
            <Input
              id="seed-count"
              type="number"
              min="1"
              max="1000"
              value={seedCount}
              onChange={(e) => setSeedCount(parseInt(e.target.value) || 50)}
              disabled={isSeeding}
              placeholder="Nhập số lượng sản phẩm (1-1000)"
            />
            <p className="text-sm text-muted-foreground">
              Sẽ tạo sản phẩm, người dùng và danh mục giả lập cho testing
            </p>
          </div>

          {isSeeding && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Đang tạo dữ liệu...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full"
            size="lg"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang seeding...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Bắt đầu seeding
              </>
            )}
          </Button>

          {lastResult && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Seeding hoàn thành!</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">
                      {lastResult.products}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Sản phẩm</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">
                      {lastResult.users}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Người dùng</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">
                      {lastResult.categories}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Danh mục</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">
                      {lastResult.count}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Tổng cộng</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded-md">
                  <p className="text-sm text-green-800">
                    {lastResult.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="border-t pt-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Seeder sẽ tạo dữ liệu giả lập cho mục đích testing</li>
                  <li>• Dữ liệu bao gồm: sản phẩm, người dùng, danh mục</li>
                  <li>• Chỉ nên sử dụng trong môi trường development</li>
                  <li>• Có thể mất vài phút để hoàn thành tùy theo số lượng</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
