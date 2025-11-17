"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartApi, type Cart, type CartItem as ApiCartItem } from "./cart-api"

interface CartItem {
  id: string
  variantId: string
  name: string
  color: string
  size?: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (variantId: string, quantity?: number, triggerAnimation?: boolean) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  itemCount: number
  loading: boolean
  openCart: () => void
  setOpenCart: (callback: () => void) => void
  triggerCartAnimation: (variantId: string, quantity: number, startX: number, startY: number) => Promise<void>
  animationItem: { id: string; image: string; startX: number; startY: number } | null
  clearAnimation: () => void
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [openCartCallback, setOpenCartCallback] = useState<(() => void) | null>(null)
  const [animationItem, setAnimationItem] = useState<{ id: string; image: string; startX: number; startY: number } | null>(null)

  // Cargar carrito al montar el componente
  useEffect(() => {
    refreshCart()
  }, [])

  const refreshCart = async () => {
    try {
      setLoading(true)
      const cart = await cartApi.getCart()
      setItems(mapCartItems(cart))
    } catch (error) {
      console.error("Error al cargar el carrito:", error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (variantId: string, quantity: number = 1, triggerAnimation: boolean = false) => {
    try {
      setLoading(true)
      // Asegurar que variantId es un string
      const variantIdString = typeof variantId === 'string' ? variantId : String(variantId)
      console.log('addItem - variantId:', variantIdString, 'quantity:', quantity)
      await cartApi.addItem({ variantId: variantIdString, quantity })
      await refreshCart()

      if (!triggerAnimation && openCartCallback) {
        setTimeout(() => {
          openCartCallback()
        }, 100)
      }
    } catch (error) {
      console.error("Error al agregar item:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const triggerCartAnimation = async (variantId: string, quantity: number, startX: number, startY: number) => {
    try {
      // Primero agregar al carrito
      await addItem(variantId, quantity, true)

      // Buscar el item agregado para la animación
      const cart = await cartApi.getCart()
      const addedItem = cart.items.find(item => item.variantId === variantId)

      if (addedItem) {
        setAnimationItem({
          id: addedItem.id,
          image: addedItem.variant.imageUrl || addedItem.product.images[0] || "",
          startX,
          startY,
        })
      }

      // Abrir el carrito
      if (openCartCallback) {
        openCartCallback()
      }
    } catch (error) {
      console.error("Error en animación del carrito:", error)
      throw error
    }
  }

  const clearAnimation = () => {
    setAnimationItem(null)
  }

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true)
      await cartApi.removeItem(itemId)
      await refreshCart()
    } catch (error) {
      console.error("Error al eliminar item:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      setLoading(true)
      await cartApi.updateItem(itemId, { quantity })
      await refreshCart()
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      await cartApi.clearCart()
      setItems([])
    } catch (error) {
      console.error("Error al vaciar carrito:", error)
      throw error
    } finally {
      setLoading(false)
    }
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
      loading,
      openCart,
      setOpenCart,
      triggerCartAnimation,
      animationItem,
      clearAnimation,
      refreshCart,
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

// Helper para mapear items de la API al formato del contexto
function mapCartItems(cart: Cart): CartItem[] {
  if (!cart || !cart.items || cart.items.length === 0) {
    return []
  }
  return cart.items.map((item: ApiCartItem) => ({
    id: item.id,
    variantId: item.variantId,
    name: item.product.name,
    color: item.variant.color || "Sin especificar",
    size: item.variant.size,
    price: item.price,
    quantity: item.quantity,
    image: item.variant.imageUrl || item.product.images[0] || "",
    stock: item.variant.stock,
  }))
}
