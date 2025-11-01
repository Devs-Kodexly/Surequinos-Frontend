"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download } from "lucide-react"

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")

  const orders = [
    {
      id: "#ORD-001",
      customer: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+57 324 517 6873",
      products: [{ name: "Silla de Trocha", quantity: 1, price: "$ 3.150.000" }],
      total: "$ 3.150.000",
      status: "Completado",
      date: "28 Oct 2025",
      shipping: "Bogotá (retiro en taller)",
    },
    {
      id: "#ORD-002",
      customer: "Carlos Ramírez",
      email: "carlos.ramirez@email.com",
      phone: "+57 310 234 5678",
      products: [{ name: "Tereco de Lujo", quantity: 2, price: "$ 1.800.000" }],
      total: "$ 3.600.000",
      status: "En Proceso",
      date: "27 Oct 2025",
      shipping: "Medellín - Envío a domicilio",
    },
    {
      id: "#ORD-003",
      customer: "Ana Martínez",
      email: "ana.martinez@email.com",
      phone: "+57 315 876 5432",
      products: [{ name: "Silla de Paso", quantity: 1, price: "$ 3.200.000" }],
      total: "$ 3.200.000",
      status: "Pendiente",
      date: "26 Oct 2025",
      shipping: "Cali - Envío a domicilio",
    },
    {
      id: "#ORD-004",
      customer: "Luis Hernández",
      email: "luis.hernandez@email.com",
      phone: "+57 320 456 7890",
      products: [
        { name: "Silla de Trocha", quantity: 1, price: "$ 3.150.000" },
        { name: "Aperos Premium", quantity: 1, price: "$ 850.000" },
      ],
      total: "$ 4.000.000",
      status: "Completado",
      date: "25 Oct 2025",
      shipping: "Bogotá (retiro en taller)",
    },
    {
      id: "#ORD-005",
      customer: "Patricia Silva",
      email: "patricia.silva@email.com",
      phone: "+57 318 234 5678",
      products: [{ name: "Tereco de Lujo", quantity: 1, price: "$ 1.800.000" }],
      total: "$ 1.800.000",
      status: "Cancelado",
      date: "24 Oct 2025",
      shipping: "Barranquilla - Envío a domicilio",
    },
  ]

  const statusOptions = ["Todos", "Pendiente", "En Proceso", "Completado", "Cancelado"]

  const filteredOrders = filterStatus === "Todos" ? orders : orders.filter((order) => order.status === filterStatus)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Pedidos</h1>
        <p className="text-gray-400 text-sm sm:text-base">Administra y da seguimiento a los pedidos de tus clientes</p>
      </div>

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-lg">{order.id}</h3>
                    <p className="text-gray-400 text-xs">{order.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completado"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "En Proceso"
                          ? "bg-blue-500/10 text-blue-500"
                          : order.status === "Pendiente"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-[#E5AB4A] text-sm sm:text-lg font-bold">{order.total}</p>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-gray-400 text-xs">Cliente</p>
                  <p className="text-white text-sm font-medium">{order.customer}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Productos</p>
                  {order.products.map((product, index) => (
                    <p key={index} className="text-white text-sm">
                      {product.quantity}x {product.name}
                    </p>
                  ))}
                </div>
                <div className="sm:hidden">
                  <p className="text-gray-400 text-xs">Envío</p>
                  <p className="text-white text-sm">{order.shipping}</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Cliente</p>
                    <p className="text-white text-sm font-medium">{order.customer}</p>
                    <p className="text-gray-400 text-xs truncate">{order.email}</p>
                    <p className="text-gray-400 text-xs">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Productos</p>
                    {order.products.map((product, index) => (
                      <p key={index} className="text-white text-sm truncate">
                        {product.quantity}x {product.name}
                      </p>
                    ))}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-gray-400 text-xs mb-1">Envío</p>
                    <p className="text-white text-sm">{order.shipping}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#2a2a2a]">
                <button className="flex-1 px-3 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-xs flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ver Detalles</span>
                  <span className="sm:hidden">Ver</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] rounded-lg text-xs flex items-center justify-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>

              {order.status === "Pendiente" && (
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-3 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-xs">
                    Aprobar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
