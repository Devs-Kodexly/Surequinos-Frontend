"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)

  const products = [
    {
      id: 1,
      name: "Silla de Trocha - Temporada Pasada",
      category: "Sillas y Tereques",
      price: "$ 3.150.000",
      stock: 2,
      status: "Activo",
    },
    {
      id: 2,
      name: "Tereco de Lujo",
      category: "Línea de pista",
      price: "$ 1.800.000",
      stock: 5,
      status: "Activo",
    },
    {
      id: 3,
      name: "Silla de Paso Negro",
      category: "Sillas y Tereques",
      price: "$ 3.200.000",
      stock: 3,
      status: "Activo",
    },
    {
      id: 4,
      name: "Aperos Premium",
      category: "Aperos y Jaquimones",
      price: "$ 850.000",
      stock: 8,
      status: "Activo",
    },
    {
      id: 5,
      name: "Sombrero Artesanal",
      category: "Sombreros",
      price: "$ 450.000",
      stock: 0,
      status: "Agotado",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Productos</h1>
          <p className="text-gray-400 text-sm sm:text-base">Administra tu catálogo de productos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
          <h2 className="text-[#E5AB4A] font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Crear Nuevo Producto</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Nombre del Producto*</label>
                <input
                  type="text"
                  placeholder="Ej: Silla de Trocha Premium"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Categoría*</label>
                <select className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base">
                  <option>Seleccionar categoría</option>
                  <option>Línea de pista</option>
                  <option>Sillas y Tereques</option>
                  <option>Aperos y Jaquimones</option>
                  <option>Accesorios</option>
                  <option>Sombreros</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Precio*</label>
                <input
                  type="text"
                  placeholder="$ 0"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Stock*</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Descripción*</label>
              <textarea
                rows={4}
                placeholder="Describe el producto..."
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                Crear Producto
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Vista móvil - Tarjetas */}
        <div className="block sm:hidden space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-[#0F0B0A] border border-[#2a2a2a]/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[#E5AB4A] text-sm font-medium">{product.price}</span>
                    <span className="text-gray-400 text-xs">{product.stock} unidades</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    product.status === "Activo" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2a2a2a]/50">
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-[#E5AB4A]" />
                </button>
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vista desktop - Tabla */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Producto</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Categoría</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Precio</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Stock</th>
                <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Estado</th>
                <th className="text-right text-gray-400 text-xs sm:text-sm font-medium pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#2a2a2a]/50">
                  <td className="py-3 sm:py-4 text-xs sm:text-sm text-white font-medium">{product.name}</td>
                  <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300">{product.category}</td>
                  <td className="py-3 sm:py-4 text-xs sm:text-sm text-[#E5AB4A] font-medium">{product.price}</td>
                  <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden md:table-cell">{product.stock} unidades</td>
                  <td className="py-3 sm:py-4 hidden md:table-cell">
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "Activo" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5AB4A]" />
                      </button>
                      <button className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
