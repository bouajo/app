"use client"

import { Inter } from 'next/font/google'
import { AppSidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen")}>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-x-hidden p-4">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

