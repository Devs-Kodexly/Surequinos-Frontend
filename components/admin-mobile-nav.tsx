"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, UserCircle } from "lucide-react"

export function AdminMobileNav() {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/promociones", label: "Promociones", icon: Tag },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/clientes", label: "Clientes", icon: UserCircle },
  ]

  return (
    <nav className="lg:hidden bg-[#1A1311] border-b border-[#2a2a2a]">
      <div className="grid grid-cols-6 gap-1 p-2 sm:p-3">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-xs ${
                isActive ? "bg-[#AA3E11] text-white" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-[#E5AB4A]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium text-center leading-tight">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
