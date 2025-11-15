"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Download, X, ChevronLeft, ChevronRight } from "lucide-react"
import { api, OrderDto, PaginatedResponse, formatPrice } from "@/lib/api"

// Mapeo de estados del backend a español
const statusMap: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  PROCESSING: "En Proceso",
  SHIPPED: "Enviada",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada"
}

const paymentStatusMap: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado"
}

const paymentMethodMap: Record<string, string> = {
  TARJETA_CREDITO: "Tarjeta de Crédito",
  TRANSFERENCIA_BANCARIA: "Transferencia Bancaria",
  EFECTIVO: "Efectivo",
  CONTRAENTREGA: "Contra Entrega",
  NEQUI: "Nequi",
  DAVIPLATA: "Daviplata"
}

// Componente de Paginación
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}) {
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

// Modal de Detalles de Orden
function OrderDetailModal({ 
  order, 
  onClose, 
  onUpdate 
}: { 
  order: OrderDto | null
  onClose: () => void
  onUpdate: () => void
}) {
  const [status, setStatus] = useState(order?.status || "")
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (order) {
      setStatus(order.status)
      setPaymentStatus(order.paymentStatus)
    }
  }, [order])

  const handleStatusUpdate = async () => {
    if (!order || status === order.status) return
    
    setIsUpdating(true)
    setError(null)
    try {
      await api.updateOrderStatus(order.id, status)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentStatusUpdate = async () => {
    if (!order || paymentStatus === order.paymentStatus) return
    
    setIsUpdating(true)
    setError(null)
    try {
      await api.updateOrderPaymentStatus(order.id, paymentStatus)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el estado de pago")
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

  if (!order) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-[#1A1311] border-b border-[#2a2a2a] p-4 sm:p-6 flex items-center justify-between">
            <h2 className="text-[#E5AB4A] font-serif text-xl sm:text-2xl font-bold">
              Detalles de Orden: {order.orderNumber}
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

            {/* Actualización de Estados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#2a2a2a]">
              <div>
                <label htmlFor="order-status" className="block text-white font-semibold mb-2">Estado de Orden</label>
                <select
                  id="order-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="PROCESSING">En Proceso</option>
                  <option value="SHIPPED">Enviada</option>
                  <option value="DELIVERED">Entregada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
                {status !== order.status && (
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="mt-2 w-full px-4 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {isUpdating ? "Actualizando..." : "Actualizar Estado"}
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="payment-status" className="block text-white font-semibold mb-2">Estado de Pago</label>
                <select
                  id="payment-status"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E5AB4A]"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="PAID">Pagado</option>
                  <option value="FAILED">Fallido</option>
                  <option value="REFUNDED">Reembolsado</option>
                </select>
                {paymentStatus !== order.paymentStatus && (
                  <button
                    onClick={handlePaymentStatusUpdate}
                    disabled={isUpdating}
                    className="mt-2 w-full px-4 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {isUpdating ? "Actualizando..." : "Actualizar Estado de Pago"}
                  </button>
                )}
              </div>
            </div>

            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Información General</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400"><span className="text-gray-500">ID:</span> {order.id}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Número:</span> {order.orderNumber}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Fecha:</span> {formatDate(order.createdAt)}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Actualizado:</span> {formatDate(order.updatedAt)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Totales</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400"><span className="text-gray-500">Subtotal:</span> {formatPrice(order.subtotal)}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Descuento:</span> {formatPrice(order.discountValue)}</p>
                  <p className="text-gray-400"><span className="text-gray-500">Envío:</span> {formatPrice(order.shippingValue)}</p>
                  <p className="text-[#E5AB4A] font-bold"><span className="text-gray-500">Total:</span> {formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            {/* Cliente */}
            <div>
              <h3 className="text-white font-semibold mb-2">Cliente</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400"><span className="text-gray-500">Nombre:</span> {order.userName}</p>
                <p className="text-gray-400"><span className="text-gray-500">Email:</span> {order.userEmail}</p>
              </div>
            </div>

            {/* Envío */}
            <div>
              <h3 className="text-white font-semibold mb-2">Envío</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400"><span className="text-gray-500">Dirección:</span> {order.shippingAddress}</p>
                <p className="text-gray-400"><span className="text-gray-500">Valor:</span> {formatPrice(order.shippingValue)}</p>
              </div>
            </div>

            {/* Productos */}
            <div>
              <h3 className="text-white font-semibold mb-2">Productos</h3>
              <div className="space-y-2">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg p-3">
                    <p className="text-white font-medium">{item.productName || "Producto"}</p>
                    <div className="text-sm text-gray-400 mt-1 space-y-1">
                      <p><span className="text-gray-500">SKU:</span> {item.variantSku || "N/A"}</p>
                      <p><span className="text-gray-500">Cantidad:</span> {item.quantity}</p>
                      <p><span className="text-gray-500">Precio unitario:</span> {formatPrice(item.unitPrice)}</p>
                      <p><span className="text-gray-500">Total:</span> {formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            {order.notes && (
              <div>
                <h3 className="text-white font-semibold mb-2">Notas</h3>
                <p className="text-gray-400 text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("Todos")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [showModal, setShowModal] = useState(false)

  const pageSize = 20

  const statusOptions = [
    { value: "Todos", label: "Todos" },
    { value: "PENDING", label: "Pendiente" },
    { value: "PROCESSING", label: "En Proceso" },
    { value: "CONFIRMED", label: "Confirmada" },
    { value: "SHIPPED", label: "Enviada" },
    { value: "DELIVERED", label: "Entregada" },
    { value: "CANCELLED", label: "Cancelada" }
  ]

  const paymentStatusOptions = [
    { value: "Todos", label: "Todos" },
    { value: "PENDING", label: "Pendiente" },
    { value: "PAID", label: "Pagado" },
    { value: "FAILED", label: "Fallido" },
    { value: "REFUNDED", label: "Reembolsado" }
  ]

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      let allOrders: OrderDto[] = []
      
      // Si hay rango de fechas, usar el endpoint de date-range
      if (startDate && endDate) {
        // Formatear fechas a ISO 8601
        const startDateTime = `${startDate}T00:00:00`
        const endDateTime = `${endDate}T23:59:59`
        allOrders = await api.getOrdersByDateRange(startDateTime, endDateTime)
      }
      // Si hay término de búsqueda, usar el endpoint de búsqueda
      else if (searchTerm.trim()) {
        // Determinar qué tipo de búsqueda hacer basado en el término
        const searchTermLower = searchTerm.trim().toLowerCase()
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchTerm.trim())
        const isOrderNumber = searchTerm.trim().toUpperCase().startsWith('ORD-')
        const isEmail = searchTermLower.includes('@')
        const isNumeric = /^\d+$/.test(searchTerm.trim())
        
        let searchParams: {
          orderId?: string
          orderNumber?: string
          clientName?: string
          email?: string
          documentNumber?: string
          phoneNumber?: string
        } = {}
        
        if (isUUID) {
          searchParams.orderId = searchTerm.trim()
        } else if (isOrderNumber) {
          searchParams.orderNumber = searchTerm.trim().toUpperCase()
        } else if (isEmail) {
          searchParams.email = searchTerm.trim()
        } else if (isNumeric) {
          searchParams.documentNumber = searchTerm.trim()
        } else {
          searchParams.clientName = searchTerm.trim()
        }
        
        allOrders = await api.searchOrders(searchParams)
      }
      // Sin búsqueda ni fechas, usar el endpoint normal
      else {
        if (filterStatus === "Todos" && filterPaymentStatus === "Todos") {
          // Si no hay filtros, usar paginación del servidor
          const response = await api.getOrders(currentPage, pageSize, 'createdAt,desc')
          setOrders(response.content)
          setTotalPages(response.totalPages)
          setTotalElements(response.totalElements)
          return
        } else {
          // Si hay filtros, obtener todas las órdenes y filtrar del lado del cliente
          const response = await api.getOrders(0, 1000, 'createdAt,desc')
          allOrders = response.content
          // Si hay más páginas, necesitamos obtener todas
          if (response.totalPages > 1) {
            const allPages: OrderDto[] = []
            for (let i = 0; i < response.totalPages; i++) {
              const pageResponse = await api.getOrders(i, 1000, 'createdAt,desc')
              allPages.push(...pageResponse.content)
            }
            allOrders = allPages
          }
        }
      }
      
      // Aplicar filtros de estado y estado de pago
      let filteredResults = allOrders
      if (filterStatus !== "Todos") {
        filteredResults = filteredResults.filter(order => order.status === filterStatus)
      }
      if (filterPaymentStatus !== "Todos") {
        filteredResults = filteredResults.filter(order => order.paymentStatus === filterPaymentStatus)
      }
      
      // Paginación del lado del cliente
      const start = currentPage * pageSize
      const end = start + pageSize
      const paginatedOrders = filteredResults.slice(start, end)
      
      const response: PaginatedResponse<OrderDto> = {
        content: paginatedOrders,
        pageable: {
          pageNumber: currentPage,
          pageSize: pageSize,
          sort: { sorted: true, unsorted: false, empty: false }
        },
        totalElements: filteredResults.length,
        totalPages: Math.ceil(filteredResults.length / pageSize),
        last: end >= filteredResults.length,
        first: currentPage === 0,
        size: pageSize,
        number: currentPage,
        numberOfElements: paginatedOrders.length,
        empty: paginatedOrders.length === 0
      }
      
      setOrders(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las órdenes")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, filterStatus, filterPaymentStatus, searchTerm, startDate, endDate])

  const handleViewDetails = async (orderId: string) => {
    try {
      const order = await api.getOrderById(orderId)
      setSelectedOrder(order)
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los detalles de la orden")
      console.error("Error fetching order details:", err)
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
      case "DELIVERED":
        return "bg-green-500/10 text-green-500"
      case "PROCESSING":
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-500"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500"
      case "CANCELLED":
        return "bg-red-500/10 text-red-500"
      case "SHIPPED":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  // Ya no necesitamos filtrar del lado del cliente, el backend lo hace
  const filteredOrders = orders

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-[#E5AB4A] font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Pedidos</h1>
        <p className="text-gray-400 text-sm sm:text-base">Administra y da seguimiento a los pedidos de tus clientes</p>
      </div>

      <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-4 sm:p-6">
        <div className="space-y-4 mb-4 sm:mb-6">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, número de orden, cliente, email, documento o teléfono..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(0)
              }}
              className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Filtro por Estado de Orden */}
            <div>
              <label htmlFor="filter-status" className="block text-xs text-gray-400 mb-1">Estado de Orden</label>
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

            {/* Filtro por Estado de Pago */}
            <div>
              <label htmlFor="filter-payment-status" className="block text-xs text-gray-400 mb-1">Estado de Pago</label>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <select
                  id="filter-payment-status"
                  value={filterPaymentStatus}
                  onChange={(e) => {
                    setFilterPaymentStatus(e.target.value)
                    setCurrentPage(0)
                  }}
                  className="w-full bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-[#E5AB4A] text-sm sm:text-base"
                >
                  {paymentStatusOptions.map((option) => (
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
            <p className="text-gray-400">Cargando órdenes...</p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron órdenes</p>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <>
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-[#0F0B0A] border border-[#2a2a2a] rounded-lg p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-white font-bold text-sm sm:text-lg">{order.orderNumber}</h3>
                        <p className="text-gray-400 text-xs">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {statusMap[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-[#E5AB4A] text-sm sm:text-lg font-bold">{formatPrice(order.total)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Cliente</p>
                        <p className="text-white text-sm font-medium">{order.userName}</p>
                        <p className="text-gray-400 text-xs truncate">{order.userEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Productos</p>
                        {order.orderItems?.map((item) => (
                          <p key={item.id} className="text-white text-sm truncate">
                            {item.quantity}x {item.productName || "Producto"}
                          </p>
                        ))}
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-gray-400 text-xs mb-1">Envío</p>
                        <p className="text-white text-sm">{order.shippingAddress}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Pago: {paymentStatusMap[order.paymentStatus] || order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[#2a2a2a]">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="flex-1 px-3 py-2 bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Detalles</span>
                      <span className="sm:hidden">Ver</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-transparent border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] rounded-lg text-xs flex items-center justify-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Descargar</span>
                      <span className="sm:hidden">PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div className="mt-4 text-center text-sm text-gray-400">
              Mostrando {filteredOrders.length} de {totalElements} órdenes
            </div>
          </>
        )}
      </div>

      {showModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false)
            setSelectedOrder(null)
          }}
          onUpdate={() => {
            fetchOrders()
            if (selectedOrder) {
              api.getOrderById(selectedOrder.id).then(setSelectedOrder).catch(console.error)
            }
          }}
        />
      )}
    </div>
  )
}
