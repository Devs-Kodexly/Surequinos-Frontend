"use client"

import { useState, useEffect } from 'react'
import { OptimizedImage } from '@/components/optimized-image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cleanImageArray, cleanImageUrl } from '@/lib/api'

interface ProductImageGalleryProps {
  productImages: string[]
  variantImage?: string
  productName: string
  className?: string
}

export function ProductImageGallery({ 
  productImages, 
  variantImage, 
  productName, 
  className = '' 
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Clean images
  const cleanProductImages = cleanImageArray(productImages)
  const cleanVariantImage = cleanImageUrl(variantImage)
  
  // Combine product images with variant image (variant image takes priority)
  const allImages = cleanVariantImage 
    ? [cleanVariantImage, ...cleanProductImages.filter(img => img !== cleanVariantImage)]
    : cleanProductImages

  // Reset to first image when variant changes
  useEffect(() => {
    if (cleanVariantImage) {
      setCurrentImageIndex(0)
    }
  }, [cleanVariantImage])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  if (allImages.length === 0) {
    return (
      <div className={`aspect-square bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg mx-auto mb-2" />
          <p className="text-sm">Sin imagen</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden group">
        <OptimizedImage
          src={allImages[currentImageIndex]}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          priority={currentImageIndex === 0}
        />
        
        {/* Navigation arrows - only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Variant indicator */}
        {cleanVariantImage && currentImageIndex === 0 && (
          <div className="absolute top-2 left-2 bg-[#E5AB4A] text-[#0F0B0A] px-2 py-1 rounded text-xs font-medium">
            Variante
          </div>
        )}
      </div>

      {/* Thumbnail navigation - only show if multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? 'border-[#E5AB4A]'
                  : 'border-transparent hover:border-[#E5AB4A]/50'
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
              {/* Variant indicator on thumbnail */}
              {cleanVariantImage && index === 0 && (
                <div className="absolute inset-0 bg-[#E5AB4A]/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#E5AB4A] rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}