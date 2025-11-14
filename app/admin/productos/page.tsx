"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/admin/product-form"
import { useProducts } from "@/hooks/use-products"
import { formatPrice } from "@/lib/api"
import { useToast } from "@/lib/toast-context"

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts()
  const { showToast } = useToast()

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    
    const term = searchTerm.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.variants.some(variant => 
        variant.sku.toLowerCase().includes(term) ||
        variant.color?.toLowerCase().includes(term)
      )
    )
  }, [products, searchTerm])

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      return
    }

    try {
      await deleteProduct(productId)
      showToast('Producto eliminado exitosamente', 'success')
    } catch (error) {
      showToast('Error eliminando el producto', 'error')
    }
  }

  const handleProductCreated = () => {
    fetchProducts()
    showToast('Producto creado exitosamente', 'success')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Productos</h1>
          <p className="text-gray-400 text-sm sm:text-base">Administra tu catálogo de productos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSuccess={handleProductCreated}
        />
      )}

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos, SKU, colores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E5AB4A]"></div>
            <p className="text-gray-400 mt-2">Cargando productos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-2">Error cargando productos</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <Button
              onClick={fetchProducts}
              className="mt-4 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer producto'}
            </p>
          </div>
        )}

        {/* Products List */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {/* Vista móvil - Tarjetas */}
            <div className="block sm:hidden space-y-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-[#0F0B0A] border border-[#2a2a2a]/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-400 text-xs mb-2">{product.category}</p>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[#E5AB4A] text-sm font-medium">
                          {product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
                            ? `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
                            : formatPrice(product.minPrice || product.basePrice)
                          }
                        </span>
                        <span className="text-gray-400 text-xs">{product.totalStock || 0} unidades</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">{product.variants.length} variantes</span>
                        {product.hasStock && (
                          <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs">
                            En stock
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                        product.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2a2a2a]/50">
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-[#E5AB4A]" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop - Tabla */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Producto</th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Categoría</th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3">Precio</th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Stock</th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Variantes</th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 hidden md:table-cell">Estado</th>
                    <th className="text-right text-gray-400 text-xs sm:text-sm font-medium pb-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-[#2a2a2a]/50">
                      <td className="py-3 sm:py-4 text-xs sm:text-sm text-white font-medium">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-gray-500 text-xs">{product.slug}</div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300">{product.category}</td>
                      <td className="py-3 sm:py-4 text-xs sm:text-sm text-[#E5AB4A] font-medium">
                        {product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
                          ? `${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`
                          : formatPrice(product.minPrice || product.basePrice)
                        }
                      </td>
                      <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span>{product.totalStock || 0}</span>
                          {product.hasStock && (
                            <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs">
                              Disponible
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 text-xs sm:text-sm text-gray-300 hidden md:table-cell">
                        {product.variants.length} variantes
                      </td>
                      <td className="py-3 sm:py-4 hidden md:table-cell">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            product.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5AB4A]" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 sm:p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
