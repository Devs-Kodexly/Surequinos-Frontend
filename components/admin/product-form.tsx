"use client"

import { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/use-products'
import { generateSlug, formatPriceInput, api } from '@/lib/api'
import { useToast } from '@/lib/toast-context'

interface ProductFormProps {
  onClose: () => void
  onSuccess: (product: any) => void
}

interface VariantForm {
  id: string
  sku: string
  color: string
  sizes: string[]  // Array de tallas
  price: string
  stock: string
  image: File | null
  imagePreview: string | null
}

export function ProductForm({ onClose, onSuccess }: ProductFormProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const { showToast } = useToast()

  // Product form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    basePrice: '',
    isActive: true,
  })

  // Images state
  const [productImages, setProductImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Variants state
  const [variants, setVariants] = useState<VariantForm[]>([])

  // Attribute options
  const [colorOptions, setColorOptions] = useState<string[]>([])
  const [sizeOptions, setSizeOptions] = useState<string[]>([])

  // Loading state
  const [loading, setLoading] = useState(false)

  // Load attribute options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [colors, sizes] = await Promise.all([
          api.getAttributeOptions('color'),
          api.getAttributeOptions('size'),
        ])
        
        setColorOptions(colors.map(c => c.value))
        setSizeOptions(sizes.map(s => s.value))
      } catch (error) {
        console.error('Error loading attribute options:', error)
      }
    }

    loadOptions()
  }, [])

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.name)
      }))
    }
  }, [formData.name])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePriceChange = (value: string) => {
    const formatted = formatPriceInput(value)
    setFormData(prev => ({
      ...prev,
      basePrice: formatted
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Solo tomar la primera imagen
    
    const isValidType = file.type.startsWith('image/')
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
    
    if (!isValidType) {
      showToast(`${file.name} no es un archivo de imagen válido`, 'error')
      return
    }
    
    if (!isValidSize) {
      showToast(`${file.name} excede el tamaño máximo de 10MB`, 'error')
      return
    }

    // Reemplazar la imagen existente (solo una imagen de portada)
    setProductImages([file])

    // Generate preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreviews([e.target?.result as string])
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    setProductImages([])
    setImagePreviews([])
  }

  const addVariant = () => {
    const newVariant: VariantForm = {
      id: Date.now().toString(),
      sku: '',
      color: '',
      sizes: [],  // Array vacío de tallas
      price: '',
      stock: '0',
      image: null,
      imagePreview: null,
    }
    setVariants(prev => [...prev, newVariant])
  }

  const toggleSize = (variantId: string, size: string) => {
    setVariants(prev => prev.map(variant => {
      if (variant.id === variantId) {
        const sizes = variant.sizes.includes(size)
          ? variant.sizes.filter(s => s !== size)
          : [...variant.sizes, size]
        return { ...variant, sizes }
      }
      return variant
    }))
  }

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(prev => prev.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    ))
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(variant => variant.id !== id))
  }

  const handleVariantImageUpload = (variantId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateVariant(variantId, 'image', file)
      updateVariant(variantId, 'imagePreview', e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const generateVariantSku = (variant: VariantForm, size: string) => {
    const productPrefix = formData.name.substring(0, 3).toUpperCase()
    const color = variant.color ? variant.color.substring(0, 4).toUpperCase() : 'GEN'
    const sizeClean = size ? size.replace(/[^a-zA-Z0-9]/g, '') : ''
    
    return `${productPrefix}-${color}${sizeClean ? '-' + sizeClean : ''}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.categoryId) {
      showToast('Por favor completa los campos obligatorios', 'error')
      return
    }

    if (productImages.length === 0) {
      showToast('Por favor sube la imagen de portada del producto', 'error')
      return
    }

    if (variants.length === 0) {
      showToast('Por favor agrega al menos una variante', 'error')
      return
    }

    // Validar que todas las variantes tengan al menos una talla seleccionada
    const variantsWithoutSizes = variants.filter(v => v.sizes.length === 0)
    if (variantsWithoutSizes.length > 0) {
      showToast('Todas las variantes deben tener al menos una talla seleccionada', 'error')
      return
    }

    // Validar que todas las variantes tengan imagen
    const variantsWithoutImage = variants.filter(v => !v.image)
    if (variantsWithoutImage.length > 0) {
      showToast('Todas las variantes deben tener una imagen específica', 'error')
      return
    }

    setLoading(true)

    try {
      // Prepare product data
      const productData = {
        categoryId: formData.categoryId,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice.replace(/[^\d.]/g, '')),
        isActive: formData.isActive,
      }

      // Create product with images
      const createdProduct = await api.createProductWithImages(productData, productImages)

      // Create variants - Expandir cada variante por sus tallas
      for (const variant of variants) {
        console.log('🔄 Procesando variante:', {
          color: variant.color,
          sizes: variant.sizes,
          hasImage: !!variant.image,
          imageName: variant.image?.name
        })
        
        // Subir la imagen UNA SOLA VEZ para todas las tallas de esta variante
        let sharedImageUrl: string | undefined = undefined
        
        if (variant.image) {
          // Crear la primera variante con imagen para obtener la URL
          const firstSize = variant.sizes[0]
          const firstVariantData = {
            productId: createdProduct.id,
            sku: generateVariantSku(variant, firstSize),
            color: variant.color || undefined,
            size: firstSize || undefined,
            price: parseFloat(variant.price.replace(/[^\d.]/g, '')),
            stock: parseInt(variant.stock) || 0,
            isActive: true,
          }
          
          const createdVariant = await api.createVariantWithImage(firstVariantData, variant.image)
          sharedImageUrl = createdVariant.imageUrl
          
          // Crear el resto de variantes reutilizando la misma URL de imagen
          for (let i = 1; i < variant.sizes.length; i++) {
            const size = variant.sizes[i]
            const variantData = {
              productId: createdProduct.id,
              sku: generateVariantSku(variant, size),
              color: variant.color || undefined,
              size: size || undefined,
              price: parseFloat(variant.price.replace(/[^\d.]/g, '')),
              stock: parseInt(variant.stock) || 0,
              isActive: true,
              imageUrl: sharedImageUrl, // Reutilizar la misma URL
            }
            
            await api.createVariant(variantData)
          }
        } else {
          // Si no hay imagen, crear todas las variantes sin imagen
          for (const size of variant.sizes) {
            const variantData = {
              productId: createdProduct.id,
              sku: generateVariantSku(variant, size),
              color: variant.color || undefined,
              size: size || undefined,
              price: parseFloat(variant.price.replace(/[^\d.]/g, '')),
              stock: parseInt(variant.stock) || 0,
              isActive: true,
            }
            
            await api.createVariant(variantData)
          }
        }
      }

      showToast('Producto creado exitosamente', 'success')
      onSuccess(createdProduct)
      onClose()

    } catch (error) {
      console.error('Error creating product:', error)
      showToast(
        error instanceof Error ? error.message : 'Error creando el producto',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1A1311] border-b border-[#2a2a2a] p-6 flex items-center justify-between">
          <h2 className="text-[#E5AB4A] font-serif text-2xl font-bold">Crear Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Product Info */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">Información Básica</h3>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">Nombre del Producto*</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Silla Caucana Premium"
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Categoría*</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#E5AB4A]"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Precio Base</label>
                <input
                  type="text"
                  value={formData.basePrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="$ 0"
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe el producto..."
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
              />
            </div>
          </div>

          {/* Product Cover Image */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">Imagen de Portada del Producto</h3>
            <p className="text-gray-400 text-sm">Esta será la imagen principal que se muestra en la tienda antes de seleccionar variantes</p>
            
            {imagePreviews.length === 0 ? (
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Arrastra la imagen de portada aquí o haz clic para seleccionar</p>
                  <p className="text-gray-500 text-sm">Solo una imagen. Máximo 10MB. Formatos: JPG, PNG, WebP</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="product-cover-image"
                  />
                  <label
                    htmlFor="product-cover-image"
                    className="inline-block mt-4 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Seleccionar Imagen de Portada
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group max-w-xs">
                  <img
                    src={imagePreviews[0]}
                    alt="Imagen de portada"
                    className="w-full h-48 object-cover rounded-lg border border-[#2a2a2a]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="change-cover-image"
                  />
                  <label
                    htmlFor="change-cover-image"
                    className="inline-block bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm"
                  >
                    Cambiar Imagen de Portada
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-4 pt-8 border-t border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-lg">Variantes del Producto</h3>
              <Button
                type="button"
                onClick={addVariant}
                className="bg-[#E5AB4A] hover:bg-[#E5AB4A]/90 text-[#0F0B0A] px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Variante
              </Button>
            </div>

            {variants.map((variant, index) => (
              <div key={variant.id} className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-300 font-medium">Variante {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Color</label>
                    <select
                      value={variant.color}
                      onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                      className="w-full bg-[#1A1311] border border-[#2a2a2a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                    >
                      <option value="">Seleccionar color</option>
                      {colorOptions.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-gray-400 text-sm mb-3">Tallas (selecciona todas las que apliquen)</label>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map(size => (
                        <label
                          key={size}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                            variant.sizes.includes(size)
                              ? 'bg-[#E5AB4A] border-[#E5AB4A] text-[#0F0B0A]'
                              : 'bg-[#1A1311] border-[#2a2a2a] text-gray-300 hover:border-[#E5AB4A]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={variant.sizes.includes(size)}
                            onChange={() => toggleSize(variant.id, size)}
                            className="hidden"
                          />
                          <span className="font-medium">{size}</span>
                        </label>
                      ))}
                    </div>
                    {variant.sizes.length > 0 && (
                      <p className="text-[#E5AB4A] text-sm mt-2">
                        ✨ Se crearán {variant.sizes.length} variante{variant.sizes.length !== 1 ? 's' : ''} con estas tallas
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Precio*</label>
                    <input
                      type="text"
                      value={variant.price}
                      onChange={(e) => updateVariant(variant.id, 'price', formatPriceInput(e.target.value))}
                      placeholder="$ 0"
                      className="w-full bg-[#1A1311] border border-[#2a2a2a] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Stock</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full bg-[#1A1311] border border-[#2a2a2a] rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A]"
                    />
                  </div>
                </div>

                {/* Variant Image */}
                <div className="col-span-full">
                  <label className="block text-gray-400 text-sm mb-2">Imagen Específica de la Variante*</label>
                  <div className="flex items-center gap-4">
                    {variant.imagePreview ? (
                      <div className="relative">
                        <img
                          src={variant.imagePreview}
                          alt="Variant preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateVariant(variant.id, 'image', null)
                            updateVariant(variant.id, 'imagePreview', null)
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-[#2a2a2a] border-2 border-dashed border-[#3a3a3a] rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleVariantImageUpload(variant.id, file)
                        }}
                        className="hidden"
                        id={`variant-image-${variant.id}`}
                      />
                      <label
                        htmlFor={`variant-image-${variant.id}`}
                        className="inline-block bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm"
                      >
                        {variant.imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                      </label>
                      <p className="text-gray-500 text-xs mt-1">
                        Esta imagen se usará para todas las tallas de esta variante
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview de variantes que se crearán */}
                {variant.sizes.length > 0 && variant.color && (
                  <div className="col-span-full mt-2 p-3 bg-[#2a2a2a]/50 border border-[#3a3a3a] rounded-lg">
                    <p className="text-gray-400 text-sm mb-2 font-medium">Vista previa de variantes a crear:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {variant.sizes.map(size => (
                        <div key={size} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-[#E5AB4A]">•</span>
                          <span className="font-medium">{variant.color}</span>
                          <span className="text-gray-500">+</span>
                          <span className="font-medium">{size}</span>
                          <span className="text-gray-500 text-xs ml-auto">
                            SKU: {generateVariantSku(variant, size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {variants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay variantes agregadas.</p>
                <p className="text-sm">Haz clic en "Agregar Variante" para comenzar.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#2a2a2a]">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 py-3 rounded-lg flex-1 disabled:opacity-50"
            >
              {loading ? 'Creando Producto...' : 'Crear Producto'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] px-6 py-3 rounded-lg flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}