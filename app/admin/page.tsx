import { TrendingUp, Package, ShoppingBag, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Ventas Totales",
      value: "$ 45.230.000",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Pedidos",
      value: "156",
      change: "+8.2%",
      icon: ShoppingBag,
      trend: "up",
    },
    {
      title: "Productos",
      value: "89",
      change: "+3",
      icon: Package,
      trend: "up",
    },
    {
      title: "Tasa de Conversión",
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "María González",
      product: "Silla de Trocha",
      amount: "$ 3.150.000",
      status: "Completado",
      date: "28 Oct 2025",
    },
    {
      id: "#ORD-002",
      customer: "Carlos Ramírez",
      product: "Tereco de Lujo",
      amount: "$ 1.800.000",
      status: "En Proceso",
      date: "27 Oct 2025",
    },
    {
      id: "#ORD-003",
      customer: "Ana Martínez",
      product: "Silla de Paso",
      amount: "$ 3.200.000",
      status: "Pendiente",
      date: "26 Oct 2025",
    },
    {
      id: "#ORD-004",
      customer: "Luis Hernández",
      product: "Silla de Trocha",
      amount: "$ 3.150.000",
      status: "Completado",
      date: "25 Oct 2025",
    },
  ]

  const topProducts = [
    { name: "Silla de Trocha", sales: 45, revenue: "$ 14.175.000" },
    { name: "Tereco de Lujo", sales: 38, revenue: "$ 6.840.000" },
    { name: "Silla de Paso", sales: 32, revenue: "$ 10.240.000" },
    { name: "Aperos Premium", sales: 28, revenue: "$ 8.400.000" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm sm:text-base">Resumen general de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#AA3E11]/10 rounded-lg">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5AB4A]" />
                </div>
                <span className="text-green-500 text-xs sm:text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-400 text-xs sm:text-sm mb-1">{stat.title}</h3>
              <p className="text-[#E5AB4A] text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
          <h2 className="text-[#E5AB4A] font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Pedidos Recientes</h2>
          
          {/* Vista móvil - Tarjetas */}
          <div className="block sm:hidden space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-[#0F0B0A] border border-[#2a2a2a]/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-xs font-medium">{order.id}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completado"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "En Proceso"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-white text-sm font-medium mb-1">{order.customer}</p>
                <p className="text-gray-400 text-xs mb-2">{order.product}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#E5AB4A] text-sm font-medium">{order.amount}</span>
                  <span className="text-gray-400 text-xs">{order.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop - Tabla */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">ID</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Cliente</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Producto</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Monto</th>
                  <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#2a2a2a]/50">
                    <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300">{order.id}</td>
                    <td className="py-3 sm:py-4 text-xs sm:text-sm text-white">{order.customer}</td>
                    <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden md:table-cell">{order.product}</td>
                    <td className="py-3 sm:py-4 text-xs sm:text-sm text-[#E5AB4A] font-medium">{order.amount}</td>
                    <td className="py-3 sm:py-4">
                      <span
                        className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Completado"
                            ? "bg-green-500/10 text-green-500"
                            : order.status === "En Proceso"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
          <h2 className="text-[#E5AB4A] font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Productos Destacados</h2>
          <div className="space-y-3 sm:space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#2a2a2a]/50">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#AA3E11]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#E5AB4A] text-xs sm:text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs sm:text-sm font-medium truncate">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.sales} ventas</p>
                  </div>
                </div>
                <p className="text-[#E5AB4A] text-xs sm:text-sm font-medium ml-2 flex-shrink-0">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
