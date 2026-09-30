import { useEffect, useState, useCallback } from "react"
import type {
  Class,
  Student,
  Assignment,
  Batch,
  Subject,
  ClassSubject,
} from "@/types"

interface ClassDetails {
  class: Class
  studentCount: number
  assignmentCount: number
  batches: { id: string; name: string }[]
  subjects: { id: string; name: string }[]
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
}

export function useClasses(): ClassesData {
  const [classes, setClasses] = useState<ClassDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Wrap the fetch logic in useCallback so it can be returned as `refresh`
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const [
        classesRes,
        studentsRes,
        assignmentsRes,
        batchesRes,
        subjectsRes,
        classSubjectsRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/students`),
        fetch(`${apiUrl}/assignments`),
        fetch(`${apiUrl}/batches`),
        fetch(`${apiUrl}/subjects`),
        fetch(`${apiUrl}/classSubjects`),
      ])

      if (
        !classesRes.ok ||
        !studentsRes.ok ||
        !assignmentsRes.ok ||
        !batchesRes.ok ||
        !subjectsRes.ok ||
        !classSubjectsRes.ok
      ) {
        throw new Error("Failed to fetch data")
      }

      const classesData: Class[] = await classesRes.json()
      const students: Student[] = await studentsRes.json()
      const assignments: Assignment[] = await assignmentsRes.json()
      const batches: Batch[] = await batchesRes.json()
      const subjects: Subject[] = await subjectsRes.json()
      const classSubjects: ClassSubject[] = await classSubjectsRes.json()

      const classesDetails: ClassDetails[] = classesData.map((c) => {
        const studentCount = students.filter((s) => s.classId === c.id).length
        const assignmentCount = assignments.filter(
          (a) => a.classId === c.id
        ).length
        const filteredBatches = batches.filter((b) => b.classId === c.id)
        const filteredClassSubjects = classSubjects.filter(
          (cs) => cs.classId === c.id
        )
        const subjectIds = filteredClassSubjects.map((cs) => cs.subjectId)
        const filteredSubjects = subjects.filter((s) =>
          subjectIds.includes(s.id)
        )

        return {
          class: c,
          studentCount,
          assignmentCount,
          batches: filteredBatches,
          subjects: filteredSubjects,
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
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update class")
      }

      // Refresh data after update
      await fetchClassData()
    },
    [fetchClassData]
  )

  // Call it on mount
  useEffect(() => {
    fetchClassData()
  }, [fetchClassData])

  // Return the refresh function alongside the data
  return { classes, loading, error, refresh: fetchClassData, updateClass }
}
