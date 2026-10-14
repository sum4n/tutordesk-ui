import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./useAuth"

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

  // Load from localStorage on mount
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
    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(
      `${apiUrl}/users?email=${email}&password=${password}`
    )

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const users = await response.json()

    if (users.length === 0) {
      throw new Error("Invalid email or password")
    }

    const user = users[0]
    const token = `token_${user.id}_${Date.now()}`

    // Rename the destructured 'password' to '_password' to avoid the duplicate identifier error
    const { password: _password, ...safeUser } = user

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
    const apiUrl = import.meta.env.VITE_API_BASE_URL

    // 1. Check if email already exists
    const checkRes = await fetch(`${apiUrl}/users?email=${data.email}`)
    const existingUsers = await checkRes.json()
    if (existingUsers.length > 0) {
      throw new Error("Email already registered")
    }

    // 2. Create the user account
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Signup failed")
    }

    const newUser = await response.json()
    const token = `token_${newUser.id}_${Date.now()}`

    // Strip password before saving to localStorage
    const { password: _password, ...safeNewUser } = newUser

    // 3. If student, also create a record in the 'students' collection
    if (data.role === "student") {
      const studentRes = await fetch(`${apiUrl}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          classId: data.classId,
          batchId: data.batchId,
        }),
      })

      if (!studentRes.ok) {
        throw new Error("Failed to create student record")
      }

      const studentRecord = await studentRes.json()

      // Attach the new studentId to the user object
      const userWithStudentId = { ...safeNewUser, studentId: studentRecord.id }
      setUser(userWithStudentId)
      setToken(token)
      localStorage.setItem("user", JSON.stringify(userWithStudentId))
      localStorage.setItem("token", token)

      return userWithStudentId
    }

    // 4. For teachers (or if student creation is skipped), just save the user
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
