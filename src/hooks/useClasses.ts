import { useEffect, useState, useCallback } from "react"
import type { Class, Student, Assignment, Batch } from "@/types"
import { api } from "@/lib/api"

interface ClassDetails {
  class: Class
  studentCount: number
  assignmentCount: number
  batches: { id: string; name: string }[]
}

interface ClassesData {
  classes: ClassDetails[]
  loading: boolean
  error: string | null
  refresh: () => void
  updateClass: (
    id: string,
    data: { name: string; description: string }
  ) => Promise<void>
  deleteClass: (id: string) => Promise<void>
}

export function useClasses(): ClassesData {
  const [classes, setClasses] = useState<ClassDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Wrap the fetch logic in useCallback so it can be returned as `refresh`
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true)
      const [classesRes, studentsRes, assignmentsRes, batchesRes] =
        await Promise.all([
          api.get("/classes"),
          api.get("/users?role=student"),
          api.get("/assignments"),
          api.get("/batches"),
        ])

      const classesData: Class[] = await classesRes.json()
      const students: Student[] = await studentsRes.json()
      const assignments: Assignment[] = await assignmentsRes.json()
      const batches: Batch[] = await batchesRes.json()

      const classesDetails: ClassDetails[] = classesData.map((c) => {
        const studentCount = students.filter((s) => s.classId === c.id).length
        const assignmentCount = assignments.filter(
          (a) => a.classId === c.id
        ).length
        const filteredBatches = batches.filter((b) => b.classId === c.id)

        return {
          class: c,
          studentCount,
          assignmentCount,
          batches: filteredBatches,
        }
      })

      setClasses(classesDetails)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateClass = useCallback(
    async (id: string, data: { name: string; description: string }) => {
      await api.patch(`/classes/${id}`, data)

      // Refresh data after update
      await fetchClassData()
    },
    [fetchClassData]
  )

  const deleteClass = useCallback(
    async (id: string) => {
      await api.delete(`/classes/${id}`)

      await fetchClassData()
    },
    [fetchClassData]
  )

  // Call it on mount
  useEffect(() => {
    fetchClassData()
  }, [fetchClassData])

  // Return the refresh function alongside the data
  return {
    classes,
    loading,
    error,
    refresh: fetchClassData,
    updateClass,
    deleteClass,
  }
}
