import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function ProcesoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl text-primary mb-4">Nuestro Proceso</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada pieza pasa por un meticuloso proceso artesanal que garantiza la más alta calidad
            </p>
          </div>

          <div className="space-y-20">
            {[
              {
                step: "01",
                title: "Selección de Materiales",
                description:
                  "Elegimos cuidadosamente los mejores cueros y materiales de primera calidad para cada proyecto.",
              },
              {
                step: "02",
                title: "Diseño y Planificación",
                description: "Cada pieza es diseñada considerando tanto la estética como la funcionalidad y comodidad.",
              },
              {
                step: "03",
                title: "Trabajo Artesanal",
                description: "Nuestros artesanos trabajan cada detalle a mano con técnicas tradicionales colombianas.",
              },
              {
                step: "04",
                title: "Control de Calidad",
                description: "Cada pieza es inspeccionada minuciosamente antes de llegar a nuestros clientes.",
              },
            ].map((item, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <span className="text-primary/30 text-6xl font-bold">{item.step}</span>
                  <h2 className="font-serif text-3xl text-foreground mt-4 mb-4">{item.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={`/proceso/${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
