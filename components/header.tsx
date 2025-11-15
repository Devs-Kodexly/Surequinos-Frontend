"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, LogIn } from "lucide-react"
import { useState } from "react"
import React from "react"
import { CartSidebar } from "./cart-sidebar"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { itemCount, setOpenCart } = useCart()

  // Registrar la función para abrir el carrito
  React.useEffect(() => {
    setOpenCart(() => setIsCartOpen(true))
  }, [])

  return (
    <>
      <header className="bg-[#AA3E11] border-b border-[#AA3E11]/50 h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Surequinos" 
              width={800} 
              height={200} 
              className="w-auto max-h-none"
              style={{ height: '140px' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-[#E5AB4A] transition-colors text-sm">
              Inicio
            </Link>
            <Link href="/tienda" className="text-white hover:text-[#E5AB4A] transition-colors text-sm">
              Tienda
            </Link>
            {/* <Link href="/proceso" className="text-white hover:text-[#E5AB4A] transition-colors text-sm">
              Proceso
            </Link> */}
            <Link href="/contacto" className="text-white hover:text-[#E5AB4A] transition-colors text-sm">
              Contáctenos
            </Link>
            <Link href="/sale" className="text-white hover:text-[#E5AB4A] transition-colors text-sm font-semibold">
              SALE
            </Link>
            <Link 
              href="/login" 
              className="text-white hover:text-[#E5AB4A] transition-colors flex items-center gap-2"
              title="Inicio de sesión"
            >
              <LogIn className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[#E5AB4A] transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E5AB4A] text-[#0F0B0A] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[#E5AB4A] transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E5AB4A] text-[#0F0B0A] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
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
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <nav className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#AA3E11] shadow-2xl animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E5AB4A]/20">
                <h2 className="text-[#E5AB4A] font-serif text-xl font-bold">Menú</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#E5AB4A] transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="p-6 space-y-2">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-white hover:text-[#E5AB4A] hover:bg-[#E5AB4A]/10 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-base font-medium">Inicio</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link
                  href="/tienda"
                  className="flex items-center px-4 py-3 text-white hover:text-[#E5AB4A] hover:bg-[#E5AB4A]/10 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-base font-medium">Tienda</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link
                  href="/contacto"
                  className="flex items-center px-4 py-3 text-white hover:text-[#E5AB4A] hover:bg-[#E5AB4A]/10 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-base font-medium">Contáctenos</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                
                {/* Divider */}
                <div className="border-t border-[#E5AB4A]/20 my-4"></div>
                
                <Link
                  href="/sale"
                  className="flex items-center px-4 py-3 text-[#E5AB4A] hover:bg-[#E5AB4A]/10 rounded-lg transition-all duration-200 group font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-base">🔥 SALE</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center px-4 py-3 text-white hover:text-[#E5AB4A] hover:bg-[#E5AB4A]/10 rounded-lg transition-all duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className="text-base">Acceso</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </div>
              
              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#E5AB4A]/20">
                <p className="text-[#E5AB4A]/70 text-sm text-center">
                  Surequinos - Talabartería Artesanal
                </p>
              </div>
            </nav>
          </div>
        )}
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
