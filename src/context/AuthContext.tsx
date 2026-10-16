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
    const apiUrl = import.meta.env.VITE_API_BASE_URL

    // Check if email already exists
    const checkRes = await fetch(`${apiUrl}/users?email=${data.email}`)
    const existingUsers = await checkRes.json()
    if (existingUsers.length > 0) {
      throw new Error("Email already registered")
    }

    // Create the user account
    const userResponse = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!userResponse.ok) {
      throw new Error("Signup failed")
    }

    const newUser = await userResponse.json()
    const token = `token_${newUser.id}_${Date.now()}`

    // Strip password before saving
    const { password: _password, ...safeNewUser } = newUser

    // If student, create student record AND link it in the database
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

      // Update the user record in the database with the new studentId
      const updateUserRes = await fetch(`${apiUrl}/users/${newUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentRecord.id }),
      })

      if (!updateUserRes.ok) {
        throw new Error("Failed to link student record to user in database")
      }

      // Create the final user object with studentId
      const userWithStudentId = { ...safeNewUser, studentId: studentRecord.id }

      setUser(userWithStudentId)
      setToken(token)
      localStorage.setItem("user", JSON.stringify(userWithStudentId))
      localStorage.setItem("token", token)

      return userWithStudentId
    }

    // For teachers, just save the user
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
