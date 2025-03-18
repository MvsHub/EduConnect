"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireTeacher?: boolean
}

export default function AuthGuard({ children, requireTeacher = false }: AuthGuardProps) {
  const { user, isLoading, isTeacher } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
      } else if (requireTeacher && !isTeacher()) {
        router.push("/")
      }
    }
  }, [user, isLoading, router, requireTeacher, isTeacher])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || (requireTeacher && !isTeacher())) {
    return null
  }

  return <>{children}</>
}

