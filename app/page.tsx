import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center bg-[#0F0B0A] py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-xl">
            <h1 className="text-title text-[#E5AB4A] mb-6 text-left">
              El Arte
              <br />
              del Ensillar
            </h1>
            <p className="text-body text-muted-foreground mb-8 text-left">
              Un taller donde se honra la talabartería artesanal, se respira respeto por la tradición y se cuida cada
              detalle como si fuera único.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Link href="/tienda">
                <Button className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-8 w-full sm:w-auto">
                  VER TIENDA
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[#E5AB4A] text-[#E5AB4A] hover:bg-[#E5AB4A] hover:text-[#0F0B0A] px-8 bg-transparent w-full sm:w-auto"
              >
                HECHO A MEDIDA
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#0F0B0A]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-title mb-6">
                <span className="text-foreground">Somos un taller con </span>
                <span className="text-[#E5AB4A]">más de 12 años en el mercado</span>
              </h2>
              <p className="text-body text-muted-foreground">
                Con materiales y cueros de primera calidad, nos hemos posicionado en el territorio colombiano por
                nuestras sillas y tereques de montar de lujo. Cada pieza es creada con respeto por la tradición y
                cuidando cada detalle como si fuera único.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/talabarteria2.jpeg"
                  alt="Taller"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/artesano-trabajando-cuero.jpg"
                  alt="Artesano"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#1A1311]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-title text-foreground mb-4">
              NUESTRA
              <br />
              GALERÍA
            </h2>
            <p className="text-body text-muted-foreground">
              Cada pieza cuenta una historia de precisión, pasión y perfección técnica.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                src: "/silla-de-montar-artesanal-.jpg",
                title: "SILLA ARTESANAL",
                description: "Silla de montar tradicional con acabados de lujo"
              },
              {
                src: "/silla-de-paso-negra.jpg",
                title: "SILLA DE PASO",
                description: "Elegante silla de paso en cuero negro premium"
              },
              {
                src: "/silla-de-montar-artesanal-colombiana-.jpg",
                title: "DISEÑO COLOMBIANO",
                description: "Tradición colombiana en cada detalle artesanal"
              },
              {
                src: "/apero.jpg",
                title: "APERO TRADICIONAL",
                description: "Apero completo con herrajes de primera calidad"
              },
              {
                src: "/Talabarteria-montura.webp",
                title: "TERECO DE LUJO",
                description: "Tereco premium con materiales selectos"
              },
              {
                src: "/silla-de-montar-artesanal-.jpg",
                title: "ARTESANÍA PURA",
                description: "Cada pieza única trabajada a mano"
              }
            ].map((item, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <h3 className="text-foreground font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/galeria" className="text-[#E5AB4A] hover:underline inline-flex items-center gap-2">
              VER GALERÍA COMPLETA →
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#0F0B0A]">
        <div className="container mx-auto px-4">
          <h2 className="text-title text-center mb-12">
            <span className="text-foreground">Calidad </span>
            <span className="text-[#E5AB4A]">& Valores</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Artesanal",
                description: "Cada pieza es trabajada a mano con técnicas tradicionales que exaltan cada detalle.",
              },
              {
                title: "Calidad Premium",
                description:
                  "Utilizamos únicamente cueros y materiales de primera calidad seleccionados cuidadosamente.",
              },
              {
                title: "Innovación",
                description: "Exploramos nuevas formas, texturas y combinaciones que reimaginan lo tradicional.",
              },
              {
                title: "Tradición",
                description: "Preservamos y honramos las técnicas de la talabartería colombiana.",
              },
            ].map((value, i) => (
              <div key={i} className="bg-[#1A1311] p-6 rounded-lg border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-[#AA3E11] mx-auto mb-4" />
                <h3 className="text-foreground font-semibold mb-2">{value.title}</h3>
                <p className="text-body text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
