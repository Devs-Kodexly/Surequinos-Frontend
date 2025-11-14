# Integración Backend-Frontend Surequinos

## 🚀 Configuración Completa

### Backend (Spring Boot)
1. **Iniciar el backend**:
   ```bash
   cd surequinos-backend
   mvn spring-boot:run
   ```
   - Servidor: `http://localhost:8080/api`
   - Swagger: `http://localhost:8080/api/swagger-ui.html`

2. **Configurar Cloudflare R2**:
   - Editar `application.properties`
   - Agregar credenciales reales de Cloudflare R2

### Frontend (Next.js)
1. **Instalar dependencias**:
   ```bash
   cd surequinos-frontend
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Iniciar el frontend**:
   ```bash
   npm run dev
   ```
   - Servidor: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin/productos`

## 📋 Funcionalidades Implementadas

### ✅ Gestión de Productos
- **Crear productos** con imágenes múltiples
- **Crear variantes** con imágenes específicas
- **Listado completo** con búsqueda y filtros
- **Eliminación** de productos
- **Validación** de formularios

### ✅ Gestión de Imágenes
- **Subida a Cloudflare R2** automática
- **Previsualización** de imágenes
- **Validación** de tipos y tamaños
- **Eliminación** de imágenes

### ✅ Gestión de Variantes
- **Múltiples variantes** por producto
- **Atributos dinámicos**: color, talla, tipo
- **Precios individuales** por variante
- **Control de stock** por variante
- **Imágenes específicas** por variante

### ✅ Interfaz de Administración
- **Formulario completo** de creación
- **Listado responsivo** (móvil y desktop)
- **Estados de carga** y error
- **Notificaciones** de éxito/error
- **Búsqueda avanzada**

## 🔧 Arquitectura

### Backend
```
/api
├── /categories          # Gestión de categorías
├── /products           # CRUD de productos
├── /variants           # CRUD de variantes
├── /images             # Gestión de imágenes R2
└── /shop               # Endpoints optimizados para tienda
```

### Frontend
```
/admin/productos
├── ProductForm         # Formulario de creación
├── useProducts         # Hook para gestión de estado
├── api.ts              # Cliente API
└── Componentes UI      # Interfaz responsiva
```

## 📡 Flujo de Creación de Producto

1. **Usuario completa formulario**:
   - Información básica del producto
   - Subida de imágenes principales
   - Creación de variantes con atributos
   - Subida de imágenes específicas por variante

2. **Frontend procesa datos**:
   - Valida formulario
   - Prepara archivos de imagen
   - Genera SKUs automáticamente
   - Formatea precios

3. **Backend procesa request**:
   - Crea producto en base de datos
   - Sube imágenes a Cloudflare R2
   - Crea variantes asociadas
   - Retorna producto completo

4. **Frontend actualiza UI**:
   - Muestra notificación de éxito
   - Actualiza lista de productos
   - Cierra formulario

## 🎯 Características Técnicas

### Validaciones
- **Campos obligatorios**: Nombre, categoría, al menos una variante
- **Imágenes**: Tipos válidos (JPG, PNG, WebP), máximo 10MB
- **Precios**: Formato numérico con separadores de miles
- **SKUs**: Generación automática basada en atributos

### Optimizaciones
- **Lazy loading** de imágenes
- **Debounce** en búsquedas
- **Estados de carga** para mejor UX
- **Manejo de errores** robusto
- **Responsive design** completo

### Seguridad
- **Validación** en frontend y backend
- **Sanitización** de datos
- **CORS** configurado correctamente
- **Tipos de archivo** restringidos

## 🚨 Solución de Problemas

### Error de CORS
```bash
# Verificar que el backend esté corriendo en puerto 8080
# Verificar configuración en WebConfig.java
```

### Error de Cloudflare R2
```bash
# Verificar credenciales en application.properties
# Verificar que el bucket exista
# Verificar permisos del API token
```

### Error de conexión API
```bash
# Verificar NEXT_PUBLIC_API_URL en .env.local
# Verificar que ambos servidores estén corriendo
```

## 📈 Próximos Pasos

1. **Edición de productos** existentes
2. **Gestión de categorías** desde admin
3. **Dashboard** con estadísticas
4. **Gestión de stock** avanzada
5. **Optimización de imágenes** automática

## 🎉 ¡Listo para Usar!

La integración está completamente funcional. Puedes:

1. **Crear productos** con múltiples imágenes
2. **Agregar variantes** con atributos específicos
3. **Subir imágenes** a Cloudflare R2
4. **Gestionar inventario** completo
5. **Buscar y filtrar** productos

Todo está optimizado para producción y listo para escalar.