import { useEffect, useState, useCallback } from "react"
import type { Subject } from "@/types"

interface SubjectsData {
  subjects: Subject[]
  loading: boolean
  error: string | null
  refresh: () => void
  createSubject: (data: { name: string; description?: string }) => Promise<void>
  updateSubject: (
    id: string,
    data: { name: string; description?: string }
  ) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
}

export function useSubjects(): SubjectsData {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/subjects`)

      if (!response.ok) {
        throw new Error("Failed to fetch subjects")
      }

      const data: Subject[] = await response.json()
      setSubjects(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const createSubject = useCallback(
    async (data: { name: string; description?: string }) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create subject")
      }

      await fetchSubjects()
    },
    [fetchSubjects]
  )

  const updateSubject = useCallback(
    async (id: string, data: { name: string; description?: string }) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update subject")
      }

      await fetchSubjects()
    },
    [fetchSubjects]
  )

  const deleteSubject = useCallback(
    async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/subjects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete subject")
      }

      await fetchSubjects()
    },
    [fetchSubjects]
  )

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  return {
    subjects,
    loading,
    error,
    refresh: fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  }
}
