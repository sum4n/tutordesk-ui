import { useEffect, useState } from "react"
import type { Assignment, Submission, Class, Student, Batch } from "@/types"

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
}

export function useAssignments(): AssignmentData {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssignmentData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        // const assignmentsRes = await fetch(`${apiUrl}/assignments`)
        const [
          assignmentsRes,
          classesRes,
          batchesRes,
          studentsRes,
          submissionsRes,
        ] = await Promise.all([
          fetch(`${apiUrl}/assignments`),
          fetch(`${apiUrl}/classes`),
          fetch(`${apiUrl}/batches`),
          fetch(`${apiUrl}/students`),
          fetch(`${apiUrl}/submissions`),
        ])

        if (
          !assignmentsRes.ok ||
          !classesRes.ok ||
          !batchesRes.ok ||
          !studentsRes.ok ||
          !submissionsRes.ok
        ) {
          throw new Error("Failed to fetch assignment data")
        }

        const assignments: Assignment[] = await assignmentsRes.json()
        const classes: Class[] = await classesRes.json()
        const batches: Batch[] = await batchesRes.json()
        const students: Student[] = await studentsRes.json()
        const submissions: Submission[] = await submissionsRes.json()

        const enrichedAssignment: EnrichedAssignment[] = assignments.map(
          (a) => {
            // Get class name
            const assignmentClass = classes.find((c) => c.id === a.classId)
            const className = assignmentClass?.name || "unknown"

            // Get batch name
            const assignmentBatch = batches.find((b) => b.id === a.batchId)
            const batchName = assignmentBatch?.name || null

            // Get number of students with assignments
            const numberOfStudentsWithAssignments = students.filter((s) => {
              if (a.batchId) {
                return s.classId === a.classId && s.batchId === a.batchId
              }
              return s.classId === a.classId
            }).length

            // Get number of submissions
            const numberOfAssignmentsSubmitted = submissions.filter(
              (s) => s.assignmentId === a.id
            ).length

            // Determine status based on due date
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

        setAssignments(enrichedAssignment)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchAssignmentData()
  }, [])

  return { assignments, loading, error }
}
