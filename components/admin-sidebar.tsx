"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingBag } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/promociones", label: "Promociones", icon: Tag },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  ]

  return (
    <aside className="w-64 bg-[#1A1311] border-r border-[#2a2a2a] min-h-screen p-6 hidden lg:block">
      <div className="mb-8">
        <h2 className="text-[#E5AB4A] font-serif text-2xl font-bold">Admin</h2>
        <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-[#AA3E11] text-white" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-[#E5AB4A]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
