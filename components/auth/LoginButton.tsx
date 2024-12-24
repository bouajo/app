"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginButton() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    if (user) {
      setLoading(true)
      try {
        await signOut()
      } finally {
        setLoading(false)
      }
    } else {
      router.push("/login")
    }
  }

  return (
    <Button 
      variant={user ? "outline" : "default"}
      onClick={handleAuth}
      disabled={loading}
    >
      {loading ? "Loading..." : user ? "Sign Out" : "Login"}
    </Button>
  )
} 