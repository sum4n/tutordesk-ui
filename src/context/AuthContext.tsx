import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "@/context/useAuth"
import { api } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  role: "teacher" | "student"
  classId?: string | null
  batchId?: string | null
  studentId?: string
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })

    const { token, user } = (await response.json()) as {
      token: string
      user: User
    }

    setUser(user)
    setToken(token)

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    return user
  }

  const signup = async (data: {
    email: string
    password: string
    name: string
    classId?: string | null
    batchId?: string | null
  }) => {
    const response = await api.post("/auth/register", data)

    const { token, user } = (await response.json()) as {
      token: string
      user: User
    }

    setUser(user)
    setToken(token)

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    return user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
