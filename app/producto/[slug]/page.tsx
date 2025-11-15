"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SelectCustom } from "@/components/ui/select-custom"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/lib/toast-context"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart } from "lucide-react"

// Producto hardcodeado de ejemplo
const PRODUCT = {
  id: "1",
  name: "Tereque Tronador Cabalgata",
  price: 1484900,
  images: [
    "/silla-de-paso-negra.jpg",
    "/silla-de-montar-artesanal-.jpg",
    "/silla-de-montar-artesanal-colombiana-.jpg",
    "/Talabarteria-montura.webp",
  ],
  colors: [
    { name: "Chocolate", value: "#8B4513" },
    { name: "Caramelo", value: "#CD853F" },
    { name: "Negro", value: "#000000" },
  ],
  sizes: ["Pequeña", "Mediana", "Grande"],
  sku: "SQ-TRONADOR",
  stock: 3,
  madeIn: "Colombia",
  description: "Tereque artesanal de alta calidad, hecho a mano con cuero premium.",
  policies: "Pasados 30 días después de que esté el mantenimiento, pedido o reparación lista no respondemos por ningún artículo. Para cualquier tipo de pedido personalizado, reparación o mantenimiento debes abonar el 50%. La garantía de cualquier producto (excepto los sombreros) es de 30 días. Envío: 2-3 días laborales",
}

// Productos relacionados hardcodeados
const RELATED_PRODUCTS = [
  {
    id: "2",
    name: "Silla de Paso",
    price: 1950000,
    image: "/silla-de-paso-negra.jpg",
  },
  {
    id: "3",
    name: "Aperos & Jáquimones",
    price: 350000,
    image: "/apero.jpg",
  },
  {
    id: "4",
    name: "Riendas cuero natural",
    price: 180000,
    image: "/silla-de-montar-artesanal-.jpg",
  },
  {
    id: "5",
    name: "Montura Tradicional",
    price: 390000,
    image: "/Talabarteria-montura.webp",
  },
]

export default function ProductDetailPage() {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showSizeTable, setShowSizeTable] = useState(false)

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString("es-CO")}`
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Por favor selecciona una talla", "error", 3000)
      return
    }

    // Para productos hardcodeados sin variantes reales, crear un variantId único
    // basado en el producto, color y talla seleccionados
    const variantId = `${PRODUCT.id}-${PRODUCT.colors[selectedColor].name}-${selectedSize}`

    addItem({
      id: variantId, // Usar variantId como id para compatibilidad
      variantId: variantId, // ID único de la variante (producto + color + talla)
      name: PRODUCT.name,
      price: PRODUCT.price,
      image: PRODUCT.images[selectedImage],
      color: PRODUCT.colors[selectedColor].name,
    })

    showToast("Producto añadido al carrito", "success", 3000)
  }

  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, PRODUCT.stock))
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1))

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
          <Link href="/tienda" className="text-gray-400 hover:text-white">Sillas</Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-500">{PRODUCT.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#1B1715] rounded-lg overflow-hidden">
              <Image
                src={PRODUCT.images[selectedImage]}
                alt={PRODUCT.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-[#1B1715] rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-[#E5AB4A]" : "border-transparent hover:border-gray-700"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${PRODUCT.name} ${idx + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Sección principal con fondo gris */}
            <div className="bg-[#1B1715] rounded-lg p-6">
              <h1 className="font-bold mb-4" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '31.9px', lineHeight: '43.2px', color: '#F2E9E4' }}>
                {PRODUCT.name}
              </h1>

              <p className="font-bold mb-8" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '19.4px', lineHeight: '100%', color: '#F0B676' }}>
                {formatPrice(PRODUCT.price)}
              </p>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="mb-4 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                Color de montura
              </label>
              <div className="flex gap-2 mb-3">
                {PRODUCT.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === idx ? "border-[#E5AB4A] scale-105" : "border-gray-700"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                Color: {PRODUCT.colors[selectedColor].name}
              </p>
            </div>

            {/* Size Selector */}
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
                onChange={(e) => setSelectedSize(e.target.value)}
                options={[
                  { value: "", label: "Seleccionar talla" },
                  ...PRODUCT.sizes.map(size => ({ value: size, label: size }))
                ]}
              />
              <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.8px', lineHeight: '100%', color: '#C9B8A5' }}>
                Selecciona una talla para ver el rango recomendable.
              </p>
            </div>

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
                  SKU: {PRODUCT.sku} • Stock: {PRODUCT.stock} unidades • Hecho a mano en {PRODUCT.madeIn}
                </p>
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

        {/* Related Products */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-center font-bold mb-8" style={{ fontFamily: 'Inter', fontSize: '24px', color: '#F2E9E4' }}>
            También te puede interesar
          </h2>
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {RELATED_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-[#1B1715] rounded-lg overflow-hidden" style={{ width: '200px', flexShrink: 0 }}>
                  <Link href={`/producto/${product.id}`} className="block aspect-square relative cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="p-3">
                    <h3 className="text-white text-xs mb-1.5 line-clamp-2">{product.name}</h3>
                    <p className="text-[#E5AB4A] font-semibold text-sm mb-2">{formatPrice(product.price)}</p>
                    <div className="flex flex-col gap-1.5">
                      <Button size="sm" variant="outline" className="w-full text-xs py-1.5 border-gray-700 text-gray-400">
                        Añadir
                      </Button>
                      <Link href={`/producto/${product.id}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs py-1.5 border-[#E5AB4A] text-[#E5AB4A]">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {RELATED_PRODUCTS.map((product) => (
              <div key={product.id} className="bg-[#1B1715] rounded-lg overflow-hidden">
                <Link href={`/producto/${product.id}`} className="block aspect-square relative cursor-pointer">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-white text-sm mb-2">{product.name}</h3>
                  <p className="text-[#E5AB4A] font-semibold mb-3">{formatPrice(product.price)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-gray-700 text-gray-400">
                      Añadir
                    </Button>
                    <Link href={`/producto/${product.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full text-xs border-[#E5AB4A] text-[#E5AB4A]">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
