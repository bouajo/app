"use client"

import { Inter } from 'next/font/google'
import { AppSidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
} 