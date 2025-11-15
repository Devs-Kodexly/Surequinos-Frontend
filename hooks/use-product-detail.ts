import { useState, useEffect } from 'react'
import { api, Product } from '@/lib/api'

export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)
        const data = await api.getProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return {
    product,
    loading,
    error,
  }
}
