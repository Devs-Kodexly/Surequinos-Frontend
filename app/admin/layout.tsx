import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileNav } from "@/components/admin-mobile-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F0B0A]">
      <AdminSidebar />
      <div className="flex-1">
        <AdminMobileNav />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
