"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Gavel,
  DollarSign,
  ShieldCheck,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Legal", href: "/legal", icon: Gavel },
  { name: "Customers & Suppliers", href: "/customers-suppliers", icon: Users },
  { name: "Billing Review", href: "/billing-review", icon: DollarSign },
  { name: "Admin", href: "/admin", icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">DMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-900",
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => signOut()}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
          Sign out
        </button>
      </div>
    </div>
  )
} 