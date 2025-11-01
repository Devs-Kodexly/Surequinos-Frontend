export function Footer() {
  return (
    <footer className="bg-[#AA3E11] border-t-4 border-[#AA3E11]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {/* Sección principal */}
          <div className="w-full">
            <h3 className="text-white font-serif text-lg md:text-xl font-bold mb-3 md:mb-4">Surequinos</h3>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed">
              Más de 12 años creando productos artesanales de talabartería con la más alta calidad y respeto por la
              tradición colombiana.
            </p>
          </div>

          {/* Sede Sabaneta */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Sede Sabaneta</h4>
            <div className="text-white/90 text-xs md:text-sm space-y-1 md:space-y-2">
              <p>Carrera 46a # 88 Sur - 86</p>
              <p>Sabaneta, Antioquia</p>
              <p>+57 316 390 2625</p>
              <p className="text-xs mt-2 md:mt-4">Lun-Vie: 00:00-00:00</p>
              <p className="text-xs">Sáb: 00:00-00:00</p>
            </div>
          </div>

          {/* Sede Girardota */}
          <div className="w-full">
            <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Sede Girardota</h4>
            <div className="text-white/90 text-xs md:text-sm space-y-1 md:space-y-2">
              <p>Auto. Norte, Km 20 Vía Girardota</p>
              <p>Girardota, Antioquia</p>
              <p>+57 324 517 6873</p>
              <p className="text-xs mt-2 md:mt-4">Lun-Vie: 00:00-00:00</p>
              <p className="text-xs">Sáb: 00:00-00:00</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
