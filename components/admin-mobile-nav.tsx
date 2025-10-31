"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingBag } from "lucide-react"

export function AdminMobileNav() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/promociones", label: "Promociones", icon: Tag },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  ]

  return (
    <nav className="lg:hidden bg-[#1A1311] border-b border-[#2a2a2a] overflow-x-auto">
      <div className="flex gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive ? "bg-[#AA3E11] text-white" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-[#E5AB4A]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
