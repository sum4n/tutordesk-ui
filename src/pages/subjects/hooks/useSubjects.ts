import { useEffect, useState, useCallback } from "react"
import type { Subject } from "@/types"
import { api } from "@/lib/api"

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
      const response = await api.get("/subjects")

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
      await api.post("/subjects", data)

      await fetchSubjects()
    },
    [fetchSubjects]
  )

  const updateSubject = useCallback(
    async (id: string, data: { name: string; description?: string }) => {
      await api.patch(`/subjects/${id}`, data)

      await fetchSubjects()
    },
    [fetchSubjects]
  )

  const deleteSubject = useCallback(
    async (id: string) => {
      await api.delete(`/subjects/${id}`)
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
