import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"

export default function SalePage() {
  const products = [
    {
      id: "1",
      title: "Silla de Trocha – Temporada",
      description: "Silla de trocha de la colección anterior con pequeños detalles estéticos.",
      price: "$ 3.150.000",
      priceNumber: 3150000,
      originalPrice: "$ 4.500.000",
      discount: "-30%",
      stock: "2 en stock",
      image: "/silla-de-montar-artesanal-.jpg",
      preselectedSize: "15\"",
      preselectedColor: "Roble"
    },
    {
      id: "2",
      title: "Apero Clásico – Oferta Especial",
      description: "Apero tradicional con herrajes de bronce, temporada anterior.",
      price: "$ 595.000",
      priceNumber: 595000,
      originalPrice: "$ 850.000",
      discount: "-30%",
      stock: "3 en stock",
      image: "/apero.jpg",
      preselectedSize: "14\"",
      preselectedColor: "Café"
    },
    {
      id: "3",
      title: "Silla de Paso – Liquidación",
      description: "Elegante silla de paso negra con pequeños detalles de uso.",
      price: "$ 1.365.000",
      priceNumber: 1365000,
      originalPrice: "$ 1.950.000",
      discount: "-30%",
      stock: "1 en stock",
      image: "/silla-de-paso-negra.jpg",
      preselectedSize: "16\"",
      preselectedColor: "Negro"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-[#0F0B0A] border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-title text-[#E5AB4A] mb-4 flex items-center justify-center gap-4 flex-wrap">
            🔥 SALE – Ofertas Especiales 🔥
          </h1>
          <p className="text-body text-muted-foreground max-w-4xl mx-auto mb-6">
            Aprovecha estas ofertas exclusivas en productos seleccionados. ¡Piezas únicas con la misma calidad artesanal!
          </p>
          <Button className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-8 rounded-full">
            ⏱ OFERTAS POR TIEMPO LIMITADO
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 bg-[#0F0B0A]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isSaleProduct={true}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
