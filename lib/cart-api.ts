// Cart API Services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Types
export interface CartItem {
  id: string
  variantId: string
  variant: {
    id: string
    sku: string
    color?: string
    size?: string
    price: number
    stock: number
    imageUrl?: string
    isActive: boolean
  }
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
  quantity: number
  price: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId?: string
  sessionId: string
  items: CartItem[]
  subtotal: number
  itemCount: number
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  variantId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// API Functions
export const cartApi = {
  /**
   * Obtiene el carrito actual
   */
  async getCart(): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      credentials: 'include', // Importante para enviar cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener el carrito')
    }

    return response.json()
  },

  /**
   * Agrega un item al carrito
   */
  async addItem(request: AddToCartRequest): Promise<CartItem> {
    console.log('Enviando al carrito:', request)
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Error al agregar item al carrito')
    }

    return response.json()
  },

  /**
   * Actualiza la cantidad de un item
   */
  async updateItem(itemId: string, request: UpdateCartItemRequest): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Error al actualizar item')
    }

    return response.json()
  },

  /**
   * Elimina un item del carrito
   */
  async removeItem(itemId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al eliminar item del carrito')
    }
  },

  /**
   * Vacía el carrito
   */
  async clearCart(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al vaciar el carrito')
    }
  },
}
