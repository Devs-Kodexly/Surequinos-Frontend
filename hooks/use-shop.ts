import { useState, useEffect, useMemo } from 'react'
import { api, Product, Category } from '@/lib/api'

export function useShop() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [productsData, categoriesData] = await Promise.all([
          api.getProductsFullView(),
          api.getCategoriesWithProductCount()
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Create categories array with "Todos" at the beginning
  const categoryOptions = useMemo(() => {
    const allCategories = ['Todos', ...categories.map(cat => cat.name)]
    return allCategories
  }, [categories])

  // Filter products based on search term and active category
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (activeCategory > 0 && categories.length > 0) {
      const selectedCategory = categories[activeCategory - 1]
      filtered = filtered.filter(product => 
        product.categoryId === selectedCategory.id ||
        product.categorySlug === selectedCategory.slug
      )
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.variants.some(variant =>
          variant.sku.toLowerCase().includes(term) ||
          variant.color?.toLowerCase().includes(term) ||
          variant.size?.toLowerCase().includes(term)
        )
      )
    }

    return filtered
  }, [products, categories, activeCategory, searchTerm])

  return {
    products: filteredProducts,
    allProducts: products,
    categories,
    categoryOptions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
  }
}