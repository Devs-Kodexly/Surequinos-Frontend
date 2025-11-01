"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ToastNotification } from "@/components/toast-notification"

interface Toast {
  id: string
  message: string
  type?: "success" | "error" | "info"
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: "success" | "error" | "info" = "success", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 pointer-events-none">
        <div className="space-y-2">
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              style={{ 
                transform: `translateY(${index * 4}px)`,
                zIndex: 50 - index 
              }}
            >
              <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={true}
                onClose={() => removeToast(toast.id)}
                duration={toast.duration}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}