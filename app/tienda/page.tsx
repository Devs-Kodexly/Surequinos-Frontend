"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { MobileFilter } from "@/components/mobile-filter"
import { Search, Package } from "lucide-react"
import { useState, useMemo } from "react"
// import { useShop } from "@/hooks/use-shop"
// import { formatPrice } from "@/lib/api"

// Productos hardcodeados con imágenes de public
const HARDCODED_PRODUCTS = [
  {
    id: "1",
    title: "Silla de Montar Artesanal",
    description: "Silla de montar hecha a mano con cuero de alta calidad",
    price: "$450.000",
    priceNumber: 450000,
    image: "/silla-de-montar-artesanal-.jpg",
    category: "Monturas",
    stock: "5 disponibles",
    hasStock: true,
    totalStock: 5,
  },
  {
    id: "2",
    title: "Silla de Montar Colombiana",
    description: "Diseño tradicional colombiano con acabados premium",
    price: "$520.000",
    priceNumber: 520000,
    image: "/silla-de-montar-artesanal-colombiana-.jpg",
    category: "Monturas",
    stock: "3 disponibles",
    hasStock: true,
    totalStock: 3,
  },
  {
    id: "3",
    title: "Silla de Paso Negra",
    description: "Elegante silla de paso en cuero negro",
    price: "$480.000",
    priceNumber: 480000,
    image: "/silla-de-paso-negra.jpg",
    category: "Monturas",
    stock: "4 disponibles",
    hasStock: true,
    totalStock: 4,
  },
  {
    id: "4",
    title: "Montura Tradicional",
    description: "Montura artesanal con diseño clásico",
    price: "$390.000",
    priceNumber: 390000,
    image: "/Talabarteria-montura.webp",
    category: "Monturas",
    stock: "6 disponibles",
    hasStock: true,
    totalStock: 6,
  },
  {
    id: "5",
    title: "Apero Artesanal",
    description: "Apero de cuero trabajado a mano",
    price: "$180.000",
    priceNumber: 180000,
    image: "/apero.jpg",
    category: "Accesorios",
    stock: "8 disponibles",
    hasStock: true,
    totalStock: 8,
  },
  {
    id: "6",
    title: "Set de Talabartería",
    description: "Conjunto completo de accesorios de talabartería",
    price: "$650.000",
    priceNumber: 650000,
    image: "/talabarteria2.jpeg",
    category: "Sets",
    stock: "2 disponibles",
    hasStock: true,
    totalStock: 2,
  },
]

const CATEGORIES = ["Todos", "Monturas", "Accesorios", "Sets"]

export default function TiendaPage() {
  // COMENTADO: Lógica del backend
  // const {
  //   products,
  //   categoryOptions,
  //   loading,
  //   error,
  //   searchTerm,
  //   setSearchTerm,
  //   activeCategory,
  //   setActiveCategory,
  // } = useShop()

  // Estado local para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)

  // Filtrar productos hardcodeados
  const filteredProducts = useMemo(() => {
    let filtered = HARDCODED_PRODUCTS

    // Filtrar por categoría
    if (activeCategory > 0) {
      const selectedCategory = CATEGORIES[activeCategory]
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [searchTerm, activeCategory])

  const products = filteredProducts
  const categoryOptions = CATEGORIES
  const loading = false
  const error = null

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-title text-[#AA3E11] mb-4">Nuestra Tienda</h1>
            <p className="text-body text-black max-w-2xl mx-auto">
              Piezas únicas hechas a mano con dedicación y creatividad artesanal
            </p>
          </div>

          {/* Mobile Layout - Stack vertically */}
          <div className="md:hidden space-y-4">
            {/* Mobile Filter Dropdown */}
            <MobileFilter
              categories={categoryOptions}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            {/* Mobile Search */}
            <div className="w-full">
              <div className="relative">
                <Input
                  placeholder="Buscar producto, color, talla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border-black/20 pr-10 text-black placeholder:text-black/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Everything in same line */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop Filters */}
            {categoryOptions.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${i === activeCategory
                    ? "bg-[#AA3E11] text-white"
                    : "bg-white text-black border border-black/20 hover:border-[#AA3E11]"
                  }`}
              >
                {cat}
              </button>
            ))}

            {/* Desktop Search - Larger size */}
            <div className="w-96 ml-4">
              <div className="relative">
                <Input
                  placeholder="Buscar producto, color, talla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border-black/20 pr-10 text-black placeholder:text-black/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          {/* COMENTADO: Loading State */}
          {/* {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA3E11] mb-4"></div>
              <p className="text-black/70">Cargando productos...</p>
            </div>
          )} */}

          {/* COMENTADO: Error State */}
          {/* {error && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">Error cargando productos</h3>
              <p className="text-black/70 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-2 rounded-lg"
              >
                Reintentar
              </button>
            </div>
          )} */}

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-black/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </h3>
              <p className="text-black/70">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda o cambia la categoría' 
                  : 'Pronto tendremos productos disponibles'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory(0)
                  }}
                  className="mt-4 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-2 rounded-lg"
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <>
              <div className="mb-6 text-center">
                <p className="text-black/70">
                  {searchTerm || activeCategory > 0 
                    ? `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`
                    : `${products.length} producto${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  // COMENTADO: Lógica del backend
                  // const priceDisplay = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
                  //   ? `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
                  //   : formatPrice(product.minPrice || product.basePrice)

                  return (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      priceNumber={product.priceNumber}
                      image={product.image}
                      category={product.category}
                      totalStock={product.totalStock}
                      hasStock={product.hasStock}
                      stock={product.stock}
                      // COMENTADO: Props del backend
                      // slug={product.slug}
                      // variants={product.variants}
                      // hasStyleSelector={product.variants.length > 1}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
