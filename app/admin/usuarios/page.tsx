"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, X, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { api, UserDto, UpdateUserRequest } from "@/lib/api"

// Mapeo de estados del backend a español
const statusMap: Record<string, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  DELETED: "Eliminado"
}

const roleMap: Record<string, string> = {
  ADMIN: "Administrador",
  CLIENTE: "Cliente"
}

// Componente de Paginación
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: Readonly<{ 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}>) {
  const pages = []
  const maxVisible = 5
  
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1)
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(0, endPage - maxVisible + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#E5AB4A] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-2 bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg text-white hover:border-[#E5AB4A] transition-colors"
          >
            1
          </button>
          {startPage > 1 && <span className="text-gray-400">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            page === currentPage
              ? "bg-[#E5AB4A] text-[#0F0B0A] font-bold"
              : "bg-[#0F0B0A] border border-[#2a2a2a] text-white hover:border-[#E5AB4A]"
          }`}
        >
          {page + 1}
        </button>
      ))}
      
      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-3 py-2 bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg text-white hover:border-[#E5AB4A] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#E5AB4A] transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// Modal de Detalles de Usuario
function UserDetailModal({ 
  user, 
  onClose, 
  onUpdate 
}: Readonly<{ 
  user: UserDto | null
  onClose: () => void
  onUpdate: () => void
}>) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [documentNumber, setDocumentNumber] = useState(user?.documentNumber || "")
  const [role, setRole] = useState(user?.role || "ADMIN")
  const [status, setStatus] = useState(user?.status || "ACTIVE")
  const [password, setPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhoneNumber(user.phoneNumber || "")
      setDocumentNumber(user.documentNumber || "")
      setRole(user.role)
      setStatus(user.status)
      setPassword("")
    }
  }, [user])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleUpdate = async () => {
    if (!user) return
    
    setIsUpdating(true)
    setError(null)
    setSuccess(null)
    
    try {
      const updateData: UpdateUserRequest = {
        name,
        email,
        phoneNumber: phoneNumber || undefined,
        documentNumber: documentNumber || undefined,
        role
      }
      
      // Solo incluir password si se proporcionó un valor
      if (password.trim()) {
        updateData.password = password
      }
      
      await api.updateUser(user.id, updateData)
      setSuccess("Usuario actualizado exitosamente")
      onUpdate()
      
      // Limpiar contraseña después de actualizar
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el usuario")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 z-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-[#1A1311] border-b border-[#2a2a2a] p-4 sm:p-6 flex items-center justify-between">
            <h2 className="text-[#E5AB4A] font-serif text-xl sm:text-2xl font-bold">
              Detalles de Usuario: {user.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Información General</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400"><span className="text-gray-500">Fecha de creación:</span> {formatDate(user.createdAt)}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Última actualización:</span> {formatDate(user.updatedAt)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Estado y Rol</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400"><span className="text-gray-500">Estado:</span> {statusMap[user.status] || user.status}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Rol:</span> {roleMap[user.role] || user.role}</p>
                </div>
              </div>
            </div>

            {/* Formulario de Edición */}
            <div className="border-t border-[#2a2a2a] pt-4">
              <h3 className="text-white font-semibold mb-4">Editar Usuario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-white font-semibold mb-2">Nombre</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="block text-white font-semibold mb-2">Email</label>
                  <input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-phone" className="block text-white font-semibold mb-2">Teléfono</label>
                  <input
                    id="edit-phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label htmlFor="edit-document" className="block text-white font-semibold mb-2">Número de Documento</label>
                  <input
                    id="edit-document"
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label htmlFor="edit-role" className="block text-white font-semibold mb-2">Rol</label>
                  <select
                    id="edit-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-status" className="block text-white font-semibold mb-2">Estado</label>
                  <select
                    id="edit-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="edit-password" className="block text-white font-semibold mb-2">Nueva Contraseña (opcional)</label>
                  <input
                    id="edit-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                    placeholder="Dejar vacío para mantener la contraseña actual"
                  />
                  <p className="text-xs text-gray-500 mt-1">Si deja este campo vacío, se mantendrá la contraseña actual del usuario.</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isUpdating ? "Actualizando..." : "Guardar Cambios"}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] rounded-lg text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)
  const [showModal, setShowModal] = useState(false)

  const pageSize = 20

  const statusOptions = [
    { value: "Todos", label: "Todos" },
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" }
  ]

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      // Construir parámetros de búsqueda unificada
      const searchParams: {
        name?: string
        email?: string
        documentNumber?: string
        phoneNumber?: string
        roles?: string[]
        statuses?: string[]
        startDate?: string
        endDate?: string
      } = {
        // Siempre filtrar por rol ADMIN
        roles: ['ADMIN']
      }

      // Agregar filtro de estado (excluir DELETED por defecto)
      if (filterStatus === "Todos") {
        // Si no hay filtro específico, incluir solo ACTIVE e INACTIVE (excluir DELETED)
        searchParams.statuses = ['ACTIVE', 'INACTIVE']
      } else {
        searchParams.statuses = [filterStatus]
      }

      // Agregar término de búsqueda
      if (searchTerm.trim()) {
        const searchTermLower = searchTerm.trim().toLowerCase()
        const isEmail = searchTermLower.includes('@')
        const isNumeric = /^\d+$/.test(searchTerm.trim())
        
        if (isEmail) {
          searchParams.email = searchTerm.trim()
        } else if (isNumeric) {
          searchParams.documentNumber = searchTerm.trim()
        } else {
          searchParams.name = searchTerm.trim()
        }
      }

      // Agregar rango de fechas
      if (startDate) {
        searchParams.startDate = `${startDate}T00:00:00`
      }
      if (endDate) {
        searchParams.endDate = `${endDate}T23:59:59`
      }

      // Llamar al endpoint unificado con todos los filtros
      const allUsers = await api.searchUsers(searchParams)
      
      // Paginación del lado del cliente
      const start = currentPage * pageSize
      const end = start + pageSize
      const paginatedUsers = allUsers.slice(start, end)
      
      setUsers(paginatedUsers)
      setTotalPages(Math.ceil(allUsers.length / pageSize))
      setTotalElements(allUsers.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los usuarios")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, filterStatus, searchTerm, startDate, endDate])

  const handleViewDetails = async (userId: string) => {
    try {
      const user = await api.getUserById(userId)
      setSelectedUser(user)
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los detalles del usuario")
      console.error("Error fetching user details:", err)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500"
      case "INACTIVE":
        return "bg-yellow-500/10 text-yellow-500"
      case "DELETED":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Usuarios</h1>
        <p className="text-gray-400 text-sm sm:text-base">Administra los usuarios administradores del sistema</p>
      </div>

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
        <div className="space-y-4 mb-4 sm:mb-6">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, documento o teléfono..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(0)
              }}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Filtro por Estado */}
            <div>
              <label htmlFor="filter-status" className="block text-xs text-gray-400 mb-1">Estado</label>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value)
                    setCurrentPage(0)
                  }}
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtro por Fecha Inicio */}
            <div>
              <label htmlFor="start-date" className="block text-xs text-gray-400 mb-1">Fecha Inicio</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setCurrentPage(0)
                }}
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base [color-scheme:dark]"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Filtro por Fecha Fin */}
            <div>
              <label htmlFor="end-date" className="block text-xs text-gray-400 mb-1">Fecha Fin</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setCurrentPage(0)
                }}
                min={startDate || undefined}
                className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base [color-scheme:dark]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Botón para limpiar filtros de fecha */}
          {(startDate || endDate) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                  setCurrentPage(0)
                }}
                className="px-4 py-2 bg-transparent border border-[#2a2a2a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-lg text-sm transition-colors"
              >
                Limpiar fechas
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando usuarios...</p>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron usuarios</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <>
            {/* Tabla de Usuarios */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Nombre</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Correo</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Celular</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Rol</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Fecha de Registro</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[#2a2a2a] hover:bg-[#0F0B0A] transition-colors">
                      <td className="py-3 px-4 text-white text-sm">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{user.phoneNumber || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{roleMap[user.role] || user.role}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {statusMap[user.status] || user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="px-3 py-1.5 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div className="mt-4 text-center text-sm text-gray-400">
              Mostrando {users.length} de {totalElements} usuarios
            </div>
          </>
        )}
      </div>

      {showModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onUpdate={() => {
            fetchUsers()
            if (selectedUser) {
              api.getUserById(selectedUser.id).then(setSelectedUser).catch(console.error)
            }
          }}
        />
      )}
    </div>
  )
}

