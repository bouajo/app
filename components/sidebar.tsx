"use client"

import { LayoutDashboard, FileText, Settings, MessagesSquare, ChevronLeft, ChevronRight, Gavel, ShieldCheck, DollarSign, Users } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          {open && <span className="font-bold">DMS</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {open && "Dashboard"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/documents"}>
                  <Link href="/documents">
                    <FileText className="mr-2 h-4 w-4" />
                    {open && "Documents"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/legal"}>
                  <Link href="/legal">
                    <Gavel className="mr-2 h-4 w-4" />
                    {open && "Legal"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/customers-suppliers"}>
                  <Link href="/customers-suppliers">
                    <Users className="mr-2 h-4 w-4" />
                    {open && "Customers & Suppliers"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/billing-review"}>
                  <Link href="/billing-review">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {open && "Billing Review"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link href="/admin">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {open && "Admin"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {open && "Settings"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 transition-all duration-300 ease-in-out"
          style={{ right: open ? '-12px' : '-20px' }}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </SidebarTrigger>
    </Sidebar>
  )
}

