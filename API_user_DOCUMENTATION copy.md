
## 📦 Modelos de Datos

### UserDto (Respuesta)
Representa un usuario completo con toda su información.

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "roleId": "223e4567-e89b-12d3-a456-426614174001",
  "role": "CLIENTE",
  "documentNumber": "1234567890",
  "status": "ACTIVE",
  "createdAt": "2024-11-15T10:30:00",
  "updatedAt": "2024-11-15T10:30:00"
}
```

**Campos:**
- `id` (UUID): ID único del usuario
- `name` (String): Nombre completo del usuario
- `email` (String): Correo electrónico (único)
- `phoneNumber` (String, opcional): Número de teléfono celular
- `roleId` (UUID): ID del rol asignado
- `role` (UserRole enum): Rol del usuario (`ADMIN` o `CLIENTE`)
- `documentNumber` (String, opcional): Número de documento de identidad
- `status` (UserStatus enum): Estado del usuario. Valores:
  - `ACTIVE`: Usuario activo (por defecto)
  - `INACTIVE`: Usuario inactivo
  - `DELETED`: Usuario eliminado (soft delete)
- `createdAt` (DateTime): Fecha de creación
- `updatedAt` (DateTime): Fecha de última actualización

### CreateUserRequest (Request)
Datos necesarios para crear o actualizar un usuario.

```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "password": "miPassword123",
  "role": "CLIENTE",
  "documentNumber": "1234567890"
}
```

**Campos:**
- `name` (String, requerido): Nombre completo del usuario
- `email` (String, requerido): Correo electrónico (debe ser válido y único)
- `phoneNumber` (String, opcional): Número de teléfono celular
- `password` (String, requerido): Contraseña del usuario (se encripta automáticamente)
- `role` (UserRole enum, requerido): Rol del usuario. Valores permitidos:
  - `ADMIN`: Administrador del sistema
  - `CLIENTE`: Cliente que puede realizar compras
- `documentNumber` (String, opcional): Número de documento de identidad (debe ser único si se proporciona)

**Validaciones:**
- `name`: No puede estar vacío
- `email`: Debe ser un email válido y único en el sistema
- `password`: No puede estar vacío (se encripta con BCrypt antes de guardar)
- `role`: Debe ser `ADMIN` o `CLIENTE`
- `documentNumber`: Si se proporciona, debe ser único en el sistema

---

## 📥 ENDPOINTS GET

### 1. Obtener Todos los Usuarios

**Endpoint:** `GET /users`

**Descripción:** Retorna una lista de todos los usuarios registrados en el sistema.

**Parámetros:** Ninguno

**Ejemplo de Request:**
```http
GET /api/users
```

**cURL Ejemplo:**
```bash
curl http://localhost:8080/api/users
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phoneNumber": "+57 300 1234567",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "1234567890",
    "createdAt": "2024-11-15T10:30:00",
    "updatedAt": "2024-11-15T10:30:00"
  },
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "name": "María García",
    "email": "maria.garcia@example.com",
    "phoneNumber": "+57 301 9876543",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "9876543210",
    "createdAt": "2024-11-14T09:20:00",
    "updatedAt": "2024-11-14T09:20:00"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Usuarios obtenidos exitosamente (puede retornar array vacío si no hay usuarios activos)
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- Solo se retornan usuarios con status `ACTIVE` o `INACTIVE`
- Los usuarios con status `DELETED` no aparecen en los resultados

---

### 2. Obtener Usuario por ID

**Endpoint:** `GET /users/{id}`

**Descripción:** Busca un usuario específico por su ID único (UUID).

**Parámetros de Path:**
- `id` (UUID, requerido): ID único del usuario

**Ejemplo de Request:**
```http
GET /api/users/123e4567-e89b-12d3-a456-426614174000
```

**cURL Ejemplo:**
```bash
curl http://localhost:8080/api/users/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "roleId": "223e4567-e89b-12d3-a456-426614174001",
  "role": "CLIENTE",
  "documentNumber": "1234567890",
  "status": "ACTIVE",
  "createdAt": "2024-11-15T10:30:00",
  "updatedAt": "2024-11-15T10:30:00"
}
```

**Códigos de Respuesta:**
- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no encontrado o eliminado
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- Solo se retornan usuarios con status `ACTIVE` o `INACTIVE`
- Los usuarios con status `DELETED` retornan `404 Not Found`

---

### 3. Obtener Usuario por Email

**Endpoint:** `GET /users/email/{email}`

**Descripción:** Busca un usuario específico por su correo electrónico.

**Parámetros de Path:**
- `email` (String, requerido): Email del usuario

**Ejemplo de Request:**
```http
GET /api/users/email/juan.perez@example.com
```

**cURL Ejemplo:**
```bash
curl http://localhost:8080/api/users/email/juan.perez@example.com
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "roleId": "223e4567-e89b-12d3-a456-426614174001",
  "role": "CLIENTE",
  "documentNumber": "1234567890",
  "status": "ACTIVE",
  "createdAt": "2024-11-15T10:30:00",
  "updatedAt": "2024-11-15T10:30:00"
}
```

**Códigos de Respuesta:**
- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no encontrado o eliminado
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- Solo se retornan usuarios con status `ACTIVE` o `INACTIVE`
- Los usuarios con status `DELETED` retornan `404 Not Found`

**Notas Importantes:**
- El email debe coincidir exactamente (case-sensitive)
- El email debe estar codificado en la URL si contiene caracteres especiales

---

### 4. Buscar Usuarios

**Endpoint:** `GET /users/search`

**Descripción:** Busca usuarios por múltiples criterios: nombre, email, número de documento, teléfono o rol. Todos los parámetros son opcionales y se combinan con AND (todos deben cumplirse). Las búsquedas de texto son parciales (LIKE).

**Parámetros de Query:**
- `name` (String, opcional): Nombre del usuario (búsqueda parcial, case-insensitive)
- `email` (String, opcional): Email del usuario (búsqueda parcial, case-insensitive)
- `documentNumber` (String, opcional): Número de documento del usuario (búsqueda parcial)
- `phoneNumber` (String, opcional): Número de teléfono del usuario (búsqueda parcial)
- `role` (UserRole enum, opcional): Rol del usuario. Valores: `ADMIN` o `CLIENTE`

**Ejemplos de Request:**

```http
# Buscar por nombre
GET /api/users/search?name=Juan

# Buscar por email
GET /api/users/search?email=juan@example.com

# Buscar por número de documento
GET /api/users/search?documentNumber=1234567890

# Buscar por teléfono
GET /api/users/search?phoneNumber=3001234567

# Buscar por rol
GET /api/users/search?role=CLIENTE

# Búsqueda combinada (todos los criterios deben cumplirse)
GET /api/users/search?name=Juan&email=juan&role=CLIENTE

# Buscar todos los clientes con nombre que contenga "María"
GET /api/users/search?name=María&role=CLIENTE
```

**cURL Ejemplos:**
```bash
# Buscar por nombre
curl "http://localhost:8080/api/users/search?name=Juan"

# Buscar por email
curl "http://localhost:8080/api/users/search?email=juan@example.com"

# Buscar por rol
curl "http://localhost:8080/api/users/search?role=CLIENTE"

# Búsqueda combinada
curl "http://localhost:8080/api/users/search?name=Juan&email=juan&role=CLIENTE"
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phoneNumber": "+57 300 1234567",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "1234567890",
    "createdAt": "2024-11-15T10:30:00",
    "updatedAt": "2024-11-15T10:30:00"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Usuarios encontrados exitosamente (puede retornar array vacío si no hay coincidencias)
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- Si no se proporciona ningún parámetro, se retornan todos los usuarios activos (excluyendo eliminados)
- Los usuarios con status `DELETED` no aparecen en los resultados
- Los resultados están ordenados por fecha de creación descendente (más recientes primero)
- Las búsquedas de texto son parciales: no es necesario el texto completo
- Las búsquedas de nombre y email son case-insensitive (no distinguen mayúsculas/minúsculas)
- Los múltiples criterios se combinan con AND: todos deben cumplirse
- El parámetro `role` debe ser exactamente `ADMIN` o `CLIENTE` (case-sensitive)

---


### 4. Obtener Usuarios por Rol(es)

**Endpoint:** `GET /users/by-role`

**Descripción:** Retorna todos los usuarios con uno o varios roles específicos. Este endpoint es ideal para separar administradores de clientes en diferentes secciones del frontend, y permite filtrar por múltiples roles simultáneamente. Útil para:
- **Sección de Usuarios/Administradores**: Obtener solo usuarios con rol `ADMIN`
- **Sección de Clientes**: Obtener solo usuarios con rol `CLIENTE`
- **Múltiples roles**: Obtener usuarios que tengan cualquiera de los roles especificados (ej: `ADMIN` y otros roles futuros)

**Parámetros de Query:**
- `roles` (List<UserRole>, requerido): Uno o varios roles del usuario. Puede especificarse de dos formas:
  - **Un solo parámetro con valores separados por comas**: `?roles=ADMIN,CLIENTE`
  - **Múltiples parámetros**: `?roles=ADMIN&roles=CLIENTE`
  
  Valores permitidos:
  - `ADMIN`: Administradores del sistema
  - `CLIENTE`: Clientes que pueden realizar compras

**Ejemplos de Request:**
```http
# Obtener todos los clientes
GET /api/users/by-role?roles=CLIENTE

# Obtener todos los administradores
GET /api/users/by-role?roles=ADMIN

# Obtener administradores y clientes (todos los usuarios)
GET /api/users/by-role?roles=ADMIN,CLIENTE

# Múltiples parámetros (mismo resultado que el anterior)
GET /api/users/by-role?roles=ADMIN&roles=CLIENTE
```

**cURL Ejemplos:**
```bash
# Obtener todos los clientes
curl "http://localhost:8080/api/users/by-role?roles=CLIENTE"

# Obtener todos los administradores
curl "http://localhost:8080/api/users/by-role?roles=ADMIN"

# Obtener administradores y clientes
curl "http://localhost:8080/api/users/by-role?roles=ADMIN,CLIENTE"

# Múltiples parámetros
curl "http://localhost:8080/api/users/by-role?roles=ADMIN&roles=CLIENTE"
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phoneNumber": "+57 300 1234567",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "1234567890",
    "status": "ACTIVE",
    "createdAt": "2024-11-15T10:30:00",
    "updatedAt": "2024-11-15T10:30:00"
  },
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "name": "María García",
    "email": "maria.garcia@example.com",
    "phoneNumber": "+57 301 9876543",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "9876543210",
    "status": "ACTIVE",
    "createdAt": "2024-11-14T09:20:00",
    "updatedAt": "2024-11-14T09:20:00"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Usuarios obtenidos exitosamente (puede retornar array vacío si no hay usuarios con esos roles)
- `400 Bad Request`: No se proporcionaron roles o roles inválidos (deben ser `ADMIN` o `CLIENTE`)
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- Solo se retornan usuarios con status `ACTIVE` o `INACTIVE`
- Los usuarios con status `DELETED` no aparecen en los resultados
- Los resultados están ordenados por fecha de creación descendente (más recientes primero)
- Los roles deben ser exactamente `ADMIN` o `CLIENTE` (case-sensitive)
- **Filtro OR**: Si se especifican múltiples roles, se retornan usuarios que tengan **cualquiera** de los roles especificados
- **Uso recomendado**: Este endpoint es más eficiente y semánticamente claro que usar `/users/search?role=CLIENTE` cuando solo necesitas filtrar por rol(es)
- **Flexibilidad**: Permite filtrar por un solo rol o múltiples roles según las necesidades del frontend

**Casos de Uso:**
- **Panel de Administración**: `GET /users/by-role?roles=ADMIN` para mostrar solo administradores
- **Gestión de Clientes**: `GET /users/by-role?roles=CLIENTE` para mostrar solo clientes
- **Todos los usuarios (excepto eliminados)**: `GET /users/by-role?roles=ADMIN,CLIENTE`
- **Separación de secciones**: Evita mezclar administradores con clientes en el frontend
- **Futuros roles**: Si se agregan nuevos roles (ej: `AUXILIAR`), se pueden filtrar fácilmente: `GET /users/by-role?roles=ADMIN,AUXILIAR`

---

### 5. Búsqueda Unificada de Usuarios

**Endpoint:** `GET /users/search`

**Descripción:** Endpoint unificado para buscar usuarios con todos los filtros posibles. Todos los parámetros son opcionales y se combinan con AND (todos deben cumplirse). Este es el endpoint principal para todas las búsquedas de usuarios, permitiendo filtrar por texto, roles, estados y rango de fechas simultáneamente.

**Parámetros de Query:**
- `name` (String, opcional): Nombre del usuario (búsqueda parcial, case-insensitive)
- `email` (String, opcional): Email del usuario (búsqueda parcial, case-insensitive)
- `documentNumber` (String, opcional): Número de documento del usuario (búsqueda parcial)
- `phoneNumber` (String, opcional): Número de teléfono del usuario (búsqueda parcial)
- `roles` (List<UserRole>, opcional): Rol(es) del usuario. Múltiples valores separados por comas o múltiples parámetros. Valores: `ADMIN`, `CLIENTE`. Filtro OR (cualquiera de los roles)
- `statuses` (List<UserStatus>, opcional): Estado(s) del usuario. Múltiples valores separados por comas o múltiples parámetros. Valores: `ACTIVE`, `INACTIVE`, `DELETED`. Filtro OR (cualquiera de los estados)
- `startDate` (String, opcional): Fecha de inicio del rango de creación (ISO 8601: `YYYY-MM-DDTHH:mm:ss`)
- `endDate` (String, opcional): Fecha de fin del rango de creación (ISO 8601: `YYYY-MM-DDTHH:mm:ss`)

**Ejemplos de Request:**

```http
# Buscar por nombre
GET /api/users/search?name=Juan

# Buscar por email
GET /api/users/search?email=juan@example.com

# Buscar por número de documento
GET /api/users/search?documentNumber=1234567890

# Buscar por teléfono
GET /api/users/search?phoneNumber=3001234567

# Solo clientes activos
GET /api/users/search?roles=CLIENTE&statuses=ACTIVE

# Clientes activos e inactivos (excluyendo eliminados)
GET /api/users/search?roles=CLIENTE&statuses=ACTIVE,INACTIVE

# Solo administradores
GET /api/users/search?roles=ADMIN

# Administradores y clientes activos
GET /api/users/search?roles=ADMIN,CLIENTE&statuses=ACTIVE

# Clientes creados en noviembre 2024
GET /api/users/search?roles=CLIENTE&startDate=2024-11-01T00:00:00&endDate=2024-11-30T23:59:59

# Buscar por nombre y rol (clientes activos)
GET /api/users/search?name=Juan&roles=CLIENTE&statuses=ACTIVE

# Todos los usuarios inactivos
GET /api/users/search?statuses=INACTIVE

# Buscar todos los clientes con nombre que contenga "María" y que estén activos
GET /api/users/search?name=María&roles=CLIENTE&statuses=ACTIVE
```

**cURL Ejemplos:**
```bash
# Buscar por nombre
curl "http://localhost:8080/api/users/search?name=Juan"

# Buscar por email
curl "http://localhost:8080/api/users/search?email=juan@example.com"

# Solo clientes activos
curl "http://localhost:8080/api/users/search?roles=CLIENTE&statuses=ACTIVE"

# Clientes activos e inactivos
curl "http://localhost:8080/api/users/search?roles=CLIENTE&statuses=ACTIVE,INACTIVE"

# Administradores creados en noviembre
curl "http://localhost:8080/api/users/search?roles=ADMIN&startDate=2024-11-01T00:00:00&endDate=2024-11-30T23:59:59"

# Búsqueda combinada
curl "http://localhost:8080/api/users/search?name=Juan&roles=CLIENTE&statuses=ACTIVE"
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phoneNumber": "+57 300 1234567",
    "roleId": "223e4567-e89b-12d3-a456-426614174001",
    "role": "CLIENTE",
    "documentNumber": "1234567890",
    "createdAt": "2024-11-15T10:30:00",
    "updatedAt": "2024-11-15T10:30:00"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Usuarios encontrados exitosamente (puede retornar array vacío si no hay coincidencias)
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- **Todos los parámetros son opcionales**: Si no se proporciona ningún parámetro, se retornan todos los usuarios (incluyendo eliminados si no se filtra por status)
- **Filtro por defecto**: Si no especificas `statuses`, **NO se excluyen automáticamente los eliminados**. Debes especificar explícitamente `statuses=ACTIVE,INACTIVE` si quieres excluir eliminados
- **Filtros AND**: Todos los parámetros proporcionados se combinan con AND (todos deben cumplirse)
- **Filtros OR para roles y estados**: 
  - `roles=ADMIN,CLIENTE` retorna usuarios que tengan **cualquiera** de esos roles
  - `statuses=ACTIVE,INACTIVE` retorna usuarios que tengan **cualquiera** de esos estados
- **Rango de fechas**: 
  - Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
  - Si solo se proporciona `startDate`, se buscan usuarios desde esa fecha hasta ahora
  - Si solo se proporciona `endDate`, se buscan usuarios desde siempre hasta esa fecha
  - Si se proporcionan ambas, se valida que `startDate <= endDate`
- **Búsquedas de texto**: Son parciales (LIKE) - no es necesario el texto completo
- **Case-insensitive**: Las búsquedas de nombre y email no distinguen mayúsculas/minúsculas
- **Ordenamiento**: Los resultados están ordenados por fecha de creación descendente (más recientes primero)
- **Roles y estados**: Deben ser exactamente `ADMIN` o `CLIENTE` para roles, y `ACTIVE`, `INACTIVE` o `DELETED` para estados (case-sensitive)

**Casos de Uso Comunes:**
- **Sección de Clientes (solo activos)**: `?roles=CLIENTE&statuses=ACTIVE`
- **Sección de Usuarios/Administradores**: `?roles=ADMIN&statuses=ACTIVE,INACTIVE`
- **Todos los usuarios activos**: `?statuses=ACTIVE`
- **Clientes inactivos**: `?roles=CLIENTE&statuses=INACTIVE`
- **Reporte mensual de clientes**: `?roles=CLIENTE&startDate=2024-11-01T00:00:00&endDate=2024-11-30T23:59:59`

---

## ✏️ ENDPOINTS POST

### 1. Crear Nuevo Usuario

**Endpoint:** `POST /users`

**Descripción:** Crea un nuevo usuario/cliente en el sistema. El rol se especifica usando el enum UserRole (`ADMIN` o `CLIENTE`). La contraseña se encripta automáticamente con BCrypt antes de guardarse.

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "password": "miPassword123",
  "role": "CLIENTE",
  "documentNumber": "1234567890"
}
```

**Ejemplo de Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "password": "miPassword123",
  "role": "CLIENTE",
  "documentNumber": "1234567890"
}
```

**cURL Ejemplo:**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phoneNumber": "+57 300 1234567",
    "password": "miPassword123",
    "role": "CLIENTE",
    "documentNumber": "1234567890"
  }'
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phoneNumber": "+57 300 1234567",
  "roleId": "223e4567-e89b-12d3-a456-426614174001",
  "role": "CLIENTE",
  "documentNumber": "1234567890",
  "status": "ACTIVE",
  "createdAt": "2024-11-15T10:30:00",
  "updatedAt": "2024-11-15T10:30:00"
}
```

**Códigos de Respuesta:**
- `201 Created`: Usuario creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos (validaciones fallidas)
- `409 Conflict`: Ya existe un usuario con el mismo email o documento
- `500 Internal Server Error`: Error interno del servidor

**Validaciones:**
- `name`: No puede estar vacío
- `email`: Debe ser un email válido y único en el sistema
- `password`: No puede estar vacío (se encripta automáticamente)
- `role`: Debe ser `ADMIN` o `CLIENTE`
- `documentNumber`: Si se proporciona, debe ser único en el sistema

**Notas Importantes:**
- La contraseña se encripta automáticamente con BCrypt antes de guardarse
- El email debe ser único en el sistema (solo entre usuarios activos)
- El número de documento debe ser único si se proporciona (solo entre usuarios activos)
- El rol se crea automáticamente si no existe en la base de datos
- **Reactivación automática**: Si se intenta crear un usuario con un email o documento que pertenece a un usuario eliminado (status = DELETED), el sistema automáticamente reactivará ese usuario y actualizará sus datos con la información proporcionada
- El status se establece automáticamente como `ACTIVE` para nuevos usuarios

---

## 🔄 ENDPOINTS PUT


## 🔄 ENDPOINTS PUT

### 1. Actualizar Usuario Existente

**Endpoint:** `PUT /users/{id}`

**Descripción:** Actualiza los datos de un usuario existente. Todos los campos se actualizan con los valores proporcionados. **La contraseña es opcional**: si se envía vacía o no se proporciona, se mantiene la contraseña actual del usuario. Si se proporciona una nueva contraseña, se encripta automáticamente antes de guardarse.

**Parámetros de Path:**
- `id` (UUID, requerido): ID único del usuario a actualizar

**Body (JSON):**
```json
{
  "name": "Juan Pérez Actualizado",
  "email": "juan.perez.nuevo@example.com",
  "phoneNumber": "+57 301 9876543",
  "password": "nuevaPassword123",
  "role": "ADMIN",
  "documentNumber": "1234567890"
}
```

**Nota sobre la contraseña:** El campo `password` es opcional. Si se envía vacío (`""`), `null` o se omite, se mantiene la contraseña actual del usuario. Si se proporciona un valor, se actualiza la contraseña.

**Ejemplo de Request:**
```http
PUT /api/users/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "Juan Pérez Actualizado",
  "email": "juan.perez.nuevo@example.com",
  "phoneNumber": "+57 301 9876543",
  "password": "nuevaPassword123",
  "role": "ADMIN",
  "documentNumber": "1234567890"
}
```

**cURL Ejemplo:**
```bash
curl -X PUT http://localhost:8080/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "email": "juan.perez.nuevo@example.com",
    "phoneNumber": "+57 301 9876543",
    "password": "nuevaPassword123",
    "role": "ADMIN",
    "documentNumber": "1234567890"
  }'
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez Actualizado",
  "email": "juan.perez.nuevo@example.com",
  "phoneNumber": "+57 301 9876543",
  "roleId": "423e4567-e89b-12d3-a456-426614174003",
  "role": "ADMIN",
  "documentNumber": "1234567890",
  "createdAt": "2024-11-15T10:30:00",
  "updatedAt": "2024-11-15T11:45:00"
}
```

**Códigos de Respuesta:**
- `200 OK`: Usuario actualizado exitosamente
- `400 Bad Request`: Datos de entrada inválidos o usuario no encontrado
- `404 Not Found`: Usuario no encontrado
- `409 Conflict`: Ya existe un usuario con el mismo email o documento
- `500 Internal Server Error`: Error interno del servidor

**Validaciones:**
- El usuario debe existir (ID válido)
- `name`: No puede estar vacío
- `email`: Debe ser un email válido y único en el sistema (excluyendo el usuario actual)
- `password`: **Opcional**. Si se proporciona, se encripta automáticamente. Si está vacío o se omite, se mantiene la contraseña actual
- `role`: Debe ser `ADMIN` o `CLIENTE`
- `documentNumber`: Si se proporciona, debe ser único en el sistema (excluyendo el usuario actual)

**Notas Importantes:**
- Todos los campos se actualizan, excepto la contraseña si no se proporciona
- **Contraseña opcional**: Si el campo `password` está vacío, `null` o se omite, se mantiene la contraseña actual del usuario
- Si se proporciona una nueva contraseña, se encripta automáticamente con BCrypt
- El email y documento deben ser únicos, pero se excluye el usuario actual de la validación

---

## 🗑️ ENDPOINTS DELETE

### 1. Eliminar Usuario (Soft Delete)

**Endpoint:** `DELETE /users/{id}`

**Descripción:** Elimina un usuario existente del sistema mediante soft delete. El usuario no se elimina físicamente de la base de datos, sino que se marca con status `DELETED`. Los usuarios eliminados no aparecen en ninguna consulta GET, pero pueden ser reactivados automáticamente si se intenta crear un nuevo usuario con el mismo email o documento.

**Parámetros de Path:**
- `id` (UUID, requerido): ID único del usuario a eliminar

**Ejemplo de Request:**
```http
DELETE /api/users/123e4567-e89b-12d3-a456-426614174000
```

**cURL Ejemplo:**
```bash
curl -X DELETE http://localhost:8080/api/users/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta Exitosa (204 No Content):**
```
(No body)
```

**Códigos de Respuesta:**
- `204 No Content`: Usuario marcado como eliminado exitosamente
- `404 Not Found`: Usuario no encontrado o ya eliminado
- `500 Internal Server Error`: Error interno del servidor

**Notas Importantes:**
- **Soft Delete**: La eliminación no es permanente. El usuario se marca con `status = DELETED`
- Los usuarios eliminados (`DELETED`) no aparecen en ninguna consulta GET (getAllUsers, getUserById, getUserByEmail, searchUsers)
- **Reactivación automática**: Si se intenta crear un usuario con el mismo email o documento de un usuario eliminado, el sistema automáticamente reactivará ese usuario y actualizará sus datos
- El usuario eliminado mantiene su ID y relaciones con órdenes, pero no es visible en las consultas normales

---

## 🔄 Flujos de Trabajo Comunes

### Flujo 1: Crear y Gestionar un Nuevo Cliente
```
1. POST /users - Crear nuevo cliente
2. GET /users/{id} - Verificar que se creó correctamente
3. PUT /users/{id} - Actualizar datos si es necesario
4. GET /users/search?email={email} - Buscar por email
```

### Flujo 2: Buscar Cliente por Email o Documento
```
1. GET /users/email/{email} - Buscar por email exacto
2. GET /users/search?documentNumber={doc} - Buscar por documento
3. GET /users/search?name={nombre} - Buscar por nombre parcial
```

### Flujo 3: Listar y Filtrar Usuarios
```
1. GET /users - Obtener todos los usuarios
2. GET /users/search?role=CLIENTE - Filtrar solo clientes
3. GET /users/search?role=ADMIN - Filtrar solo administradores
4. GET /users/search?name=Juan&role=CLIENTE - Búsqueda combinada
```

### Flujo 4: Actualizar Datos de Usuario
```
1. GET /users/{id} - Obtener datos actuales
2. PUT /users/{id} - Actualizar con nuevos datos
3. GET /users/{id} - Verificar cambios
```

### Flujo 5: Eliminar y Reactivar Usuario
```
1. GET /users/{id} - Verificar que existe
2. DELETE /users/{id} - Eliminar usuario (soft delete)
3. GET /users/{id} - Verificar que fue eliminado (debe retornar 404)
4. POST /users - Crear usuario con mismo email/documento (se reactiva automáticamente)
5. GET /users/{id} - Verificar que fue reactivado
```

---

## ⚠️ Manejo de Errores

### Errores Comunes

**400 Bad Request - Datos Inválidos**
```json
{
  "timestamp": "2024-11-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Datos de entrada inválidos"
}
```

**404 Not Found - Usuario No Encontrado**
```json
{
  "timestamp": "2024-11-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Usuario no encontrado"
}
```

**409 Conflict - Email o Documento Duplicado**
```json
{
  "timestamp": "2024-11-15T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Ya existe un usuario con el email: juan.perez@example.com"
}
```

**500 Internal Server Error**
```json
{
  "timestamp": "2024-11-15T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error interno del servidor"
}
```

---