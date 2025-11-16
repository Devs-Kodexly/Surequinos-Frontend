"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Package, ShoppingBag, Tag, LogOut, Menu, X, Users, UserCircle } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"
import { isAuthenticated, logout, getAdminEmail } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setAdminEmail(getAdminEmail())
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0B0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5AB4A]/20 border-t-[#E5AB4A] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/productos", icon: Package, label: "Productos" },
    { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
    { href: "/admin/promociones", icon: Tag, label: "Promociones" },
    { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { href: "/admin/clientes", icon: UserCircle, label: "Clientes" },
  ]

  return (
    <div className="min-h-screen bg-[#0F0B0A]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#AA3E11] border-b border-[#2a2a2a] h-16">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="text-[#E5AB4A] font-serif text-xl font-bold">
            Surequinos
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-[#E5AB4A] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="fixed top-16 left-0 right-0 bottom-0 bg-[#1A1311] overflow-y-auto">
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#AA3E11] text-white"
                        : "text-gray-400 hover:bg-[#AA3E11]/10 hover:text-[#E5AB4A]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-[#2a2a2a] my-4" />
              
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#AA3E11]/10 hover:text-[#E5AB4A] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Volver al sitio</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
            
            {adminEmail && (
              <div className="p-4 border-t border-[#2a2a2a]">
                <p className="text-xs text-gray-500">Sesión iniciada como:</p>
                <p className="text-sm text-[#E5AB4A] font-medium truncate">{adminEmail}</p>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  )
}
