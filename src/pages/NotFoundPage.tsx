import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Trang không tìm thấy</h2>
        <p className="text-muted-foreground">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}
