"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authAPI, userAPI } from "@/lib/api"

export type UserRole = "teacher" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  education?: string
  bio?: string
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isTeacher: () => boolean
  updateUserProfile: (profileData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar se há um token de acesso
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        // Obter o ID do usuário do token (simplificado)
        // Em uma implementação real, decodificaria o JWT
        const userId = localStorage.getItem("userId")
        if (!userId) {
          throw new Error("ID do usuário não encontrado")
        }

        // Buscar dados do usuário
        const userData = await userAPI.getProfile(userId)
        setUser(userData)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        // Limpar tokens em caso de erro
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authAPI.login(email, password)
      setUser(userData)

      // Salvar ID do usuário para uso posterior
      localStorage.setItem("userId", userData.id)

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${userData.name}!`,
      })

      router.push("/")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("userId")
      router.push("/auth/login")
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso",
      })
    }
  }

  const isTeacher = () => {
    return user?.role === "teacher"
  }

  const updateUserProfile = async (profileData: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = await userAPI.updateProfile(profileData)
      setUser(updatedUser)

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message || "Não foi possível atualizar seu perfil",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isTeacher, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

