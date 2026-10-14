import { createContext, useContext } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "teacher" | "student"
  classId?: string | null
  batchId?: string | null
  studentId?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (data: {
    email: string
    password: string
    name: string
    role: "teacher" | "student"
    classId?: string | null
    batchId?: string | null
  }) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
