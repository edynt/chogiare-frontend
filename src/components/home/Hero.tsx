import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom duration-1000">
            Tìm kiếm sản phẩm
            <span className="text-primary animate-in fade-in duration-1500 delay-300"> tuyệt vời</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            Khám phá hàng ngàn sản phẩm chất lượng từ các người bán uy tín. 
            Mua bán an toàn, nhanh chóng và tiện lợi.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                className="w-full h-14 pl-12 pr-32 rounded-lg border border-input bg-background text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-lg transition-shadow duration-300"
              />
              <Button size="lg" className="absolute right-2 top-2 h-10 hover:scale-105 transition-transform duration-200">
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <Button size="lg" asChild className="hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Link to="/products">Khám phá ngay</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Link to="/seller/dashboard">Bắt đầu bán hàng</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="text-center hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-left duration-700 delay-600">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Sản phẩm</div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-left duration-700 delay-700">
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <div className="text-muted-foreground">Người bán</div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-left duration-700 delay-800">
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="text-muted-foreground">Giao dịch thành công</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
