"use client"

import { useState, useEffect } from 'react'
import { OptimizedImage } from '@/components/optimized-image'

interface Variant {
  id: string
  sku: string
  color?: string
  size?: string
  type?: string
  price: number
  stock: number
  imageUrl?: string
  available: boolean
}

interface DynamicProductImageProps {
  productImages: string[]
  variants: Variant[]
  productName: string
  selectedColor?: string
  selectedSize?: string
  selectedType?: string
  className?: string
}

export function DynamicProductImage({
  productImages,
  variants,
  productName,
  selectedColor,
  selectedSize,
  selectedType,
  className = '',
}: DynamicProductImageProps) {
  const [currentImage, setCurrentImage] = useState<string>('')

  useEffect(() => {
    // Buscar imagen específica de variante basada en selección
    let targetImage = ''

    if (selectedColor || selectedSize || selectedType) {
      // Buscar variante que coincida con la selección
      const matchingVariant = variants.find(variant => {
        const colorMatch = !selectedColor || variant.color === selectedColor
        const sizeMatch = !selectedSize || variant.size === selectedSize
        const typeMatch = !selectedType || variant.type === selectedType
        
        return colorMatch && sizeMatch && typeMatch && variant.imageUrl
      })

      if (matchingVariant?.imageUrl) {
        targetImage = matchingVariant.imageUrl
      }
    }

    // Si no hay imagen específica de variante, usar imagen del producto
    if (!targetImage && productImages && productImages.length > 0) {
      targetImage = productImages[0]
    }

    // Si no hay imagen del producto, usar la primera variante con imagen
    if (!targetImage) {
      const variantWithImage = variants.find(v => v.imageUrl)
      if (variantWithImage?.imageUrl) {
        targetImage = variantWithImage.imageUrl
      }
    }

    setCurrentImage(targetImage)
  }, [productImages, variants, selectedColor, selectedSize, selectedType])

  return (
    <OptimizedImage
      src={currentImage}
      alt={`${productName}${selectedColor ? ` - ${selectedColor}` : ''}${selectedSize ? ` - ${selectedSize}` : ''}${selectedType ? ` - ${selectedType}` : ''}`}
      fallbackSrc={`/productos/${productName.toLowerCase().replace(/\s+/g, '-')}.jpg`}
      fill
      className={`object-cover transition-all duration-300 ${className}`}
    />
  )
}