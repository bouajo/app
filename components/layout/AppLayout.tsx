"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  // Check if we should show the menu
  const shouldShowMenu = !isPublicRoute(pathname) && user

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute(pathname)) {
        router.replace(`/login?redirectTo=${pathname}`)
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, loading, pathname, router])

  // Show loading spinner while checking auth
  if (loading || (!isAuthorized && !isPublicRoute(pathname))) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  // If we're on a public route, just render children
  if (isPublicRoute(pathname)) {
    return children
  }

  // Otherwise, render with menu layout
  return (
    <div className="fixed inset-0 flex bg-gray-50">
      {shouldShowMenu && (
        <div className="h-full">
          <Sidebar />
        </div>
      )}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/', '/login', '/auth/callback']
  return publicRoutes.includes(pathname)
} 