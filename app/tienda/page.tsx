"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { MobileFilter } from "@/components/mobile-filter"
import { Search, Package, AlertTriangle } from "lucide-react"
import { useShop } from "@/hooks/use-shop"
import { formatPrice } from "@/lib/api"

export default function TiendaPage() {
  const {
    products,
    categoryOptions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
  } = useShop()

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
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA3E11] mb-4"></div>
              <p className="text-black/70">Cargando productos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
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
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
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
          {!loading && !error && products.length > 0 && (
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
                  // Calcular precio para mostrar
                  const priceDisplay = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
                    ? `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
                    : formatPrice(product.minPrice || product.basePrice)

                  return (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      description={product.description || ""}
                      price={priceDisplay}
                      priceNumber={product.minPrice || product.basePrice}
                      image={product.images}
                      category={product.category}
                      totalStock={product.totalStock}
                      hasStock={product.hasStock}
                      slug={product.slug}
                      variants={product.variants}
                      hasStyleSelector={product.variants && product.variants.length > 1}
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
