import React, { useEffect } from 'react'

interface PerformanceOptimizerProps {
  children: React.ReactNode
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical CSS
      const criticalCSS = document.createElement('link')
      criticalCSS.rel = 'preload'
      criticalCSS.href = '/src/index.css'
      criticalCSS.as = 'style'
      document.head.appendChild(criticalCSS)

      // Preload critical fonts
      const fontPreload = document.createElement('link')
      fontPreload.rel = 'preload'
      fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      fontPreload.as = 'style'
      document.head.appendChild(fontPreload)
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        // Add loading="lazy" for non-critical images
        if (!img.closest('[data-critical]')) {
          img.loading = 'lazy'
        }
        
        // Add decoding="async" for better performance
        img.decoding = 'async'
      })
    }

    // Add resource hints
    const addResourceHints = () => {
      // DNS prefetch for external domains
      const dnsPrefetch = ['fonts.googleapis.com', 'fonts.gstatic.com']
      dnsPrefetch.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = `//${domain}`
        document.head.appendChild(link)
      })
    }

    // Initialize optimizations
    preloadCriticalResources()
    optimizeImages()
    addResourceHints()

    // Cleanup function
    return () => {
      // Remove any added elements if needed
    }
  }, [])

  return <>{children}</>
}
