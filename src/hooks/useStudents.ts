import { useEffect, useState } from "react"
import type { Student, Class, Assignment, Submission, Batch } from "@/types"

interface StudentDetails {
  student: Student
  className: string
  batchName: string | null
  assignmentCount: number
  pendingCount: number
}

interface StudentData {
  students: StudentDetails[]
  loading: boolean
  error: string | null
}

export function useStudents(): StudentData {
  const [students, setStudents] = useState<StudentDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentsData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const [
          studentsRes,
          classesRes,
          assignmentsRes,
          submissionsRes,
          batchesRes,
        ] = await Promise.all([
          fetch(`${apiUrl}/students`),
          fetch(`${apiUrl}/classes`),
          fetch(`${apiUrl}/assignments`),
          fetch(`${apiUrl}/submissions`),
          fetch(`${apiUrl}/batches`),
        ])

        if (
          !studentsRes.ok ||
          !classesRes.ok ||
          !assignmentsRes.ok ||
          !submissionsRes.ok ||
          !batchesRes.ok
        ) {
          throw new Error("Failed to fetch student data")
        }

        const students: Student[] = await studentsRes.json()
        const classes: Class[] = await classesRes.json()
        const assignments: Assignment[] = await assignmentsRes.json()
        const submissions: Submission[] = await submissionsRes.json()
        const batches: Batch[] = await batchesRes.json()

        const enrichedStudents: StudentDetails[] = students.map((s) => {
          // Get class name
          const studentClass = classes.find((c) => c.id === s.classId)
          const className = studentClass?.name || "Unknown"

          // Get batch name if exists
          const studentBatch = batches.find((b) => b.id === s.batchId)
          const batchName = studentBatch?.name || null

          // Count assignments
          const assignmentCount = assignments.filter(
            (a) => a.classId === s.classId
          ).length

          // Count pending submissions
          const pendingCount = submissions.filter(
            (sub) => sub.studentId === s.id && sub.status !== "graded"
          ).length

          return {
            student: s,
            className,
            batchName,
            assignmentCount,
            pendingCount,
          }
        })

        setStudents(enrichedStudents)
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
