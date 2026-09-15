import { useEffect, useState } from "react"
import type { Student } from "@/types"

interface StudentData {
  students: Student[]
  loading: boolean
  error: string | null
}

export function useStudents(): StudentData {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentsData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const studentRes = await fetch(`${apiUrl}/students`)

        if (!studentRes.ok) {
          throw new Error("Failed to fetch student data")
        }

        const studentData: Student[] = await studentRes.json()

        setStudents(studentData)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchStudentsData()
  }, [])

  return { students, loading, error }
}
