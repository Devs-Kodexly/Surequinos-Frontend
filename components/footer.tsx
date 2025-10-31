export function Footer() {
  return (
    <footer className="bg-[#AA3E11] border-t-4 border-[#AA3E11]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-serif text-xl font-bold mb-4">Surequinos</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Más de 12 años creando productos artesanales de talabartería con la más alta calidad y respeto por la
              tradición colombiana.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sede Sabaneta</h4>
            <div className="text-white/90 text-sm space-y-2">
              <p>Carrera 46a # 88 Sur - 86</p>
              <p>Sabaneta, Antioquia</p>
              <p>+57 316 390 2625</p>
              <p className="text-xs mt-4">Lun-Vie: 00:00-00:00</p>
              <p className="text-xs">Sáb: 00:00-00:00</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sede Girardota</h4>
            <div className="text-white/90 text-sm space-y-2">
              <p>Auto. Norte, Km 20 Vía Girardota</p>
              <p>Girardota, Antioquia</p>
              <p>+57 324 517 6873</p>
              <p className="text-xs mt-4">Lun-Vie: 00:00-00:00</p>
              <p className="text-xs">Sáb: 00:00-00:00</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
