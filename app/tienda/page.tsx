"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { MobileFilter } from "@/components/mobile-filter"
import { Search } from "lucide-react"

export default function TiendaPage() {
  const categories = ["Todos", "Línea de pista", "Sillas y Tereques", "Aperos y Jaquimonas", "Accesorios", "Sombreros"]
  const [activeCategory, setActiveCategory] = useState(0)

  const products = [
    {
      id: "1",
      title: "Silla de Montar Artesanal",
      description: "Silla de montar tradicional colombiana con acabados de lujo y herrajes de primera calidad.",
      price: "$ 2.200.000",
      priceNumber: 2200000,
      badge: "Nuevo",
      hasStyleSelector: true,
      image: "/silla-de-montar-artesanal-.jpg"
    },
    {
      id: "2",
      title: "Silla de Paso Negra",
      description: "Elegante silla de paso en cuero negro con detalles artesanales únicos.",
      price: "$ 1.950.000",
      priceNumber: 1950000,
      badge: "Popular",
      hasStyleSelector: true,
      image: "/silla-de-paso-negra.jpg"
    },
    {
      id: "3",
      title: "Silla Artesanal Colombiana",
      description: "Silla de montar con diseño tradicional colombiano y materiales premium.",
      price: "$ 2.100.000",
      priceNumber: 2100000,
      originalPrice: "$ 2.400.000",
      discount: "-12%",
      hasStyleSelector: true,
      image: "/silla-de-montar-artesanal-colombiana-.jpg"
    },
    {
      id: "4",
      title: "Apero Tradicional",
      description: "Apero completo con acabados artesanales y herrajes de bronce.",
      price: "$ 850.000",
      priceNumber: 850000,
      stock: "Últimas 3",
      hasStyleSelector: false,
      image: "/apero.jpg"
    },
    {
      id: "5",
      title: "Tereco de Lujo Premium",
      description: "Tereco tradicional colombiano con herrajes de primera calidad y cuero selecto.",
      price: "$ 1.800.000",
      priceNumber: 1800000,
      badge: "Exclusivo",
      hasStyleSelector: true,
      image: "/Talabarteria-montura.webp"
    },
    {
      id: "6",
      title: "Silla de Montar Clásica",
      description: "Diseño clásico con técnicas tradicionales y materiales de alta calidad.",
      price: "$ 1.750.000",
      priceNumber: 1750000,
      hasStyleSelector: true,
      image: "/silla-de-montar-artesanal-.jpg"
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-title text-[#AA3E11] mb-4">Nuestra Tienda</h1>
            <p className="text-body text-black max-w-2xl mx-auto">
              Explora nuestra tienda y encuentra piezas únicas, hechas a mano con dedicación y creatividad
            </p>
          </div>

          {/* Mobile Layout - Stack vertically */}
          <div className="md:hidden space-y-4">
            {/* Mobile Filter Dropdown */}
            <MobileFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            {/* Mobile Search */}
            <div className="w-full">
              <div className="relative">
                <Input
                  placeholder="Buscar producto..."
                  className="bg-white border-black/20 pr-10 text-black placeholder:text-black/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50" />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Everything in same line */}
          <div className="hidden md:flex items-center gap-3">
            {/* Desktop Filters */}
            {categories.map((cat, i) => (
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
                  placeholder="Buscar producto..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
