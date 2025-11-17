"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartItem {
  id: string // Mantener para compatibilidad, pero ahora será el variantId
  variantId: string // ID de la variante del producto
  name: string
  color: string
  size?: string // Talla de la variante
  type?: string // Tipo de la variante
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, triggerAnimation?: boolean) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  openCart: () => void
  setOpenCart: (callback: () => void) => void
  triggerCartAnimation: (item: Omit<CartItem, "quantity">, startX: number, startY: number) => void
  animationItem: { id: string; image: string; startX: number; startY: number } | null
  clearAnimation: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [openCartCallback, setOpenCartCallback] = useState<(() => void) | null>(null)
  const [animationItem, setAnimationItem] = useState<{ id: string; image: string; startX: number; startY: number } | null>(null)

  const addItem = (item: Omit<CartItem, "quantity">, triggerAnimation: boolean = false) => {
    setItems((prev) => {
      // Usar variantId como identificador único para encontrar items duplicados
      const itemId = item.variantId || item.id
      const existing = prev.find((i) => (i.variantId || i.id) === itemId)
      if (existing) {
        return prev.map((i) => ((i.variantId || i.id) === itemId ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, id: item.variantId || item.id, quantity: 1 }]
    })
    
    // Si no se debe animar, abrir el carrito después de un pequeño delay
    if (!triggerAnimation && openCartCallback) {
      setTimeout(() => {
        openCartCallback()
      }, 100)
    }
  }

  const triggerCartAnimation = (item: Omit<CartItem, "quantity">, startX: number, startY: number) => {
    // Configurar la animación (para el resaltado del item)
    setAnimationItem({
      id: item.id,
      image: item.image,
      startX,
      startY,
    })
    
    // Añadir el item al carrito
    addItem(item, true)
    
    // Abrir el carrito inmediatamente
    if (openCartCallback) {
      openCartCallback()
    }
  }

  const clearAnimation = () => {
    setAnimationItem(null)
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
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      total, 
      itemCount, 
      openCart, 
      setOpenCart,
      triggerCartAnimation,
      animationItem,
      clearAnimation
    }}>
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
