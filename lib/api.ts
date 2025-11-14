// API Configuration and Services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Types
export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  displayOrder: number
  createdAt: string
  subcategories?: Category[]
  productCount?: number
}

export interface Variant {
  id: string
  sku: string
  color?: string
  size?: string
  type?: string
  price: number
  stock: number
  imageUrl?: string
  isActive: boolean
  available: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  images: string[]
  basePrice: number
  isActive: boolean
  createdAt: string
  categoryId: string
  category?: string
  categorySlug?: string
  variants: Variant[]
  minPrice?: number
  maxPrice?: number
  totalStock?: number
  hasStock?: boolean
}

export interface CreateProductRequest {
  categoryId: string
  name: string
  slug: string
  description?: string
  basePrice: number
  isActive?: boolean
}

export interface CreateVariantRequest {
  productId: string
  sku: string
  color?: string
  size?: string
  type?: string
  price: number
  stock?: number
  isActive?: boolean
}

export interface ImageUploadResponse {
  success: boolean
  message: string
  imageUrl?: string
  imageUrls?: string[]
  timestamp: string
  details?: string
}

// API Client Class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Upload request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories')
  }

  async getCategoriesWithProductCount(): Promise<Category[]> {
    return this.request<Category[]>('/categories/with-product-count')
  }

  async createCategory(data: { name: string; slug: string; parentId?: string; displayOrder?: number }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Products API
  async getProducts(page = 0, size = 20): Promise<{ content: Product[]; totalElements: number; totalPages: number }> {
    return this.request<{ content: Product[]; totalElements: number; totalPages: number }>(`/products?page=${page}&size=${size}`)
  }

  async getProductsFullView(): Promise<Product[]> {
    return this.request<Product[]>('/products/full')
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/products/slug/${slug}`)
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createProductWithImages(productData: any, images: File[]): Promise<Product> {
    const formData = new FormData()
    
    // Add product data as JSON
    formData.append('product', JSON.stringify(productData))
    
    // Add images
    images.forEach((image, index) => {
      formData.append('images', image)
    })

    return this.uploadRequest<Product>('/products/with-images', formData)
  }

  async updateProduct(id: string, data: CreateProductRequest): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Variants API
  async getVariantsByProductId(productId: string): Promise<Variant[]> {
    return this.request<Variant[]>(`/variants/product/${productId}`)
  }

  async createVariant(data: CreateVariantRequest): Promise<Variant> {
    return this.request<Variant>('/variants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createVariantWithImage(variantData: any, image: File): Promise<Variant> {
    const formData = new FormData()
    
    // Add variant data as JSON
    formData.append('variant', JSON.stringify(variantData))
    
    // Add image
    formData.append('image', image)

    return this.uploadRequest<Variant>('/variants/with-image', formData)
  }

  async updateVariant(id: string, data: CreateVariantRequest): Promise<Variant> {
    return this.request<Variant>(`/variants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteVariant(id: string): Promise<void> {
    return this.request<void>(`/variants/${id}`, {
      method: 'DELETE',
    })
  }

  // Images API
  async uploadProductImage(productId: string, image: File): Promise<ImageUploadResponse> {
    const formData = new FormData()
    formData.append('image', image)

    return this.uploadRequest<ImageUploadResponse>(`/images/product/${productId}`, formData)
  }

  async uploadProductImages(productId: string, images: File[]): Promise<ImageUploadResponse> {
    const formData = new FormData()
    images.forEach(image => {
      formData.append('images', image)
    })

    return this.uploadRequest<ImageUploadResponse>(`/images/product/${productId}/multiple`, formData)
  }

  async uploadVariantImage(productId: string, variantSku: string, image: File): Promise<ImageUploadResponse> {
    const formData = new FormData()
    formData.append('image', image)

    return this.uploadRequest<ImageUploadResponse>(`/images/variant/${productId}/${variantSku}`, formData)
  }

  async deleteImage(imageUrl: string): Promise<ImageUploadResponse> {
    return this.request<ImageUploadResponse>(`/images?imageUrl=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    })
  }

  // Attribute Options API
  async getAttributeOptions(attributeName: string): Promise<{ value: string; displayOrder: number }[]> {
    // This would need to be implemented in the backend
    // For now, return static data
    const options: Record<string, string[]> = {
      color: ['Roble', 'Chocolate', 'Negro', 'Blanco', 'Rojo', 'Azul', 'Verde'],
      size: ['12"', '12.5"', '13"', '13.5"', '14"', '14.5"', '15"', '15.5"', '16"', '17"'],
      type: ['Americana', 'Trenzada', 'Nacional', 'Sencillo', 'De Lujo', 'Timbiano']
    }
    
    return (options[attributeName] || []).map((value, index) => ({
      value,
      displayOrder: index
    }))
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL)

// Utility functions
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

export const formatPriceInput = (value: string): string => {
  // Remove non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '')
  
  // Format with thousands separator
  const parts = numericValue.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return parts.join('.')
}

export const cleanImageUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined
  
  // Remove PostgreSQL array formatting
  let cleaned = url.trim()
  
  // Remove curly braces from PostgreSQL array format
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    cleaned = cleaned.slice(1, -1)
  }
  
  // Remove quotes
  cleaned = cleaned.replace(/^["']|["']$/g, '')
  
  // Validate URL format
  if (!cleaned.startsWith('http')) {
    return undefined
  }
  
  return cleaned
}

export const cleanImageArray = (images: string[] | string | undefined | null): string[] => {
  if (!images) return []
  
  if (typeof images === 'string') {
    // Handle single image or PostgreSQL array format
    let cleaned = images.trim()
    
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      // PostgreSQL array format: {url1,url2,url3}
      cleaned = cleaned.slice(1, -1)
      if (!cleaned.trim()) return []
      
      return cleaned
        .split(',')
        .map(url => cleanImageUrl(url))
        .filter((url): url is string => !!url)
    } else {
      // Single image
      const cleanedUrl = cleanImageUrl(cleaned)
      return cleanedUrl ? [cleanedUrl] : []
    }
  }
  
  if (Array.isArray(images)) {
    return images
      .map(url => cleanImageUrl(url))
      .filter((url): url is string => !!url)
  }
  
  return []
}