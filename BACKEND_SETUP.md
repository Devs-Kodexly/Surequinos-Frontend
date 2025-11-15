# 🚀 Backend Activado - Guía de Configuración

## ✅ Lo que se activó

### 1. **Tienda (app/tienda/page.tsx)**
- ✅ Hook `useShop()` activado para cargar productos desde el backend
- ✅ Estados de loading y error funcionando
- ✅ Filtros por categoría y búsqueda conectados al backend
- ✅ Productos se muestran con datos reales del API

### 2. **ProductCard (components/product-card.tsx)**
- ✅ Procesamiento de imágenes del backend con `cleanImageArray()`
- ✅ Manejo de variantes con precios dinámicos
- ✅ Navegación de imágenes entre producto y variantes
- ✅ Diseño mantenido exactamente igual

### 3. **Admin Productos (app/admin/productos/page.tsx)**
- ✅ Ya estaba funcional - sin cambios necesarios
- ✅ Formulario de creación de productos operativo
- ✅ Subida de imágenes funcionando
- ✅ Sistema de variantes completo

### 4. **Página de SALE/Ofertas (app/sale/page.tsx)**
- ✅ Hook `useSaleProducts()` activado
- ✅ Carga productos de categoría "Sale" u "Ofertas"
- ✅ Estados de loading, error y empty funcionando
- ✅ Diseño mantenido con badge de descuento

### 5. **Página de Producto Individual (app/producto/[slug]/page.tsx)**
- ⚠️ Actualmente usa datos hardcodeados
- 📝 Hook `useProductDetail()` creado para cargar por slug
- 🔄 Pendiente de integración (opcional)

## 🔧 Configuración del Backend

### Variable de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

O para producción:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.com/api
```

### Endpoints Requeridos

El backend debe tener estos endpoints funcionando:

#### Productos
- `GET /api/products/full` - Obtener todos los productos con variantes
- `GET /api/products/slug/{slug}` - Obtener producto por slug
- `POST /api/products/with-images` - Crear producto con imágenes
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto

#### Categorías
- `GET /api/categories/with-product-count` - Obtener categorías con conteo

#### Variantes
- `GET /api/variants/product/{productId}` - Obtener variantes de un producto
- `POST /api/variants/with-image` - Crear variante con imagen
- `PUT /api/variants/{id}` - Actualizar variante
- `DELETE /api/variants/{id}` - Eliminar variante

#### Imágenes
- `POST /api/images/product/{productId}` - Subir imagen de producto
- `POST /api/images/variant/{productId}/{variantSku}` - Subir imagen de variante
- `DELETE /api/images?imageUrl={url}` - Eliminar imagen

## 📊 Estructura de Datos

### Product (Backend Response)
```typescript
{
  id: string
  name: string
  slug: string
  description?: string
  images: string[]  // Array de URLs
  basePrice: number
  isActive: boolean
  categoryId: string
  category?: string
  categorySlug?: string
  variants: Variant[]
  minPrice?: number  // Calculado
  maxPrice?: number  // Calculado
  totalStock?: number  // Calculado
  hasStock?: boolean  // Calculado
}
```

### Variant (Backend Response)
```typescript
{
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
}
```

## 🎨 Diseño Mantenido

El diseño de las cards se mantiene **exactamente igual**:
- ✅ Badges de stock y estado
- ✅ Navegación de imágenes con flechas
- ✅ Indicadores de puntos
- ✅ Selector de tallas y colores
- ✅ Tabla de tallas modal
- ✅ Botones de añadir y detalles
- ✅ Responsive design completo

## 🧪 Cómo Probar

### 1. Sin Backend (Fallback)
Si el backend no está disponible, verás:
- Estado de error con mensaje
- Botón para reintentar
- No se rompe la aplicación

### 2. Con Backend
1. Inicia tu backend en `http://localhost:8080`
2. Asegúrate de que los endpoints respondan correctamente
3. Inicia el frontend: `npm run dev`
4. Ve a `/tienda` para ver productos
5. Ve a `/admin/productos` para crear productos

## 📝 Notas Importantes

### Imágenes
- Las imágenes se procesan con `cleanImageArray()` y `cleanImageUrl()`
- Soporta formato de PostgreSQL: `{url1,url2,url3}`
- Soporta arrays normales: `["url1", "url2"]`
- Soporta strings simples: `"url"`

### Variantes
- Cada producto puede tener múltiples variantes
- Las variantes tienen su propia imagen
- El precio se calcula dinámicamente según la variante seleccionada
- Se muestra rango de precios si hay variación

### Categorías
- El filtro "Todos" muestra todos los productos
- Las categorías se cargan dinámicamente del backend
- El conteo de productos por categoría es automático

## 🐛 Troubleshooting

### "Error cargando productos"
- Verifica que el backend esté corriendo
- Revisa la URL en `.env.local`
- Abre la consola del navegador para ver el error exacto
- Verifica que los endpoints respondan correctamente

### "No hay productos disponibles"
- Verifica que haya productos en la base de datos
- Asegúrate de que `isActive: true` en los productos
- Revisa que las categorías estén correctamente asignadas

### Imágenes no se muestran
- Verifica que las URLs sean absolutas (http:// o https://)
- Revisa que el servidor de imágenes tenga CORS habilitado
- Asegúrate de que las imágenes existan en el servidor

## 🎯 Próximos Pasos

1. **Configurar el backend** con los endpoints requeridos
2. **Crear productos de prueba** desde el admin
3. **Verificar que se muestren** en la tienda
4. **Probar filtros y búsqueda**
5. **Configurar producción** con la URL real del backend
