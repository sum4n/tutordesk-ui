import { useEffect, useState, useCallback } from "react"
import type { Assignment, Class, Batch, Subject, Submission } from "@/types"

interface AssignmentsData {
  assignments: Assignment[]
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  submissions: Submission[]
  loading: boolean
  error: string | null
  refresh: () => void
  updateAssignment: (
    id: string,
    data: {
      title?: string
      description?: string
      pdfUrl?: string
      classId?: string
      batchId?: string | null
      subjectId?: string
      dueDate?: string
    }
  ) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>
}

export function useAssignments(): AssignmentsData {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignmentData = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const [
        assignmentsRes,
        classesRes,
        batchesRes,
        subjectsRes,
        submissionsRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/assignments`),
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/batches`),
        fetch(`${apiUrl}/subjects`),
        fetch(`${apiUrl}/submissions`),
      ])

      if (
        !assignmentsRes.ok ||
        !classesRes.ok ||
        !batchesRes.ok ||
        !subjectsRes.ok ||
        !submissionsRes.ok
      ) {
        throw new Error("Failed to fetch assignment data")
      }

      const [
        assignmentsData,
        classesData,
        batchesData,
        subjectsData,
        submissionsData,
      ] = await Promise.all([
        assignmentsRes.json(),
        classesRes.json(),
        batchesRes.json(),
        subjectsRes.json(),
        submissionsRes.json(),
      ])

      setAssignments(assignmentsData)
      setClasses(classesData)
      setBatches(batchesData)
      setSubjects(subjectsData)
      setSubmissions(submissionsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAssignment = useCallback(
    async (
      id: string,
      data: {
        title?: string
        description?: string
        pdfUrl?: string
        classId?: string
        batchId?: string | null
        subjectId?: string
        dueDate?: string
      }
    ) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update assignment")
      }

      await fetchAssignmentData()
    },
    [fetchAssignmentData]
  )

  const deleteAssignment = useCallback(
    async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/assignments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete assignment")
      }

      await fetchAssignmentData()
    },
    [fetchAssignmentData]
  )

  useEffect(() => {
    fetchAssignmentData()
  }, [fetchAssignmentData])

  return {
    assignments,
    classes,
    batches,
    subjects,
    submissions,
    loading,
    error,
    refresh: fetchAssignmentData,
    updateAssignment,
    deleteAssignment,
  }
}
