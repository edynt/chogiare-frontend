import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductDetails } from '@/components/product/ProductDetails'

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductDetails />
      </main>
      <Footer />
    </div>
  )
}