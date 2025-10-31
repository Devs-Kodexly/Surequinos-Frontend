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
    <div className="space-y-6">
      <div>
        <h1 className="text-[#E5AB4A] font-serif text-4xl font-bold mb-2">Pedidos</h1>
        <p className="text-gray-400">Administra y da seguimiento a los pedidos de tus clientes</p>
      </div>

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{order.id}</h3>
                    <p className="text-gray-400 text-sm">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </button>
                  <button className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] rounded-lg text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Cliente</p>
                  <p className="text-white text-sm font-medium">{order.customer}</p>
                  <p className="text-gray-400 text-xs">{order.email}</p>
                  <p className="text-gray-400 text-xs">{order.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Productos</p>
                  {order.products.map((product, index) => (
                    <p key={index} className="text-white text-sm">
                      {product.quantity}x {product.name}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Envío</p>
                  <p className="text-white text-sm">{order.shipping}</p>
                  <p className="text-[#E5AB4A] text-lg font-bold mt-2">{order.total}</p>
                </div>
              </div>

              {order.status === "Pendiente" && (
                <div className="flex gap-2 pt-4 border-t border-[#2a2a2a]">
                  <button className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm">
                    Aprobar Pedido
                  </button>
                  <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm">
                    Cancelar Pedido
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
