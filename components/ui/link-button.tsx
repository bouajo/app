"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { PlusCircle, FileText, GitBranch } from "lucide-react"

const iconMap = {
  PlusCircle,
  FileText,
  GitBranch,
} as const

type IconName = keyof typeof iconMap

interface LinkButtonProps {
  href: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  children: React.ReactNode
  iconName?: IconName
}

export function LinkButton({ href, variant = "default", children, iconName }: LinkButtonProps) {
  const Icon = iconName ? iconMap[iconName] : null

  return (
    <Link href={href} className={buttonVariants({ variant })}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </Link>
  )
} 