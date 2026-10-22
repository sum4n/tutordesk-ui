import { useEffect, useState, useCallback } from "react"
import type { Assignment, Class, Batch, Subject, Submission } from "@/types"
import { api } from "@/lib/api"

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
      const [
        assignmentsRes,
        classesRes,
        batchesRes,
        subjectsRes,
        submissionsRes,
      ] = await Promise.all([
        api.get("/assignments"),
        api.get("/classes"),
        api.get("/batches"),
        api.get("/subjects"),
        api.get("/submissions"),
      ])

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
      await api.patch(`/assignments/${id}`, data)

      await fetchAssignmentData()
    },
    [fetchAssignmentData]
  )

  const deleteAssignment = useCallback(
    async (id: string) => {
      await api.delete(`/assignments/${id}`)

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
