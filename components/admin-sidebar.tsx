"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingBag, Home, LogOut, User, Users, UserCircle } from "lucide-react"
import { logout, getAdminEmail } from "@/lib/auth"
import { useEffect, useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    setAdminEmail(getAdminEmail())
  }, [])

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/promociones", label: "Promociones", icon: Tag },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/clientes", label: "Clientes", icon: UserCircle },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 w-64 bg-[#1A1311] border-r border-[#2a2a2a] min-h-screen p-6 hidden lg:flex lg:flex-col">
      <div className="mb-8">
        <h2 className="text-[#E5AB4A] font-serif text-2xl font-bold">Admin</h2>
        <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
      </div>

      <nav className="space-y-2 flex-1">
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

      {/* Footer Section */}
      <div className="mt-auto pt-6 border-t border-[#2a2a2a] space-y-2">
        {/* User Info */}
        {adminEmail && (
          <div className="px-4 py-3 bg-[#0F0B0A] rounded-lg mb-2">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-[#E5AB4A]" />
              <p className="text-xs text-gray-400">Sesión activa</p>
            </div>
            <p className="text-sm text-[#E5AB4A] font-medium truncate">{adminEmail}</p>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-[#E5AB4A] transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Volver al sitio</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
