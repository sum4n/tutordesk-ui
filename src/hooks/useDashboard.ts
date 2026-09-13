import { useEffect, useState } from "react"
import type {
  Student,
  ClassItem,
  Assignment,
  Submission,
  Deadline,
  Stat,
} from "@/types"

interface DashboardData {
  stats: Stat[]
  recentSubmissions: Submission[]
  upcomingDeadlines: Deadline[]
  loading: boolean
  error: string | null
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all data in parallel
        const [
          studentsRes,
          classesRes,
          assignmentsRes,
          submissionsRes,
          deadlinesRes,
        ] = await Promise.all([
          fetch("http://localhost:3001/students"),
          fetch("http://localhost:3001/classes"),
          fetch("http://localhost:3001/assignments"),
          fetch("http://localhost:3001/submissions"),
          fetch("http://localhost:3001/deadlines"),
        ])

        // Check if all requests succeeded
        if (
          !studentsRes.ok ||
          !classesRes.ok ||
          !assignmentsRes.ok ||
          !submissionsRes.ok ||
          !deadlinesRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data")
        }

        // Parse all responses
        const students: Student[] = await studentsRes.json()
        const classes: ClassItem[] = await classesRes.json()
        const assignments: Assignment[] = await assignmentsRes.json()
        const submissions: Submission[] = await submissionsRes.json()
        const deadlines: Deadline[] = await deadlinesRes.json()

        // Calculate stats
        const pendingReviews = submissions.filter(
          (s) => s.status === "Pending"
        ).length
        const activeAssignments = assignments.filter(
          (a) => a.status === "Active"
        ).length

        const calculatedStats: Stat[] = [
          {
            label: "Total Students",
            value: students.length.toString(),
            sub: `Across ${classes.length} classes`,
          },
          {
            label: "Active Classes",
            value: classes.length.toString(),
            sub: classes.map((c) => c.name).join(", "),
          },
          {
            label: "Pending Reviews",
            value: pendingReviews.toString(),
            sub: "Sumissions to grade",
          },
          {
            label: "Assignments",
            value: assignments.length.toString(),
            sub: `${activeAssignments} active this week`,
          },
        ]

        // Update state
        setStats(calculatedStats)
        setRecentSubmissions(submissions)
        setUpcomingDeadlines(deadlines)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return { stats, recentSubmissions, upcomingDeadlines, loading, error }
}
