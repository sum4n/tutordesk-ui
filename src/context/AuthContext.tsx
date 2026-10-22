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
    // TODO: rewrite this after proper back-end
    const response = await api.get(`/users?email=${email}&password=${password}`)

    const users = await response.json()

    if (users.length === 0) {
      throw new Error("Invalid email or password")
    }

    const foundUser = users[0]
    const token = `token_${foundUser.id}_${Date.now()}`

    // Strip password before saving
    const { password: _password, ...safeUser } = foundUser

    setUser(safeUser)
    setToken(token)
    localStorage.setItem("user", JSON.stringify(safeUser))
    localStorage.setItem("token", token)

    return safeUser
  }

  const signup = async (data: {
    email: string
    password: string
    name: string
    role: "teacher" | "student"
    classId?: string | null
    batchId?: string | null
  }) => {
    // // 1. Check if email already exists
    const checkRes = await api.get(`/users?email=${data.email}`)

    const existingUsers = await checkRes.json()
    if (existingUsers.length > 0) {
      throw new Error("Email already registered")
    }

    const response = await api.post("/users", data)

    const newUser = await response.json()
    const token = `token_${newUser.id}_${Date.now()}`

    // Strip password before saving
    const { password: _password, ...safeNewUser } = newUser

    setUser(safeNewUser)
    setToken(token)
    localStorage.setItem("user", JSON.stringify(safeNewUser))
    localStorage.setItem("token", token)

    return safeNewUser
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
