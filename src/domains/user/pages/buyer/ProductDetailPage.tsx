import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import { Button } from '@shared/components/ui/button'
import { ProductDetails } from '@shared/components/product/ProductDetails'
import { ArrowLeft } from 'lucide-react'

export default function ProductDetailPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          {/* Product Details Component */}
          <ProductDetails />
        </div>
      </main>
      <Footer />
    </div>
  )
}
