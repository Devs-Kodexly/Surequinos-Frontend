"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"

interface ToastNotificationProps {
  message: string
  type?: "success" | "error" | "info"
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function ToastNotification({ 
  message, 
  type = "success", 
  isVisible, 
  onClose, 
  duration = 3000 
}: ToastNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isAnimating) return null

  const getIcon = () => {
    switch (type) {
      case "error":
        return <X className="w-4 h-4 text-red-400" />
      default:
        return <Check className="w-4 h-4 text-[#E5AB4A]" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "error":
        return "bg-[#1A1311]/95 border-red-400/30"
      default:
        return "bg-[#1A1311]/95 border-[#E5AB4A]/30"
    }
  }

  return (
    <div
      className={`
        ${getBgColor()}
        border backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-xl
        transform transition-all duration-300 ease-out
        ${isAnimating 
          ? "translate-y-0 opacity-100 scale-100" 
          : "-translate-y-full opacity-0 scale-95"
        }
        pointer-events-auto w-80 sm:w-96 max-w-[calc(100vw-2rem)]
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-full flex-shrink-0 ${
          type === "error" ? "bg-red-400/20" : "bg-[#E5AB4A]/20"
        }`}>
          {getIcon()}
        </div>
        <span className="text-white font-medium text-sm flex-1">{message}</span>
        <button
          onClick={() => {
            setIsAnimating(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}