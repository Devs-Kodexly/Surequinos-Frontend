"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Acepta cualquier correo y contraseña
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("isAdminAuthenticated", "true")
        localStorage.setItem("adminEmail", email)
        router.push("/admin")
      } else {
        setError("Por favor completa todos los campos.")
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#0F0B0A] flex items-center justify-center p-4">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #E5AB4A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-5">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-login.png"
              alt="Surequinos"
              width={300}
              height={75}
              className="mx-auto"
            />
          </Link>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#E5AB4A] to-transparent mx-auto my-2" />
          <h1 className="text-[#E5AB4A] font-serif text-2xl mb-1">
            Bienvenido
          </h1>
          <p className="text-muted-foreground text-sm">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-[#1A1311] border border-[#2a2a2a] rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-[#E5AB4A]" />
                Correo Electrónico
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0F0B0A] border-[#2a2a2a] text-foreground placeholder:text-muted-foreground focus:border-[#E5AB4A] focus:ring-[#E5AB4A]/20 h-12"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E5AB4A]" />
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#0F0B0A] border-[#2a2a2a] text-foreground placeholder:text-muted-foreground focus:border-[#E5AB4A] focus:ring-[#E5AB4A]/20 h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#E5AB4A] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#AA3E11] hover:bg-[#AA3E11]/90 text-white h-12 text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#AA3E11]/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              ¿Problemas para acceder?{" "}
              <Link href="/contacto" className="text-[#E5AB4A] hover:underline">
                Contacta soporte
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-[#E5AB4A] text-sm transition-colors inline-flex items-center gap-2"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#E5AB4A]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#AA3E11]/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
