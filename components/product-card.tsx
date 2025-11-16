"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/optimized-image"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/lib/toast-context"
import { ChevronDown } from "lucide-react"
import { cleanImageArray, cleanImageUrl, formatPrice } from "@/lib/api"

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: string
  priceNumber: number
  originalPrice?: string
  discount?: string
  stock?: string
  badge?: string
  hasStyleSelector?: boolean
  image?: string | string[]
  // New props for real data
  slug?: string
  variants?: Array<{
    id: string
    sku: string
    color?: string
    size?: string
    price: number
    stock: number
    imageUrl?: string
    available: boolean
  }>
  category?: string
  totalStock?: number
  hasStock?: boolean
  // Sale product props
  isSaleProduct?: boolean
  preselectedSize?: string
  preselectedColor?: string
}

export function ProductCard({
  id,
  title,
  description,
  price,
  priceNumber,
  originalPrice,
  discount,
  stock,
  badge,
  hasStyleSelector,
  image,
  slug,
  variants = [],
  category,
  totalStock,
  hasStock,
  isSaleProduct = false,
  preselectedSize,
  preselectedColor,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()

  // Procesar imágenes del backend
  const productImages = cleanImageArray(image)

  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Lógica del backend para precios y variantes
  const currentPrice = selectedVariant ? selectedVariant.price : priceNumber
  const displayPrice = selectedVariant
    ? formatPrice(selectedVariant.price)
    : price

  // Determinar la imagen actual a mostrar
  // Prioridad: 1) Imagen de variante seleccionada, 2) Imagen de portada del producto
  const currentImage = useMemo(() => {
    if (selectedVariant?.imageUrl) {
      return cleanImageUrl(selectedVariant.imageUrl)
    }
    // Mostrar siempre la imagen de portada del producto cuando no hay variante seleccionada
    return productImages[0] || `/productos/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
  }, [selectedVariant, productImages, title])

  // Todas las imágenes disponibles para navegación (solo imágenes del producto)
  const allImages = productImages

  // Estados para talla y color
  const [selectedSize, setSelectedSize] = useState<string>(preselectedSize || "")
  const [selectedColor, setSelectedColor] = useState<string>(preselectedColor || "")
  const [showSizeTable, setShowSizeTable] = useState(false)

  // Extraer colores únicos de las variantes del backend
  // Si hay talla seleccionada, filtrar solo los colores disponibles para esa talla
  const availableColors = useMemo(() => {
    const uniqueColors = new Set<string>()
    variants.forEach(variant => {
      // Si hay talla seleccionada, solo mostrar colores de esa talla
      if (selectedSize && variant.size !== selectedSize) {
        return
      }
      if (variant.color) {
        uniqueColors.add(variant.color)
      }
    })
    
    // Mapeo de colores a valores hexadecimales
    const colorMap: Record<string, string> = {
      "Roble": "#C4622D",
      "Café": "#8B5A3C",
      "Chocolate": "#8B5A3C",
      "Negro": "#1A1A1A",
      "Blanco": "#F5F5F5",
      "Rojo": "#DC2626",
      "Azul": "#2563EB",
      "Verde": "#16A34A",
      "Amarillo": "#EAB308",
      "Naranja": "#EA580C",
      "Gris": "#6B7280",
      "Marrón": "#92400E",
    }
    
    return Array.from(uniqueColors).map(color => ({
      name: color,
      hex: colorMap[color] || "#6B7280" // Color gris por defecto si no está en el mapa
    }))
  }, [variants, selectedSize])
  
  // Verificar disponibilidad de cada color
  const getColorAvailability = (colorName: string) => {
    return variants.some(v => {
      const sizeMatch = !selectedSize || v.size === selectedSize
      return v.color === colorName && sizeMatch && v.available
    })
  }

  // Extraer todas las tallas únicas de las variantes del backend
  // Si hay un color seleccionado, filtrar solo las tallas disponibles para ese color
  const allSizes = useMemo(() => {
    const uniqueSizes = new Set<string>()
    variants.forEach(variant => {
      // Si hay color seleccionado, solo mostrar tallas de ese color
      if (selectedColor && variant.color !== selectedColor) {
        return
      }
      if (variant.size) {
        uniqueSizes.add(variant.size)
      }
    })
    return Array.from(uniqueSizes).sort((a, b) => {
      // Ordenar numéricamente si son tallas con pulgadas
      const numA = parseFloat(a.replace(/[^0-9.]/g, ''))
      const numB = parseFloat(b.replace(/[^0-9.]/g, ''))
      return numA - numB
    })
  }, [variants, selectedColor])

  // Verificar disponibilidad de cada talla
  const getSizeAvailability = (size: string) => {
    const hasAvailable = variants.some(v => {
      const colorMatch = !selectedColor || v.color === selectedColor
      const isAvailable = v.size === size && colorMatch && v.available
      return isAvailable
    })
    return hasAvailable
  }



  // Efecto para resetear selecciones cuando cambian los filtros
  useEffect(() => {
    // Si se selecciona un color, verificar si la talla sigue disponible
    if (selectedColor) {
      const sizeAvailable = variants.some(v => 
        v.color === selectedColor && v.size === selectedSize && v.available
      )
      if (!sizeAvailable && selectedSize) {
        setSelectedSize("")
      }
    }
    
    // Si se selecciona una talla, verificar si el color sigue disponible
    if (selectedSize) {
      const colorAvailable = variants.some(v => 
        v.size === selectedSize && v.color === selectedColor && v.available
      )
      if (!colorAvailable && selectedColor) {
        setSelectedColor("")
      }
    }
  }, [selectedColor, selectedSize, variants])

  // Efecto para actualizar la variante seleccionada cuando cambian color o talla
  useEffect(() => {
    if (variants.length === 0) return

    // Si no hay ninguna selección, no mostrar variante
    if (!selectedColor && !selectedSize) {
      setSelectedVariant(null)
      return
    }

    // Buscar variante que coincida con las selecciones actuales
    const matchingVariant = variants.find(v => {
      const colorMatch = !selectedColor || v.color === selectedColor
      const sizeMatch = !selectedSize || v.size === selectedSize
      return colorMatch && sizeMatch && v.available
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    } else {
      // Si no hay coincidencia exacta, buscar la primera disponible con al menos un atributo coincidente
      const partialMatch = variants.find(v => {
        const hasMatch = 
          (selectedColor && v.color === selectedColor) ||
          (selectedSize && v.size === selectedSize)
        return hasMatch && v.available
      })
      setSelectedVariant(partialMatch || null)
    }
  }, [selectedColor, selectedSize, variants])

  // Inicializar selecciones SOLO si hay preselección (para productos de oferta)
  useEffect(() => {
    if (variants.length > 0 && (preselectedColor || preselectedSize)) {
      if (preselectedColor) setSelectedColor(preselectedColor)
      if (preselectedSize) setSelectedSize(preselectedSize)
    }
  }, [variants, preselectedColor, preselectedSize])

  const handleAddToCart = () => {
    // Usar variante seleccionada o la primera disponible
    const variantToAdd = selectedVariant || variants.find(v => v.available) || variants[0]

    // Validar que existe una variante
    if (!variantToAdd || !variantToAdd.id) {
      showToast("Por favor selecciona una variante del producto", "error", 3000)
      return
    }

    // Validar que la variante esté disponible
    if (!variantToAdd.available) {
      showToast("Esta variante no está disponible", "error", 3000)
      return
    }

    addItem({
      id: variantToAdd.id, // Usar el variantId como id para compatibilidad
      variantId: variantToAdd.id, // ID de la variante
      name: title,
      price: currentPrice,
      image: currentImage || `/productos/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      color: variantToAdd?.color || selectedColor || "Sin especificar",
      size: variantToAdd?.size,
    })

    // Mostrar notificación de éxito
    showToast("Producto añadido correctamente", "success", 3000)
  }

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
  }

  const nextImage = () => {
    if (allImages.length > 1 && !isTransitioning && !selectedVariant) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 100)
    }
  }

  const prevImage = () => {
    if (allImages.length > 1 && !isTransitioning && !selectedVariant) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 100)
    }
  }

  // Determine stock display
  const getStockDisplay = () => {
    if (totalStock !== undefined) {
      if (totalStock === 0) return "Agotado"
      if (totalStock <= 3) return `Últimas ${totalStock}`
      return `${totalStock} disponibles`
    }
    return stock
  }

  // Determine badge display
  const getBadge = () => {
    if (badge) return badge
    if (totalStock === 0) return "Agotado"
    if (variants.length > 5) return "Múltiples opciones"
    if (hasStock && totalStock && totalStock <= 3) return "Pocas unidades"
    return undefined
  }

  return (
    <div className="bg-[#1B1715] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-muted group">

        <OptimizedImage
          src={currentImage}
          alt={title}
          fallbackSrc={`/productos/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`}
          fill
          className={`object-cover transition-opacity duration-200 ease-out ${isTransitioning ? 'opacity-90' : 'opacity-100'
            }`}
        />

        {/* Navigation arrows - subtle and discrete */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center z-20"
              aria-label="Imagen anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center z-20"
              aria-label="Siguiente imagen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image indicator dots - elegant design */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index)
                  setSelectedVariant(null)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ease-out hover:scale-125 ${currentImageIndex === index
                  ? 'bg-[#E5AB4A] shadow-lg scale-110'
                  : 'bg-white/70 hover:bg-[#E5AB4A]/70 shadow-md'
                  }`}
              />
            ))}
          </div>
        )}


      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          {/* Título del producto */}
          <h3 className="text-[#F2E9E4] font-bold text-[19.6px] leading-[26.4px] mb-2" style={{ fontFamily: 'Inter' }}>
            {title}
          </h3>

          {/* Descripción del producto - altura fija con 2 líneas */}
          <p className="text-[#D9C9B7] font-normal text-[14.9px] leading-[100%] mb-4 line-clamp-2" style={{ fontFamily: 'Inter' }}>
            {description}
          </p>

          {/* Precio */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[#F0B676] font-bold text-[17.7px] leading-[100%]" style={{ fontFamily: 'Inter' }}>
              {displayPrice}
            </span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        {/* Selector de Tallas */}
        {allSizes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-[#C9B8A5] font-normal text-[12px] leading-[100%]" style={{ fontFamily: 'Inter' }}>
                Tallas
              </label>
              {!isSaleProduct && (
                <button
                  onClick={() => setShowSizeTable(true)}
                  className="text-[#C9B8A5] hover:text-[#E5AB4A] font-normal text-[12px] leading-[100%] transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  (Ver tabla)
                </button>
              )}
            </div>
            {isSaleProduct ? (
              // Mostrar talla preseleccionada sin permitir cambios
              <div className="w-full bg-[#2A2420]/50 border border-gray-700/50 rounded-lg px-4 py-3 text-gray-400 text-sm cursor-not-allowed">
                {selectedSize || "No especificada"}
              </div>
            ) : (
              // Selector normal para productos de tienda
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-[#2A2420] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-gray-300 text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#AA3E11] transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  <option value="">Seleccionar talla</option>
                  {allSizes.map((size) => {
                    const isAvailable = getSizeAvailability(size)
                    return (
                      <option 
                        key={size} 
                        value={size} 
                        className="bg-[#2A2420]"
                        disabled={!isAvailable}
                      >
                        {size} {!isAvailable ? '(Agotado)' : ''}
                      </option>
                    )
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

          </div>
        )}

        {/* Selector de Color */}
        {availableColors.length > 0 && (
          <div className="mb-4">
            <label className="text-[#C9B8A5] font-normal text-[12px] leading-[100%] mb-3 block" style={{ fontFamily: 'Inter' }}>
              <span className="text-[#C9B8A5]">Color:</span>{selectedColor && <span className="text-white ml-1">{selectedColor}</span>}
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => {
                const hasStock = isSaleProduct ? selectedColor === color.name : getColorAvailability(color.name)
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      if (!isSaleProduct && hasStock) {
                        setSelectedColor(color.name)
                        // Buscar una variante con este color para mostrar su imagen
                        const variantWithColor = variants.find(v => {
                          const sizeMatch = !selectedSize || v.size === selectedSize
                          return v.color === color.name && sizeMatch && v.available
                        })
                        if (variantWithColor) {
                          setSelectedVariant(variantWithColor)
                        }
                      }
                    }}
                    disabled={isSaleProduct || !hasStock}
                    className={`w-7 h-7 rounded-full transition-all duration-200 border-2 ${
                      selectedColor === color.name
                        ? 'ring-2 ring-[#AA3E11] ring-offset-2 ring-offset-[#1B1715] border-white'
                        : hasStock 
                          ? 'hover:scale-105 border-gray-600 hover:border-white' 
                          : 'opacity-30 cursor-not-allowed border-gray-700'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Color ${color.name}`}
                    title={`${color.name}${!hasStock ? ' (Agotado)' : ''}`}
                  />
                )
              })}
            </div>
          </div>
        )}





        {/* Botones */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            onClick={handleAddToCart}
            disabled={totalStock === 0}
            className="flex-1 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 md:py-6 font-medium"
          >
            {totalStock === 0 ? "AGOTADO" : "Añadir"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#C0763A] text-[#C0763A] hover:bg-[#C0763A] hover:text-[#0F0B0A] bg-transparent rounded-lg py-3 md:py-6 font-medium"
            onClick={() => window.location.href = `/producto/${slug || id}`}
          >
            Detalles
          </Button>
        </div>
      </div>

      {/* Modal de tabla de tallas */}
      {showSizeTable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={() => setShowSizeTable(false)}
        >
          <div
            className="bg-[#1B1715] rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Inter' }}>
                Tabla de tallas
              </h2>
              <button
                onClick={() => setShowSizeTable(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm md:text-base" style={{ fontFamily: 'Inter' }}>
                      Silla (pulgadas)
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm md:text-base" style={{ fontFamily: 'Inter' }}>
                      Talla recomendada
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>12"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>20–22</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>13"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>24–26</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>14"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>28–30</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>15"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>32–34</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>16"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>36–38</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-white text-base md:text-lg" style={{ fontFamily: 'Inter' }}>17"</td>
                    <td className="py-4 px-4 text-gray-300 text-base md:text-lg" style={{ fontFamily: 'Inter' }}>40–42</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
