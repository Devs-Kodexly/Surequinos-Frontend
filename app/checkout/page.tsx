"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectCustom } from "@/components/ui/select-custom"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [couponCode, setCouponCode] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    document: "",
    department: "Antioquia",
    city: "Medellín",
    address: "",
    observations: "",
    shippingMethod: "retiro",
  })

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString("es-CO")}`
  }

  const subtotal = total
  const shipping = formData.shippingMethod === "retiro" ? 0 : formData.shippingMethod === "medellin" ? 50000 : 0
  const finalTotal = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [paymentMethod, setPaymentMethod] = useState("link")
  const [invoiceNotes, setInvoiceNotes] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = () => {
    // Aquí iría la validación del formulario
    setCurrentStep(2)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleConfirmOrder = async () => {
    // Validar campos requeridos
    if (!formData.fullName || !formData.email || !formData.phone || !formData.document) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    if (items.length === 0) {
      setError("El carrito está vacío")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Construir la dirección completa
      const fullAddress = formData.address
        ? `${formData.address}, ${formData.city}, ${formData.department}`
        : `${formData.city}, ${formData.department}`

      // Preparar los items del pedido usando variantId
      const orderItems = items.map(item => ({
        variantId: item.variantId || item.id, // Usar variantId si está disponible, sino usar id como fallback
        quantity: item.quantity
      }))

      // Mapear el método de pago al formato del backend
      const paymentMethodMap: Record<string, string> = {
        "link": "TARJETA_CREDITO",
        "transferencia": "TRANSFERENCIA_BANCARIA",
        "contraentrega": "CONTRAENTREGA"
      }
      const mappedPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod.toUpperCase()

      // Preparar las notas combinando observaciones y notas de facturación
      // Si es retiro en taller, agregar nota automática
      const notesArray = []
      
      if (formData.shippingMethod === "retiro") {
        notesArray.push("RETIRO EN TALLER (Sabaneta)")
      }
      
      if (formData.observations) {
        notesArray.push(formData.observations)
      }
      
      if (invoiceNotes) {
        notesArray.push(invoiceNotes)
      }
      
      const notes = notesArray.length > 0 ? notesArray.join(" | ") : undefined

      // Calcular el valor de descuento (por ahora 0, se puede implementar lógica de cupones después)
      const discountValue = 0

      // Calcular el valor de envío
      const shippingValue = formData.shippingMethod === "retiro" 
        ? 0 
        : formData.shippingMethod === "medellin" 
        ? 50000 
        : 0

      // Preparar los datos de la orden
      const orderData = {
        email: formData.email,
        documentNumber: formData.document,
        clientName: formData.fullName,
        clientPhoneNumber: formData.phone,
        discountValue: discountValue,
        notes: notes,
        paymentMethod: mappedPaymentMethod,
        shippingAddress: fullAddress,
        shippingValue: shippingValue,
        items: orderItems
      }

      // Crear la orden en el backend
      const response = await api.createOrder(orderData)
      
      // Extraer el número de orden de la respuesta del backend
      // La respuesta tiene el formato: { orderNumber: "ORD-20251115165304-732", ... }
      let finalOrderNumber = ""
      if (response && response.orderNumber) {
        finalOrderNumber = response.orderNumber
        console.log("Número de orden recibido del backend:", response.orderNumber)
      } else {
        // Fallback: generar número de orden localmente si no viene del backend
        finalOrderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
        console.warn("No se recibió orderNumber del backend, usando fallback:", finalOrderNumber)
        console.warn("Respuesta completa:", response)
      }
      
      // Establecer el número de orden y mostrar confirmación primero
      setOrderNumber(finalOrderNumber)
      setShowConfirmation(true)
      
      console.log("Estableciendo showConfirmation a true con orderNumber:", finalOrderNumber)
      
      // Limpiar el carrito después de mostrar el modal
      // Usar setTimeout para asegurar que el modal se renderice primero
      setTimeout(() => {
        clearCart()
      }, 100)
    } catch (err) {
      console.error("Error creating order:", err)
      setError(err instanceof Error ? err.message : "Error al crear la orden. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // No mostrar mensaje de carrito vacío si el modal de confirmación está activo
  if (items.length === 0 && !showConfirmation) {
    return (
      <div className="min-h-screen bg-[#0F0B0A]">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-white text-2xl mb-4">Tu carrito está vacío</h1>
          <Button
            onClick={() => router.push("/tienda")}
            className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white"
          >
            Ir a la tienda
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0B0A]">
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Title */}
        <h1 className="font-bold mb-8" style={{ fontFamily: 'Inter', fontSize: '36px', lineHeight: '36px', color: '#F2E9E4' }}>
          Finalizar compra
        </h1>

        {/* Steps */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-12">
          <button
            className={`px-4 md:px-5 py-2 rounded-full transition-colors ${
              currentStep === 1
                ? "bg-[#AA3E11] text-white"
                : "bg-transparent text-gray-400 border border-[#8B7355]"
            }`}
            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '100%' }}
          >
            <span className="md:hidden">1. Datos</span>
            <span className="hidden md:inline">1. Datos & Envío</span>
          </button>
          <button
            className={`px-4 md:px-5 py-2 rounded-full transition-colors ${
              currentStep === 2
                ? "bg-[#AA3E11] text-white"
                : "bg-transparent text-gray-400 border border-[#8B7355]"
            }`}
            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '100%' }}
          >
            2. Pago
          </button>
          <button
            className={`px-4 md:px-5 py-2 rounded-full transition-colors ${
              currentStep === 3
                ? "bg-[#AA3E11] text-white"
                : "bg-transparent text-gray-400 border border-[#8B7355]"
            }`}
            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '100%' }}
          >
            3. Revisión
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Right Column - Summary (Mobile First) */}
          <div className="lg:col-span-1 lg:order-2">
            <div className="bg-[#1B1715] rounded-lg p-6 h-full">
              <h2 className="text-[#F2E9E4] font-bold mb-6" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '18.4px', lineHeight: '19px' }}>
                Resumen
              </h2>

              {/* Products */}
              <div className="mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 mb-5">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1" style={{ fontFamily: 'Inter', fontSize: '15px', lineHeight: '120%' }}>
                          {item.name}
                        </h3>
                        <p className="text-gray-400" style={{ fontFamily: 'Inter', fontSize: '12px', lineHeight: '100%' }}>
                          {item.color} • Cant: {item.quantity}
                        </p>
                      </div>
                      <div className="text-white font-bold text-right" style={{ fontFamily: 'Inter', fontSize: '16px' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%', color: '#DBC9B5' }}>
                    Subtotal
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%', color: '#DBC9B5' }}>
                    Envío
                  </span>
                  <span style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                    {formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14.3px', lineHeight: '16px', color: '#FFFFFF' }}>
                    Total
                  </span>
                  <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '14.3px', lineHeight: '16px', color: '#FFFFFF' }}>
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div>
                <label className="mb-3 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#DBC9B5' }}>
                  Cupón
                </label>
                <div className="flex gap-3">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de cupón"
                    className="bg-[#0F0B0A] border-gray-700 text-white placeholder:text-gray-500 flex-1 rounded-lg h-12"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                  />
                  <Button
                    className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white border-0 whitespace-nowrap px-10 rounded-lg h-12"
                    style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 400 }}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Form */}
          <div className="lg:col-span-2 lg:order-1 bg-[#1B1715] rounded-lg p-6 md:p-8">
            {currentStep === 1 && (
              <>
            {/* Datos del comprador */}
            <div className="mb-10">
              <h2 className="text-[#F2E9E4] font-bold mb-6" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '24px', lineHeight: '26px' }}>
                Datos del comprador
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Nombre y Apellido
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nombre completo"
                    className="bg-[#0F0B0A] border-gray-800 text-white placeholder:text-[#757575] h-11"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                  />
                </div>
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Correo electrónico
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tucorreo@email.com"
                    className="bg-[#0F0B0A] border-gray-800 text-white placeholder:text-[#757575] h-11"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 000 0000"
                    className="bg-[#0F0B0A] border-gray-800 text-white placeholder:text-[#757575] h-11"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                  />
                </div>
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Documento
                  </label>
                  <Input
                    name="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    placeholder="CC / NIT"
                    className="bg-[#0F0B0A] border-gray-800 text-white placeholder:text-[#757575] h-11"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="mb-6">
              <h2 className="text-[#F2E9E4] font-bold mb-6" style={{ fontFamily: 'Inter', fontSize: '22px', lineHeight: '100%' }}>
                Dirección de envío
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Departamento
                  </label>
                  <SelectCustom
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    options={[
                      { value: "Antioquia", label: "Antioquia" },
                      { value: "Cundinamarca", label: "Cundinamarca" },
                      { value: "Valle del Cauca", label: "Valle del Cauca" },
                    ]}
                  />
                </div>
                <div>
                  <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Ciudad
                  </label>
                  <SelectCustom
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    options={[
                      { value: "Medellín", label: "Medellín" },
                      { value: "Bogotá", label: "Bogotá" },
                      { value: "Cali", label: "Cali" },
                    ]}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                  Dirección
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle 00 #00-00, barrio"
                  className="bg-[#0F0B0A] border-gray-800 text-white placeholder:text-[#757575] h-11"
                  style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '100%' }}
                />
              </div>

              <div>
                <label className="mb-2 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                  Observaciones
                </label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  placeholder="Indica acceso, horarios o referencias"
                  rows={4}
                  className="w-full bg-[#0F0B0A] border border-gray-800 rounded-md px-4 py-3 text-white placeholder:text-[#757575] resize-none"
                  style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '140%' }}
                />
              </div>
            </div>

            {/* Método de envío */}
            <div className="mb-6">
              <h2 className="text-[#F2E9E4] font-bold mb-6" style={{ fontFamily: 'Inter', fontSize: '22px', lineHeight: '100%' }}>
                Método de envío
              </h2>
              
              <div className="space-y-2">
                <label className="flex items-center gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-4 py-3 hover:border-[#AA3E11] transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="retiro"
                    checked={formData.shippingMethod === "retiro"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                    style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                  />
                  <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15.5px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Retiro en taller (Sabaneta) — $0
                  </span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-4 py-3 hover:border-[#AA3E11] transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="medellin"
                    checked={formData.shippingMethod === "medellin"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                    style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                  />
                  <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15.5px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Medellín — $50.000
                  </span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-4 py-3 hover:border-[#AA3E11] transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="otras"
                    checked={formData.shippingMethod === "otras"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                    style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                  />
                  <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15.5px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Otras ciudades — se cotiza
                  </span>
                </label>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-8 py-3 font-medium"
              style={{ fontFamily: 'Inter', fontSize: '14px' }}
            >
              Continuar a pago
            </Button>
            </>
            )}

            {currentStep === 2 && (
              <>
                {/* Método de pago */}
                <div className="mb-8 md:mb-10">
                  <h2 className="text-[#F2E9E4] font-bold mb-4 md:mb-6" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '19px', lineHeight: '22px' }}>
                    Método de pago
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-start md:items-center gap-3 md:gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-3 md:px-4 py-3 hover:border-[#AA3E11] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="link"
                        checked={paymentMethod === "link"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 mt-0.5 md:mt-0 flex-shrink-0 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                        style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                      />
                      <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#C9B8A5' }}>
                        Link de pago (tarjeta/ PSE)
                      </span>
                    </label>

                    <label className="flex items-start md:items-center gap-3 md:gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-3 md:px-4 py-3 hover:border-[#AA3E11] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transferencia"
                        checked={paymentMethod === "transferencia"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 mt-0.5 md:mt-0 flex-shrink-0 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                        style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                      />
                      <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#C9B8A5' }}>
                        Transferencia bancaria
                      </span>
                    </label>

                    <label className="flex items-start md:items-center gap-3 md:gap-4 cursor-pointer bg-[#0F0B0A] border border-gray-800 rounded-md px-3 md:px-4 py-3 hover:border-[#AA3E11] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="contraentrega"
                        checked={paymentMethod === "contraentrega"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 mt-0.5 md:mt-0 flex-shrink-0 text-[#AA3E11] bg-transparent border-gray-600 focus:ring-[#AA3E11] focus:ring-offset-0 accent-[#AA3E11]"
                        style={{ filter: 'grayscale(0%) brightness(1.2)' }}
                      />
                      <span className="flex-1" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', lineHeight: '140%', color: '#C9B8A5' }}>
                        Contraentrega (según ciudad)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notas para facturación */}
                <div className="mb-8 md:mb-10">
                  <label className="mb-3 block" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', lineHeight: '16px', color: '#C9B8A5' }}>
                    Notas para facturación
                  </label>
                  <textarea
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    placeholder="Nombre o NIT de facturación, si aplica"
                    rows={4}
                    className="w-full bg-[#0F0B0A] border border-gray-800 rounded-md px-3 md:px-4 py-3 text-white placeholder:text-[#757575] resize-none"
                    style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '140%' }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="w-full sm:w-auto border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white bg-transparent px-6 md:px-8 py-3"
                    style={{ fontFamily: 'Inter', fontSize: '14px' }}
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="w-full sm:w-auto bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 md:px-8 py-3 font-medium"
                    style={{ fontFamily: 'Inter', fontSize: '14px' }}
                  >
                    Revisar pedido
                  </Button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col h-full">
                {/* Revisión y confirmación */}
                <div className="flex-1">
                  <h2 className="text-[#F2E9E4] font-bold mb-3 md:mb-4" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '19px', lineHeight: '22px' }}>
                    Revisión y confirmación
                  </h2>
                  <p className="text-gray-400 mb-6 md:mb-8" style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '140%' }}>
                    Verifica los datos y confirma tu compra.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                    {/* Columna Izquierda */}
                    <div className="space-y-6">
                      {/* Datos del Cliente */}
                      <div>
                        <h3 className="text-[#F2E9E4] font-semibold mb-3" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '100%' }}>
                          Datos del Cliente
                        </h3>
                        <div className="text-gray-400" style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '160%' }}>
                          {formData.fullName && <p><span className="text-gray-500">Nombre:</span> {formData.fullName}</p>}
                          {formData.email && <p><span className="text-gray-500">Correo:</span> {formData.email}</p>}
                          {formData.phone && <p><span className="text-gray-500">Teléfono:</span> {formData.phone}</p>}
                          {formData.document && <p><span className="text-gray-500">Documento:</span> {formData.document}</p>}
                        </div>
                      </div>

                      {/* Pago */}
                      <div>
                        <h3 className="text-[#F2E9E4] font-semibold mb-3" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '100%' }}>
                          Pago
                        </h3>
                        <div className="text-gray-400" style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '160%' }}>
                          {paymentMethod === "link" && (
                            <p><span className="text-gray-500">Método:</span> Link de pago (tarjeta / PSE)</p>
                          )}
                          {paymentMethod === "transferencia" && (
                            <p><span className="text-gray-500">Método:</span> Transferencia bancaria</p>
                          )}
                          {paymentMethod === "contraentrega" && (
                            <p><span className="text-gray-500">Método:</span> Contraentrega (según ciudad)</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-6">
                      {/* Envío */}
                      <div>
                        <h3 className="text-[#F2E9E4] font-semibold mb-3" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '100%' }}>
                          Envío
                        </h3>
                        <div className="text-gray-400" style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '160%' }}>
                          {formData.department && <p><span className="text-gray-500">Departamento:</span> {formData.department}</p>}
                          {formData.city && <p><span className="text-gray-500">Ciudad:</span> {formData.city}</p>}
                          {formData.address ? (
                            <p><span className="text-gray-500">Dirección:</span> {formData.address}</p>
                          ) : (
                            <p className="text-gray-500 italic">Sin dirección específica</p>
                          )}
                          {formData.shippingMethod === "retiro" && (
                            <p className="text-[#E5AB4A] mt-2 font-medium">Retiro en taller (Sabaneta)</p>
                          )}
                          {formData.shippingMethod === "medellin" && (
                            <p className="text-[#E5AB4A] mt-2 font-medium">Envío a Medellín</p>
                          )}
                          {formData.shippingMethod === "otras" && (
                            <p className="text-[#E5AB4A] mt-2 font-medium">Otras ciudades - se cotiza</p>
                          )}
                        </div>
                      </div>

                      {/* Observaciones */}
                      {(formData.observations || invoiceNotes) && (
                        <div>
                          <h3 className="text-[#F2E9E4] font-semibold mb-3" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '100%' }}>
                            Observaciones
                          </h3>
                          <div className="text-gray-400" style={{ fontFamily: 'Inter', fontSize: '14px', lineHeight: '160%' }}>
                            {formData.observations && (
                              <div className="mb-3">
                                <p className="text-gray-500 mb-1 text-xs">Observaciones del pedido:</p>
                                <p className="text-white">{formData.observations}</p>
                              </div>
                            )}
                            {invoiceNotes && (
                              <div>
                                {formData.observations && <div className="border-t border-gray-700 pt-3 mt-3"></div>}
                                <p className="text-gray-500 mb-1 text-xs">Notas de facturación:</p>
                                <p className="text-white">{invoiceNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-red-400 text-sm" style={{ fontFamily: 'Inter' }}>
                      {error}
                    </p>
                  </div>
                )}

                {/* Buttons at bottom */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-auto pt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white bg-transparent px-6 md:px-8 py-3"
                    style={{ fontFamily: 'Inter', fontSize: '14px' }}
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white px-6 md:px-8 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter', fontSize: '14px' }}
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar compra"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 z-[100]" 
            onClick={() => {
              console.log("Cerrando modal")
              setShowConfirmation(false)
            }} 
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-[#1B1715] rounded-lg p-8 md:p-12 max-w-lg w-full text-center pointer-events-auto">
              {/* Check Icon */}
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-white font-bold mb-6" style={{ fontFamily: 'Inter', fontSize: '32px', lineHeight: '100%' }}>
                ¡Pedido confirmado!
              </h2>

              {/* Order Number */}
              <p className="text-gray-300 mb-8" style={{ fontFamily: 'Inter', fontSize: '16px', lineHeight: '140%' }}>
                {orderNumber ? (
                  <>
                    Número de orden <span className="font-bold text-white">#{orderNumber}</span>. 
                    <br />
                    Te enviaremos un correo con el detalle y el estado del envío.
                  </>
                ) : (
                  <>
                    Tu pedido ha sido confirmado. 
                    <br />
                    Te enviaremos un correo con el detalle y el estado del envío.
                  </>
                )}
              </p>

              {/* Button */}
              <Button
                onClick={() => router.push("/tienda")}
                className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white px-10 py-3"
                style={{ fontFamily: 'Inter', fontSize: '15px' }}
              >
                Volver a la tienda
              </Button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}
