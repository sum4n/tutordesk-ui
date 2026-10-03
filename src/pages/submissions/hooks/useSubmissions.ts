import { useEffect, useState } from "react"
import type { Submission, Student, Assignment, Class } from "@/types"

export interface EnrichedSubmission {
  id: string
  studentName: string
  studentEmail: string
  assignmentTitle: string
  className: string
  status: "pending" | "submitted" | "graded"
  submittedAt: string | null
  grade: string | null
  studentPdfUrl: string | null
}

interface SubmissionsData {
  submissions: EnrichedSubmission[]
  loading: boolean
  error: string | null
}

export function useSubmissions(): SubmissionsData {
  const [submissions, setSubmissions] = useState<EnrichedSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubmissionsData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const [submissionsRes, studentsRes, assignmentsRes, classesRes] =
          await Promise.all([
            fetch(`${apiUrl}/submissions`),
            fetch(`${apiUrl}/students`),
            fetch(`${apiUrl}/assignments`),
            fetch(`${apiUrl}/classes`),
          ])

        if (
          !submissionsRes.ok ||
          !studentsRes.ok ||
          !assignmentsRes.ok ||
          !classesRes.ok
        ) {
          throw new Error("Failed to fetch submissions data")
        }

        const submissions: Submission[] = await submissionsRes.json()
        const students: Student[] = await studentsRes.json()
        const assignments: Assignment[] = await assignmentsRes.json()
        const classes: Class[] = await classesRes.json()

        const enrichedSubmissions: EnrichedSubmission[] = submissions.map(
          (s) => {
            const student = students.find(
              (student) => student.id === s.studentId
            )
            const assignment = assignments.find((a) => a.id === s.assignmentId)
            const classInfo = classes.find((c) => c.id === assignment?.classId)

            return {
              id: s.id,
              studentName: student?.name || "Unknown",
              studentEmail: student?.email || "Unknown",
              assignmentTitle: assignment?.title || "Unknown",
              className: classInfo?.name || "Unknown",
              status: s.status,
              submittedAt: s.submittedAt,
              grade: s.grade,
              studentPdfUrl: s.studentPdfUrl,
            }
          }
        )

        setSubmissions(enrichedSubmissions)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchSubmissionsData()
  }, [])

  return { submissions, loading, error }
}
