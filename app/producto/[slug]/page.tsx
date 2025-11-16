"use client"

import { useState, useMemo, use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SelectCustom } from "@/components/ui/select-custom"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/lib/toast-context"
import { useProductDetail } from "@/hooks/use-product-detail"
import { cleanImageArray, formatPrice } from "@/lib/api"
import { OptimizedImage } from "@/components/optimized-image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart, AlertTriangle, Package } from "lucide-react"

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const resolvedParams = use(params)
  const { product, loading, error } = useProductDetail(resolvedParams.slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showSizeTable, setShowSizeTable] = useState(false)

  // Función para obtener el color hex (puedes expandir esto)
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'Chocolate': '#8B4513',
      'Caramelo': '#CD853F',
      'Negro': '#000000',
      'Roble': '#C4622D',
      'Café': '#8B5A3C',
      'Blanco': '#FFFFFF',
      'Rojo': '#DC2626',
      'Azul': '#2563EB',
      'Verde': '#16A34A'
    }
    return colorMap[colorName] || '#6B7280'
  }

  // Procesar datos del producto
  const productImages = useMemo(() => {
    if (!product) return []
    const mainImages = cleanImageArray(product.images)

    // Agregar imágenes de variantes que tengan imageUrl
    const variantImages = product.variants
      ?.map(v => v.imageUrl)
      .filter((url): url is string => !!url && url.trim() !== '')
      .map(url => url.trim()) || []

    // Combinar imágenes principales con imágenes de variantes, evitando duplicados
    const allImages = [...mainImages]
    variantImages.forEach(img => {
      if (!allImages.includes(img)) {
        allImages.push(img)
      }
    })

    return allImages
  }, [product])

  // Obtener colores únicos de las variantes
  const availableColors = useMemo(() => {
    if (!product?.variants) return []
    const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))]
    return colors.map(color => ({
      name: color!,
      value: getColorHex(color!)
    }))
  }, [product])

  // Obtener tallas únicas de las variantes
  const availableSizes = useMemo(() => {
    if (!product?.variants) return []
    return [...new Set(product.variants.map(v => v.size).filter(Boolean))]
  }, [product])

  // Precio actual basado en variante seleccionada
  const currentPrice = useMemo(() => {
    if (selectedVariant) return selectedVariant.price
    if (product?.minPrice && product?.maxPrice && product.minPrice !== product.maxPrice) {
      return product.minPrice
    }
    return product?.basePrice || 0
  }, [selectedVariant, product])

  // Stock disponible
  const availableStock = useMemo(() => {
    if (selectedVariant) return selectedVariant.stock
    return product?.totalStock || 0
  }, [selectedVariant, product])

  const handleAddToCart = () => {
    if (!product) return

    if (!selectedSize && availableSizes.length > 0) {
      showToast("Por favor selecciona una talla", "error", 3000)
      return
    }

    if (availableStock === 0) {
      showToast("Producto agotado", "error", 3000)
      return
    }

    const variantToAdd = selectedVariant || product.variants.find(v => v.available) || product.variants[0]

    addItem({
      id: product.id,
      name: product.name,
      variantId: variantToAdd?.id || product.id, // Usar el ID de la variante o el del producto como fallback
      price: currentPrice,
      image: productImages[selectedImage] || productImages[0] || `/productos/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      color: variantToAdd?.color || availableColors[0]?.name || "Sin especificar",
    })

    showToast("Producto añadido al carrito", "success", 3000)
  }

  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, availableStock))
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1))

  const handleVariantChange = (color: string, size?: string) => {
    const variant = product?.variants.find(v => {
      const colorMatch = v.color === color
      const sizeMatch = !size || size === '' || v.size === size
      return colorMatch && sizeMatch
    })
    setSelectedVariant(variant || null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B0A]">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA3E11] mb-4"></div>
          <p className="text-white">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0F0B0A]">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Producto no encontrado</h3>
          <p className="text-gray-400 mb-4">{error || 'El producto que buscas no existe'}</p>
          <Link href="/tienda">
            <Button className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white">
              Volver a la tienda
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0B0A]">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white">Inicio</Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link href="/tienda" className="text-gray-400 hover:text-white">Tienda</Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link href="/tienda" className="text-gray-400 hover:text-white">{product.category || 'Productos'}</Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-500">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#1B1715] rounded-lg overflow-hidden">
              {productImages.length > 0 ? (
                <OptimizedImage
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fallbackSrc={`/productos/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-[#1B1715] rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-[#E5AB4A]" : "border-transparent hover:border-gray-700"
                      }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fallbackSrc={`/productos/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Sección principal con fondo gris */}
            <div className="bg-[#1B1715] rounded-lg p-6">
              <h1 className="font-bold mb-4" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '31.9px', lineHeight: '43.2px', color: '#F2E9E4' }}>
                {product.name}
              </h1>

              <div className="mb-8">
                {product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice ? (
                  <p className="font-bold" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '19.4px', lineHeight: '100%', color: '#F0B676' }}>
                    {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
                  </p>
                ) : (
                  <p className="font-bold" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '19.4px', lineHeight: '100%', color: '#F0B676' }}>
                    {formatPrice(currentPrice)}
                  </p>
                )}
                {selectedVariant && selectedVariant.price !== currentPrice && (
                  <p className="text-sm text-gray-400 mt-1">
                    Precio de variante: {formatPrice(selectedVariant.price)}
                  </p>
                )}
              </div>

              {/* Descripción del producto */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Color Selector */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <label className="mb-4 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                    Color de montura
                  </label>
                  <div className="flex gap-2 mb-3">
                    {availableColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleVariantChange(color.name, selectedSize)
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.color === color.name ? "border-[#E5AB4A] scale-105" : "border-gray-700"
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                    Color: {selectedVariant?.color || availableColors[0]?.name || "Sin especificar"}
                  </p>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-baseline gap-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                    <span>Tallas</span>
                    <button
                      onClick={() => setShowSizeTable(true)}
                      className="text-[#C9B8A5] hover:text-[#E5AB4A] transition-colors"
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px' }}
                    >
                      (ver tabla)
                    </button>
                  </div>
                  <SelectCustom
                    name="size"
                    value={selectedSize}
                    onChange={(e) => {
                      setSelectedSize(e.target.value)
                      handleVariantChange(selectedVariant?.color || availableColors[0]?.name || '', e.target.value)
                    }}
                    options={[
                      { value: "", label: "Seleccionar talla" },
                      ...availableSizes.map(size => ({ value: size || "", label: size || "" }))
                    ]}
                  />
                  <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                    Selecciona una talla para ver el rango recomendable.
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="mb-3 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 border border-gray-700 rounded-xl flex items-center justify-center text-white hover:bg-[#2A2421] transition-colors"
                    style={{ backgroundColor: '#2A2421' }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-20 h-10 text-center bg-[#1B1715] border border-gray-700 rounded-xl text-white text-base font-medium"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 border border-gray-700 rounded-xl flex items-center justify-center text-white hover:bg-[#2A2421] transition-colors"
                    style={{ backgroundColor: '#2A2421' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Añadir al carrito
                </Button>
                <Button
                  className="flex-1 hover:bg-[#E5AB4A]/90 py-3 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#E5AB4A', color: '#0F0B0A' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Cotizar
                </Button>
              </div>

              {/* Product Meta */}
              <div className="space-y-1">
                <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                  {selectedVariant?.sku && `SKU: ${selectedVariant.sku} • `}
                  Stock: {availableStock} unidades • Hecho a mano en Colombia
                </p>
                {product.variants.length > 1 && (
                  <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                    {product.variants.length} variantes disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-[#1B1715] rounded-lg p-6">
              <h3 className="font-semibold mb-4" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '16px', color: '#F2E9E4' }}>
                Políticas
              </h3>
              <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', lineHeight: '160%', color: '#C9B8A5' }}>
                <p className="mb-3">
                  Pasados 30 días después de que esté el mantenimiento, pedido o reparación lista no respondemos por ningún artículo.
                </p>
                <p className="mb-3">
                  Para cualquier tipo de pedido personalizado, reparación o mantenimiento debes abonar el 50%. La garantía de cualquier producto (excepto los sombreros) es de 30 días.
                </p>
                <p>
                  Envío: 2-3 días laborales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - Comentado por ahora, se puede implementar después */}
        {/* 
        <div className="mb-4 md:mb-8">
          <h2 className="text-center font-bold mb-8" style={{ fontFamily: 'Inter', fontSize: '24px', color: '#F2E9E4' }}>
            También te puede interesar
          </h2>
          <div className="text-center text-gray-400">
            <p>Productos relacionados próximamente</p>
          </div>
        </div>
        */}
      </div>

      <Footer />

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
