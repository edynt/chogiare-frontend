import React from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductDetails } from '@/components/product/ProductDetails'
import { SEOHead } from '@/components/seo/SEOHead'
import { useProduct } from '@/hooks'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product } = useProduct(id || '')

  const structuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": product.seller?.name || "Chogiare"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "VND",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.seller?.name || "Chogiare"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    } : undefined
  } : undefined

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product?.title || 'Chi tiết sản phẩm'}
        description={product?.description || 'Xem chi tiết sản phẩm tại Chogiare'}
        keywords={`${product?.title}, ${product?.category?.name}, mua sắm online, chogiare`}
        image={product?.images?.[0]}
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProductDetails />
      </main>
      <Footer />
    </div>
  )
}