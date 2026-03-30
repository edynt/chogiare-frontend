import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  canonicalUrl?: string
  structuredData?: object
  noindex?: boolean
}

/**
 * SEO Head Component
 * Dynamically updates document head with meta tags, OG tags, Twitter cards,
 * canonical URL, and JSON-LD structured data for each page.
 */
export function SEOHead({
  title = 'Chợ Giá Rẻ - Mua sắm trực tuyến giá rẻ',
  description = 'Chợ Giá Rẻ - Nền tảng mua sắm trực tuyến hàng đầu Việt Nam với hàng triệu sản phẩm chất lượng và giá cả hợp lý.',
  keywords = 'mua sắm online, thương mại điện tử, sản phẩm giá rẻ, Việt Nam',
  image = 'https://chogiare.com/og-image.jpg',
  url,
  type = 'website',
  canonicalUrl,
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  const fullTitle = title.includes('Chợ Giá Rẻ')
    ? title
    : `${title} | Chợ Giá Rẻ`
  const pageUrl =
    url || canonicalUrl || `https://chogiare.com${window.location.pathname}`

  useEffect(() => {
    document.title = fullTitle

    // Helper to upsert a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      const selector = `meta[${attr}="${key}"]`
      let el = document.querySelector(selector)
      if (el) {
        el.setAttribute('content', content)
      } else {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        el.setAttribute('content', content)
        document.head.appendChild(el)
      }
    }

    // Basic meta tags
    setMeta('name', 'description', description)
    setMeta('name', 'keywords', keywords)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph tags
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:url', pageUrl)
    setMeta('property', 'og:type', type)

    // Twitter Card tags
    setMeta('property', 'twitter:card', 'summary_large_image')
    setMeta('property', 'twitter:title', fullTitle)
    setMeta('property', 'twitter:description', description)
    setMeta('property', 'twitter:image', image)
    setMeta('property', 'twitter:url', pageUrl)

    // Canonical URL
    const canonical = canonicalUrl || pageUrl
    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null
    if (link) {
      link.href = canonical
    } else {
      link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonical
      document.head.appendChild(link)
    }

    // JSON-LD Structured Data
    if (structuredData) {
      // Use a data attribute to identify SEO-managed script tags
      const existingScript = document.querySelector(
        'script[data-seo-head="true"]'
      )
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData)
      } else {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-head', 'true')
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
      }
    }

    // Cleanup dynamic JSON-LD on unmount
    return () => {
      const script = document.querySelector('script[data-seo-head="true"]')
      if (script) {
        script.remove()
      }
    }
  }, [
    title,
    description,
    keywords,
    image,
    pageUrl,
    type,
    canonicalUrl,
    fullTitle,
    structuredData,
    noindex,
  ])

  return null
}
