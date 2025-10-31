import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-title text-primary mb-4">Contáctenos</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Estaremos encantados de asesorarte sobre piezas a medida, tiempos de fabricación y envíos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-foreground text-2xl font-semibold mb-6">Escríbanos</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground text-sm mb-2 block">Nombre*</label>
                    <Input placeholder="Su nombre" className="bg-background" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm mb-2 block">Email*</label>
                    <Input type="email" placeholder="nombre@email.com" className="bg-background" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground text-sm mb-2 block">Teléfono (opcional)</label>
                    <Input placeholder="+57 300 000 0000" className="bg-background" />
                  </div>
                  <div>
                    <label className="text-foreground text-sm mb-2 block">Asunto</label>
                    <Input placeholder="Asunto" className="bg-background" />
                  </div>
                </div>
                <div>
                  <label className="text-foreground text-sm mb-2 block">Mensaje*</label>
                  <Textarea placeholder="Cuéntenos qué necesita..." rows={6} className="bg-background" />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">ENVIAR MENSAJE</Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    WHATSAPP
                  </Button>
                </div>
              </form>
            </div>

            {/* Location Cards */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-foreground font-semibold text-lg mb-4">Sede Sabaneta</h3>
                <div className="text-muted-foreground text-sm space-y-2 mb-4">
                  <p>Carrera 46a # 88 Sur - 86</p>
                  <p>Sabaneta, Antioquia</p>
                  <p>+57 316 390 2625</p>
                  <p className="text-xs mt-4">Lun-Vie: 00:00-00:00</p>
                  <p className="text-xs">Sáb: 00:00-00:00</p>
                </div>
                <div className="aspect-video bg-muted rounded overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d-75.6!3d6.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDknMDAuMCJOIDc1wrAzNicwMC4wIlc!5e0!3m2!1sen!2sco!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-foreground font-semibold text-lg mb-4">Sede Girardota</h3>
                <div className="text-muted-foreground text-sm space-y-2 mb-4">
                  <p>Auto. Norte, Km 20 Vía Girardota</p>
                  <p>Girardota, Antioquia</p>
                  <p>+57 324 517 6873</p>
                  <p className="text-xs mt-4">Lun-Vie: 00:00-00:00</p>
                  <p className="text-xs">Sáb: 00:00-00:00</p>
                </div>
                <div className="aspect-video bg-muted rounded overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d-75.6!3d6.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJOIDc1wrAzNicwMC4wIlc!5e0!3m2!1sen!2sco!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
