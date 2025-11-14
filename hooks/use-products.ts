import { useState, useEffect } from 'react'
import { api, Product, Category, Variant } from '@/lib/api'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProductsFullView()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const createProduct = async (productData: any, images: File[]) => {
    try {
      const newProduct = await api.createProductWithImages(productData, images)
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      throw err
    }
  }

  const updateProduct = async (id: string, productData: any) => {
    try {
      const updatedProduct = await api.updateProduct(id, productData)
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err) {
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCategoriesWithProductCount()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (categoryData: any) => {
    try {
      const newCategory = await api.createCategory(categoryData)
      setCategories(prev => [newCategory, ...prev])
      return newCategory
    } catch (err) {
      throw err
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
  }
}

export function useVariants(productId?: string) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVariants = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getVariantsByProductId(id)
      setVariants(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading variants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchVariants(productId)
    }
  }, [productId])

  const createVariant = async (variantData: any, image?: File) => {
    try {
      let newVariant: Variant
      if (image) {
        newVariant = await api.createVariantWithImage(variantData, image)
      } else {
        newVariant = await api.createVariant(variantData)
      }
      setVariants(prev => [newVariant, ...prev])
      return newVariant
    } catch (err) {
      throw err
    }
  }

  const updateVariant = async (id: string, variantData: any) => {
    try {
      const updatedVariant = await api.updateVariant(id, variantData)
      setVariants(prev => prev.map(v => v.id === id ? updatedVariant : v))
      return updatedVariant
    } catch (err) {
      throw err
    }
  }

  const deleteVariant = async (id: string) => {
    try {
      await api.deleteVariant(id)
      setVariants(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    variants,
    loading,
    error,
    fetchVariants,
    createVariant,
    updateVariant,
    deleteVariant,
  }
}