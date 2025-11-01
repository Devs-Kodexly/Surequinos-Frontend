import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F0B0A] overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminMobileNav />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
