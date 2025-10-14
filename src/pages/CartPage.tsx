import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartPage as CartPageComponent } from '@/components/cart/CartPage'

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CartPageComponent />
      </main>
      <Footer />
    </div>
  )
}