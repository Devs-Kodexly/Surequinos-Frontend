"use client"

import { useState } from 'react'

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

interface VariantSelectorProps {
  variants: Variant[]
  onVariantChange?: (variant: Variant) => void
  onImageChange?: (imageUrl: string | undefined) => void
  className?: string
}

export function VariantSelector({ variants, onVariantChange, onImageChange, className = '' }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find(v => v.available) || variants[0] || null
  )

  // Get unique values for each attribute
  const colors = [...new Set(variants.filter(v => v.color).map(v => v.color))].filter(Boolean)
  const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size))].filter(Boolean)
  const types = [...new Set(variants.filter(v => v.type).map(v => v.type))].filter(Boolean)

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant)
    onVariantChange?.(variant)
    onImageChange?.(variant.imageUrl)
  }

  if (variants.length <= 1) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Colors */}
      {colors.length > 1 && (
        <div>
          <label className="text-muted-foreground text-sm mb-2 block">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const colorVariants = variants.filter(v => v.color === color && v.available)
              const isSelected = selectedVariant?.color === color
              const isAvailable = colorVariants.length > 0
              
              return (
                <button
                  key={color}
                  onClick={() => {
                    if (isAvailable) {
                      handleVariantChange(colorVariants[0])
                    }
                  }}
                  disabled={!isAvailable}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    isSelected
                      ? 'bg-[#E5AB4A] text-[#0F0B0A] border-[#E5AB4A]'
                      : isAvailable
                      ? 'bg-transparent text-foreground border-border hover:border-[#E5AB4A]'
                      : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                  }`}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 1 && (
        <div>
          <label className="text-muted-foreground text-sm mb-2 block">Talla</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const sizeVariants = variants.filter(v => 
                v.size === size && 
                v.available && 
                (!selectedVariant?.color || v.color === selectedVariant.color)
              )
              const isSelected = selectedVariant?.size === size
              const isAvailable = sizeVariants.length > 0
              
              return (
                <button
                  key={size}
                  onClick={() => {
                    if (isAvailable) {
                      handleVariantChange(sizeVariants[0])
                    }
                  }}
                  disabled={!isAvailable}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    isSelected
                      ? 'bg-[#E5AB4A] text-[#0F0B0A] border-[#E5AB4A]'
                      : isAvailable
                      ? 'bg-transparent text-foreground border-border hover:border-[#E5AB4A]'
                      : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Types */}
      {types.length > 1 && (
        <div>
          <label className="text-muted-foreground text-sm mb-2 block">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {types.map(type => {
              const typeVariants = variants.filter(v => 
                v.type === type && 
                v.available &&
                (!selectedVariant?.color || v.color === selectedVariant.color) &&
                (!selectedVariant?.size || v.size === selectedVariant.size)
              )
              const isSelected = selectedVariant?.type === type
              const isAvailable = typeVariants.length > 0
              
              return (
                <button
                  key={type}
                  onClick={() => {
                    if (isAvailable) {
                      handleVariantChange(typeVariants[0])
                    }
                  }}
                  disabled={!isAvailable}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    isSelected
                      ? 'bg-[#E5AB4A] text-[#0F0B0A] border-[#E5AB4A]'
                      : isAvailable
                      ? 'bg-transparent text-foreground border-border hover:border-[#E5AB4A]'
                      : 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected variant info */}
      {selectedVariant && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SKU: {selectedVariant.sku}</span>
            <span className={`font-medium ${selectedVariant.available ? 'text-green-600' : 'text-red-600'}`}>
              {selectedVariant.available ? `${selectedVariant.stock} disponibles` : 'Agotado'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}