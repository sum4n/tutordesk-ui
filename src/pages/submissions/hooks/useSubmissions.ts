import { useEffect, useState, useCallback } from "react"
import type {
  Submission,
  Assignment,
  Student,
  Class,
  Batch,
  Subject,
} from "@/types"

interface SubmissionsData {
  submissions: Submission[]
  assignments: Assignment[]
  students: Student[]
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  loading: boolean
  error: string | null
  refresh: () => void
  gradeSubmission: (
    id: string,
    data: {
      grade: string
      feedback?: string | null
      teacherPdfUrl?: string | null
    }
  ) => Promise<void>
  returnSubmission: (
    id: string,
    data: {
      feedback?: string | null
    }
  ) => Promise<void>
}

export function useSubmissions(): SubmissionsData {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubmissionData = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const [
        submissionsRes,
        assignmentsRes,
        studentsRes,
        classesRes,
        batchesRes,
        subjectsRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/submissions`),
        fetch(`${apiUrl}/assignments`),
        fetch(`${apiUrl}/users?role=student`),
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/batches`),
        fetch(`${apiUrl}/subjects`),
      ])

      if (
        !submissionsRes.ok ||
        !assignmentsRes.ok ||
        !studentsRes.ok ||
        !classesRes.ok ||
        !batchesRes.ok ||
        !subjectsRes.ok
      ) {
        throw new Error("Failed to fetch submission data")
      }

      const [
        submissionsData,
        assignmentsData,
        studentsData,
        classesData,
        batchesData,
        subjectsData,
      ] = await Promise.all([
        submissionsRes.json(),
        assignmentsRes.json(),
        studentsRes.json(),
        classesRes.json(),
        batchesRes.json(),
        subjectsRes.json(),
      ])

      setSubmissions(submissionsData)
      setAssignments(assignmentsData)
      setStudents(studentsData)
      setClasses(classesData)
      setBatches(batchesData)
      setSubjects(subjectsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const gradeSubmission = useCallback(
    async (
      id: string,
      data: {
        grade: string
        feedback?: string | null
        teacherPdfUrl?: string | null
      }
    ) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "graded",
          grade: data.grade,
          feedback: data.feedback || null,
          teacherPdfUrl: data.teacherPdfUrl || null,
          gradedAt: new Date().toISOString().split("T")[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to grade submission")
      }

      await fetchSubmissionData()
    },
    [fetchSubmissionData]
  )

  const returnSubmission = useCallback(
    async (
      id: string,
      data: {
        feedback?: string | null
      }
    ) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "returned",
          feedback: data.feedback || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to return submission")
      }

      await fetchSubmissionData()
    },
    [fetchSubmissionData]
  )

  useEffect(() => {
    fetchSubmissionData()
  }, [fetchSubmissionData])

  return {
    submissions,
    assignments,
    students,
    classes,
    batches,
    subjects,
    loading,
    error,
    refresh: fetchSubmissionData,
    gradeSubmission,
    returnSubmission,
  }
}
