import React, { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: object
}

export function SEOHead({
  title = 'Chogiare - Mua sắm trực tuyến giá rẻ',
  description = 'Chogiare - Nền tảng mua sắm trực tuyến hàng đầu Việt Nam với hàng triệu sản phẩm chất lượng, giá cả hợp lý và giao hàng nhanh chóng.',
  keywords = 'mua sắm online, thương mại điện tử, sản phẩm giá rẻ, giao hàng nhanh, Việt Nam',
  image = '/og-image.jpg',
  url = 'https://chogiare.com',
  type = 'website',
  structuredData
}: SEOHeadProps) {
  const fullTitle = title.includes('Chogiare') ? title : `${title} | Chogiare`
  
  useEffect(() => {
    // Update document title
    document.title = fullTitle
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'keywords'
      meta.content = keywords
      document.head.appendChild(meta)
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = fullTitle
      document.head.appendChild(meta)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:description')
      meta.content = description
      document.head.appendChild(meta)
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) {
      ogImage.setAttribute('content', image)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:image')
      meta.content = image
      document.head.appendChild(meta)
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', url)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:url')
      meta.content = url
      document.head.appendChild(meta)
    }
    
    // Add structured data
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData)
      } else {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
      }
    }
  }, [title, description, keywords, image, url, fullTitle, structuredData])
  
  return null
}
