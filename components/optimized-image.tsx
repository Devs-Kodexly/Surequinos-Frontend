"use client"

import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface OptimizedImageProps {
  src?: string
  alt: string
  fallbackSrc?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)



  // Determine which image to show
  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src

  // If no image source is available, show placeholder
  if (!imageSrc || imageError && !fallbackSrc) {
    return (
      <div className={`bg-gradient-to-br from-[#f5f5f0] to-[#e5e5e0] flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-[#AA3E11]/30 mx-auto mb-2" />
          <p className="text-xs text-[#AA3E11]/50">Sin imagen</p>
          {imageSrc && (
            <p className="text-xs text-red-500 mt-1 break-all">
              Error: {imageSrc.substring(0, 50)}...
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f0] to-[#e5e5e0] animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-[#AA3E11]/20 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-16 h-2 bg-[#AA3E11]/10 rounded animate-pulse"></div>
          </div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${fill ? 'object-cover w-full h-full' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          if (!imageError) {
            setImageError(true)
          }
        }}
        unoptimized={imageSrc?.includes('.r2.dev')} // Disable optimization for R2 images to avoid issues
      />
    </div>
  )
}