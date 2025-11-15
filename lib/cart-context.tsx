"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartItem {
  id: string // Mantener para compatibilidad, pero ahora será el variantId
  variantId: string // ID de la variante del producto
  name: string
  color: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  openCart: () => void
  setOpenCart: (callback: () => void) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [openCartCallback, setOpenCartCallback] = useState<(() => void) | null>(null)

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      // Usar variantId como identificador único para encontrar items duplicados
      const itemId = item.variantId || item.id
      const existing = prev.find((i) => (i.variantId || i.id) === itemId)
      if (existing) {
        return prev.map((i) => ((i.variantId || i.id) === itemId ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, id: item.variantId || item.id, quantity: 1 }]
    })
    
    // Ya no abrimos el carrito automáticamente
    // La notificación se manejará desde el componente
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => (i.variantId || i.id) !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => ((i.variantId || i.id) === id ? { ...i, quantity } : i)))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const openCart = () => {
    if (openCartCallback) {
      openCartCallback()
    }
  }

  const setOpenCart = (callback: () => void) => {
    setOpenCartCallback(() => callback)
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, openCart, setOpenCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
