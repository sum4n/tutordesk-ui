import { useEffect, useState, useCallback } from "react"
import type {
  Assignment,
  Submission,
  Class,
  Student,
  Batch,
  Subject,
  ClassSubject,
} from "@/types"

export interface EnrichedAssignment {
  assignment: Assignment
  className: string
  batchName: string | null
  numberOfStudentsWithAssignments: number
  numberOfAssignmentsSubmitted: number
  status: "Active" | "Completed"
}

interface AssignmentData {
  assignments: EnrichedAssignment[]
  loading: boolean
  error: string | null
  refresh: () => void
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  classSubjects: ClassSubject[]
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>
}

export function useAssignments(): AssignmentData {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([])
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
        studentsRes,
        submissionsRes,
        subjectsRes,
        classSubjectsRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/assignments`),
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/batches`),
        fetch(`${apiUrl}/students`),
        fetch(`${apiUrl}/submissions`),
        fetch(`${apiUrl}/subjects`),
        fetch(`${apiUrl}/classSubjects`),
      ])

      if (
        !assignmentsRes.ok ||
        !classesRes.ok ||
        !batchesRes.ok ||
        !studentsRes.ok ||
        !submissionsRes.ok ||
        !subjectsRes.ok ||
        !classSubjectsRes.ok
      ) {
        throw new Error("Failed to fetch assignment data")
      }

      const assignmentsData: Assignment[] = await assignmentsRes.json()
      const classesData: Class[] = await classesRes.json()
      const batchesData: Batch[] = await batchesRes.json()
      const students: Student[] = await studentsRes.json()
      const submissions: Submission[] = await submissionsRes.json()
      const subjectsData: Subject[] = await subjectsRes.json()
      const classSubjectsData: ClassSubject[] = await classSubjectsRes.json()

      const enrichedAssignments: EnrichedAssignment[] = assignmentsData.map(
        (a) => {
          const assignmentClass = classesData.find((c) => c.id === a.classId)
          const className = assignmentClass?.name || "Unknown"

          const assignmentBatch = batchesData.find((b) => b.id === a.batchId)
          const batchName = assignmentBatch?.name || null

          const numberOfStudentsWithAssignments = students.filter((s) => {
            if (a.batchId) {
              return s.classId === a.classId && s.batchId === a.batchId
            }
            return s.classId === a.classId
          }).length

          const numberOfAssignmentsSubmitted = submissions.filter(
            (s) => s.assignmentId === a.id
          ).length

          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const dueDate = new Date(a.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          const status = dueDate < today ? "Completed" : "Active"

          return {
            assignment: a,
            className,
            batchName,
            numberOfStudentsWithAssignments,
            numberOfAssignmentsSubmitted,
            status,
          }
        }
      )

      setAssignments(enrichedAssignments)
      setClasses(classesData)
      setBatches(batchesData)
      setSubjects(subjectsData)
      setClassSubjects(classSubjectsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAssignment = useCallback(
    async (id: string, data: Partial<Assignment>) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/assignments/${id}`, {
        method: "PUT",
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
    loading,
    error,
    refresh: fetchAssignmentData,
    classes,
    batches,
    subjects,
    classSubjects,
    updateAssignment,
    deleteAssignment,
  }
}
