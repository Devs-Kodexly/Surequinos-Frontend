"use client"

import { useState } from "react"
import { Plus, Tag, Calendar, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PromocionesPage() {
  const [showForm, setShowForm] = useState(false)

  const promotions = [
    {
      id: 1,
      name: "SALE - Ofertas Especiales",
      discount: "30%",
      startDate: "01 Oct 2025",
      endDate: "31 Oct 2025",
      status: "Activa",
      products: 12,
    },
    {
      id: 2,
      name: "Black Friday",
      discount: "40%",
      startDate: "29 Nov 2025",
      endDate: "29 Nov 2025",
      status: "Programada",
      products: 25,
    },
    {
      id: 3,
      name: "Descuento Navideño",
      discount: "25%",
      startDate: "15 Dic 2025",
      endDate: "31 Dic 2025",
      status: "Programada",
      products: 18,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#E5AB4A] font-serif text-4xl font-bold mb-2">Promociones</h1>
          <p className="text-gray-400">Crea y administra descuentos y ofertas especiales</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Promoción
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-[#E5AB4A] font-serif text-2xl font-bold mb-6">Crear Nueva Promoción</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Nombre de la Promoción*</label>
              <input
                type="text"
                placeholder="Ej: SALE - Ofertas Especiales"
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Tipo de Descuento*</label>
                <select className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A]">
                  <option>Porcentaje</option>
                  <option>Monto Fijo</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Valor del Descuento*</label>
                <input
                  type="text"
                  placeholder="30"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Fecha de Inicio*</label>
                <input
                  type="date"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Fecha de Fin*</label>
                <input
                  type="date"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Productos Aplicables*</label>
              <select
                multiple
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A] h-32"
              >
                <option>Silla de Trocha - Temporada Pasada</option>
                <option>Tereco de Lujo</option>
                <option>Silla de Paso Negro</option>
                <option>Aperos Premium</option>
                <option>Sombrero Artesanal</option>
              </select>
              <p className="text-gray-500 text-xs mt-1">Mantén presionado Ctrl/Cmd para seleccionar múltiples</p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-3 rounded-lg">
                Crear Promoción
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] px-6 py-3 rounded-lg"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#AA3E11]/10 rounded-lg">
                <Tag className="w-6 h-6 text-[#E5AB4A]" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  promo.status === "Activa" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {promo.status}
              </span>
            </div>

            <h3 className="text-white font-serif text-xl font-bold mb-2">{promo.name}</h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#E5AB4A]" />
                <span className="text-gray-300 text-sm">Descuento: {promo.discount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E5AB4A]" />
                <span className="text-gray-300 text-sm">
                  {promo.startDate} - {promo.endDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#E5AB4A]" />
                <span className="text-gray-300 text-sm">{promo.products} productos</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] px-4 py-2 rounded-lg text-sm">
                Editar
              </Button>
              <Button className="flex-1 bg-transparent border border-red-500/20 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm">
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
