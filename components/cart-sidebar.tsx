"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { AddToCartAnimation } from "@/components/add-to-cart-animation"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter()
  const { items, removeItem, updateQuantity, total, itemCount, animationItem, clearAnimation } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [shippingOption, setShippingOption] = useState("Bogotá (retiro en taller - $0)")
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)

  const handleProceedToCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  // Efecto para resaltar el nuevo item cuando se añade
  useEffect(() => {
    if (animationItem && isOpen) {
      setHighlightedItem(animationItem.id)
      setTimeout(() => {
        setHighlightedItem(null)
      }, 1500)
    }
  }, [animationItem, isOpen])

  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString("es-CO")}`
  }

  const subtotal = total
  const discount = 0
  const shipping = 0
  const finalTotal = subtotal - discount + shipping

  return (
    <>
      <AddToCartAnimation item={animationItem} onComplete={clearAnimation} />
      <div 
        className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300" 
        onClick={onClose}
        style={{
          animation: isOpen ? 'fadeIn 0.3s ease-out' : 'none'
        }}
      />
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1311] z-50 shadow-xl overflow-y-auto"
        style={{
          animation: isOpen ? 'slideInRight 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
        }}
      >
        <style jsx>{`
          @keyframes fadeIn {
            from { 
              opacity: 0; 
            }
            to { 
              opacity: 1; 
            }
          }
          
          @keyframes slideInRight {
            0% { 
              transform: translateX(100%);
              opacity: 0;
            }
            60% {
              transform: translateX(-5px);
              opacity: 1;
            }
            100% { 
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes highlightItem {
            0% {
              background-color: rgba(15, 11, 10, 1);
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(229, 171, 74, 0);
            }
            20% {
              background-color: rgba(229, 171, 74, 0.2);
              transform: scale(1.03);
              box-shadow: 0 0 25px 8px rgba(229, 171, 74, 0.4);
            }
            40% {
              background-color: rgba(229, 171, 74, 0.25);
              transform: scale(1.04);
              box-shadow: 0 0 30px 10px rgba(229, 171, 74, 0.5);
            }
            60% {
              background-color: rgba(229, 171, 74, 0.15);
              transform: scale(1.02);
              box-shadow: 0 0 20px 5px rgba(229, 171, 74, 0.3);
            }
            80% {
              background-color: rgba(229, 171, 74, 0.08);
              transform: scale(1.01);
              box-shadow: 0 0 10px 2px rgba(229, 171, 74, 0.15);
            }
            100% {
              background-color: rgba(15, 11, 10, 1);
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(229, 171, 74, 0);
            }
          }
        `}</style>
        <div className="p-6">
          {!showCheckout ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Carrito <span className="text-muted-foreground">({itemCount})</span>
                </h2>
                <button onClick={onClose} className="text-white hover:text-[#E5AB4A]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Tu carrito está vacío</p>
                ) : (
                  items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-3 p-3 bg-[#0F0B0A] rounded-lg transition-all duration-300"
                      style={{
                        animation: highlightedItem === item.id ? 'highlightItem 1.5s ease-out' : 'none'
                      }}
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm leading-tight mb-1" style={{ fontFamily: 'Inter' }}>{item.name}</h3>
                        <p className="text-muted-foreground text-xs mb-1" style={{ fontFamily: 'Inter' }}>{item.color}</p>
                        <p className="text-[#E5AB4A] font-semibold mb-2" style={{ fontFamily: 'Inter', fontSize: '15px', lineHeight: '100%' }}>{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded bg-[#1A1311] flex items-center justify-center text-white hover:bg-[#2a2a2a]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center bg-[#0F0B0A] border border-[#2a2a2a] rounded text-white py-1 text-sm"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded bg-[#1A1311] flex items-center justify-center text-white hover:bg-[#2a2a2a]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-white self-start">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[#2a2a2a] pt-4 mb-4">
                <div className="flex gap-2 mb-3">
                  <button className="flex-1 py-2 px-3 bg-[#0F0B0A] border border-[#E5AB4A] rounded text-white text-xs hover:bg-[#1A1311] transition-colors">
                    Retiro en taller
                  </button>
                  <button className="flex-1 py-2 px-3 border border-[#2a2a2a] rounded text-muted-foreground text-xs hover:bg-[#1A1311] transition-colors">
                    Cupón
                  </button>
                </div>

                <div className="space-y-1.5 text-xs mb-3" style={{ fontFamily: 'Inter' }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-white">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descuento</span>
                    <span className="text-white">{formatPrice(discount)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#2a2a2a]">
                  <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter' }}>Total</span>
                  <span className="text-[#E5AB4A] font-bold" style={{ fontFamily: 'Inter', fontSize: '17.7px', lineHeight: '100%' }}>{formatPrice(finalTotal)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-[#E5AB4A] text-[#E5AB4A] hover:bg-[#E5AB4A] hover:text-[#0F0B0A] bg-transparent"
                    disabled={items.length === 0}
                  >
                    PEDIR POR WHATSAPP
                  </Button>
                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={items.length === 0}
                    className="w-full bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white"
                  >
                    PROCEDER AL PAGO
                  </Button>
                </div>

                <button onClick={onClose} className="w-full text-center text-[#E5AB4A] text-sm mt-4 hover:underline">
                  ← Seguir comprando
                </button>

                <p className="text-muted-foreground text-xs text-center mt-6">
                  Precios incluyen IVA. Envío gratis en pedidos superiores a $500.000
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-white text-xl font-serif">Resumen</h2>
                <button onClick={onClose} className="text-white hover:text-[#E5AB4A]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 md:mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de cupón (opcional)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white text-gray-800 placeholder:text-gray-400 px-3 py-2 rounded text-sm"
                  />
                  <button className="px-4 py-2 border-2 border-[#E5AB4A] text-[#E5AB4A] rounded hover:bg-[#E5AB4A] hover:text-[#0F0B0A] transition-colors font-semibold text-sm whitespace-nowrap">
                    APLICAR
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4 md:mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Subtotal</span>
                  <span className="text-white text-price">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Descuento</span>
                  <span className="text-white text-price">- {formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Envío</span>
                  <span className="text-white text-price">{formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-[#2a2a2a]">
                <span className="text-white font-semibold text-lg">Total</span>
                <span className="text-[#E5AB4A] text-price font-bold">{formatPrice(finalTotal)}</span>
              </div>

              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">Destino de envío</label>
                <select
                  value={shippingOption}
                  onChange={(e) => setShippingOption(e.target.value)}
                  className="w-full bg-white text-gray-800 px-3 py-2 rounded text-sm"
                >
                  <option>Bogotá (retiro en taller - $0)</option>
                  <option>Medellín - $50.000</option>
                  <option>Cali - $60.000</option>
                </select>
              </div>

              <Button className="w-full bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white py-3 text-sm font-semibold">
                FINALIZAR COMPRA
              </Button>

              <p className="text-muted-foreground text-xs md:text-sm text-center mt-3 md:mt-4">
                Pagos seguros. Tiempo de fabricación: 10-15 días hábiles.
              </p>

              <button
                onClick={() => setShowCheckout(false)}
                className="w-full text-center text-[#E5AB4A] text-xs md:text-sm mt-3 md:mt-4 hover:underline"
              >
                ← Volver al carrito
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
