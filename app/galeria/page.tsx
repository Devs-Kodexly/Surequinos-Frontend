"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { OptimizedImage } from "@/components/optimized-image"

// Datos de la galería con hotspots
const GALLERY_ITEMS = [
  {
    id: "1",
    title: "Pieza de prueba",
    category: "Sillas",
    subcategory: "Artesanal",
    image: "/caballo1.webp",
    hotspots: [
      {
        id: "h1",
        x: 56,
        y: 36, // Porcentaje desde arriba
        productName: "Silla de Trocha",
        productDescription: "Silla de trocha con herrajes de primera, cuero seleccionado y acabado a mano.",
        productPrice: "$1.800.000",
        productImage: "/silla-de-montar-artesanal-.jpg"
      },
      {
        id: "h2",
        x: 35,
        y: 33,
        productName: "Riendas de cuero",
        productDescription: "Riendas artesanales en cuero natural de alta calidad.",
        productPrice: "$250.000",
        productImage: "/apero.jpg"
      }
    ]
  },
]

const CATEGORIES = ["Todo", "Sillas", "Aperos", "Accesorios", "Proceso"]

export default function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  // Filtrar items
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 0 || item.category === CATEGORIES[activeCategory]
    const matchesSearch = searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0F0B0A]">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-[#0F0B0A]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Inter' }}>
              Nuestra Galería
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl" style={{ fontFamily: 'Inter' }}>
              Piezas a medida, procesos y detalles artesanales. Explora por categoría y descubre nuestro oficio.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(i)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${i === activeCategory
                    ? "bg-[#AA3E11] text-white"
                    : "bg-transparent border border-gray-700 text-gray-400 hover:border-[#AA3E11] hover:text-white"
                    }`}
                  style={{ fontFamily: 'Inter' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full md:w-80 md:ml-auto">
              <div className="relative">
                <Input
                  placeholder="Buscar por nombre o estilo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1A1614] border-gray-800 pr-10 text-white placeholder:text-gray-600"
                  style={{ fontFamily: 'Inter' }}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.image)}
                className="group relative aspect-[4/3] bg-[#1A1614] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#AA3E11] transition-all duration-300"
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter' }}>
                      {item.category} • {item.subcategory}
                    </p>
                    <h3 className="text-white text-xl font-semibold" style={{ fontFamily: 'Inter' }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg" style={{ fontFamily: 'Inter' }}>
                No se encontraron resultados para tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de imagen HD */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen en tamaño real con hotspots */}
            <div
              className="relative mb-4"
              onClick={() => setActiveHotspot(null)}
            >
              <img
                src={selectedImage}
                alt="Imagen en HD"
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                id="modal-image"
              />

              {/* Hotspots sobre la imagen */}
              {filteredItems.find(item => item.image === selectedImage)?.hotspots?.map((hotspot) => (
                <div key={hotspot.id}>
                  {/* Botón del hotspot con doble círculo */}
                  <button
                    className="absolute flex items-center justify-center z-10 transition-all duration-200 hover:scale-110"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
                    }}
                    onMouseEnter={() => setActiveHotspot(hotspot.id)}
                  >
                    {/* Círculo exterior transparente - más pequeño en móvil */}
                    <div className="absolute w-9 h-9 md:w-12 md:h-12 bg-gray-500/30 rounded-full"></div>
                    {/* Círculo interior oscuro con el + - más pequeño en móvil */}
                    <div className="relative w-5 h-5 md:w-7 md:h-7 bg-gray-600/85 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs md:text-sm">+</span>
                    </div>
                  </button>

                  {/* Popup de información del producto - responsive */}
                  {activeHotspot === hotspot.id && (
                    <div
                      className="absolute bg-white rounded-lg shadow-2xl p-3 md:p-5 z-20 animate-in fade-in duration-200"
                      style={{
                        // Móvil: arriba y centrado, Desktop: al lado
                        left: window.innerWidth < 768 ? '50%' : (hotspot.x > 50 ? 'auto' : `${hotspot.x}%`),
                        right: window.innerWidth >= 768 && hotspot.x > 50 ? `${100 - hotspot.x}%` : 'auto',
                        top: `${hotspot.y}%`,
                        transform: window.innerWidth < 768
                          ? 'translate(-50%, calc(-100% - 20px))'
                          : (hotspot.x > 50 ? 'translate(-30px, -50%)' : 'translate(30px, -50%)'),
                        width: window.innerWidth < 768 ? 'calc(100vw - 2rem)' : '380px',
                        maxWidth: window.innerWidth < 768 ? '320px' : 'none'
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseLeave={() => setActiveHotspot(null)}
                    >
                      <div className="flex gap-3 md:gap-4">
                        {/* Imagen */}
                        <img
                          src={hotspot.productImage}
                          alt={hotspot.productName}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        {/* Contenido a la derecha */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="text-black font-bold text-sm md:text-base mb-1 line-clamp-2" style={{ fontFamily: 'Inter' }}>
                              {hotspot.productName}
                            </h3>
                            <p className="text-gray-600 text-xs line-clamp-2" style={{ fontFamily: 'Inter' }}>
                              {hotspot.productDescription}
                            </p>
                          </div>
                          {/* Botón Cotizar */}
                          <button
                            className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors self-start mt-2"
                            style={{ fontFamily: 'Inter' }}
                            onClick={() => window.location.href = '/contacto'}
                          >
                            Cotizar
                          </button>
                        </div>
                      </div>
                      {/* Flecha - responsive según dispositivo */}
                      <div
                        className={`absolute w-0 h-0 ${window.innerWidth < 768
                          ? 'left-1/2 bottom-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white'
                          : hotspot.x > 50
                            ? 'right-0 top-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white'
                            : 'left-0 top-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white'
                          }`}
                        style={{
                          transform: window.innerWidth < 768
                            ? 'translate(-50%, 100%)'
                            : (hotspot.x > 50 ? 'translate(100%, -50%)' : 'translate(-100%, -50%)')
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Información y botón de cotizar - mismo ancho que la imagen */}
            <div className="bg-[#1A1614] rounded-lg px-6 py-3 flex items-center justify-between gap-6 w-full">
              <div className="flex-1">
                <h2 className="text-white text-lg font-bold mb-1" style={{ fontFamily: 'Inter' }}>
                  {filteredItems.find(item => item.image === selectedImage)?.title || "Pieza artesanal"}
                </h2>
                <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter' }}>
                  Silla de trocha con herrajes de primera, cuero seleccionado y acabado a mano.
                </p>
              </div>
              <button
                className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                style={{ fontFamily: 'Inter' }}
                onClick={() => {
                  window.location.href = '/contacto'
                }}
              >
                Cotizar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
