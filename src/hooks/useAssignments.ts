import { useEffect, useState } from "react"
import type { Assignment } from "@/types"

interface AssignmentData {
  assignments: Assignment[]
  loading: boolean
  error: string | null
}

export function useAssignments(): AssignmentData {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssignmentData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const assignmentsRes = await fetch(`${apiUrl}/assignments`)

        if (!assignmentsRes.ok) {
          throw new Error("Failed to fetch assignment data")
        }

        const assignmentData: Assignment[] = await assignmentsRes.json()

        setAssignments(assignmentData)
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
