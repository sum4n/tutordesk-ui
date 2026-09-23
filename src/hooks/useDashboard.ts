import { useEffect, useState } from "react"
import type { Student, Class, Assignment, Submission, Stat } from "@/types"

interface EnrichedSubmission {
  id: string
  studentName: string
  assignmentTitle: string
  className: string
  status: "pending" | "submitted" | "graded"
  submittedAt: string | null
}

interface UpcomingDeadline {
  id: string
  title: string
  className: string
  dueDate: string
  month: string
  day: string
}

interface DashboardData {
  stats: Stat[]
  recentSubmissions: EnrichedSubmission[]
  upcomingDeadlines: UpcomingDeadline[]
  loading: boolean
  error: string | null
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<
    EnrichedSubmission[]
  >([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<
    UpcomingDeadline[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL

        const [studentsRes, classesRes, assignmentsRes, submissionsRes] =
          await Promise.all([
            fetch(`${apiUrl}/students`),
            fetch(`${apiUrl}/classes`),
            fetch(`${apiUrl}/assignments`),
            fetch(`${apiUrl}/submissions`),
          ])

        if (
          !studentsRes.ok ||
          !classesRes.ok ||
          !assignmentsRes.ok ||
          !submissionsRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data")
        }

        const students: Student[] = await studentsRes.json()
        const classes: Class[] = await classesRes.json()
        const assignments: Assignment[] = await assignmentsRes.json()
        const submissions: Submission[] = await submissionsRes.json()

        // 1. Calculate Stats
        const pendingReviews = submissions.filter(
          (s) => s.status !== "graded"
        ).length

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const activeAssignments = assignments.filter((a) => {
          const dueDate = new Date(a.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate >= today
        }).length

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
            sub: "Submissions to grade",
          },
          {
            label: "Total Assignments",
            value: assignments.length.toString(),
            sub: `${activeAssignments} currently active`,
          },
        ]

        // 2. Enrich Recent Submissions (Get the last 5)
        const enrichedRecent = submissions
          .sort((a, b) => {
            const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
            const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
            return dateB - dateA
          })
          .slice(0, 5)
          .map((sub) => {
            const student = students.find((s) => s.id === sub.studentId)
            const assignment = assignments.find(
              (a) => a.id === sub.assignmentId
            )
            const studentClass = classes.find((c) => c.id === student?.classId)

            return {
              id: sub.id,
              studentName: student?.name || "Unknown Student",
              assignmentTitle: assignment?.title || "Unknown Assignment",
              className: studentClass?.name || "Unknown Class",
              status: sub.status,
              submittedAt: sub.submittedAt,
            }
          })

        // 3. Calculate Upcoming Deadlines (Next 4 active assignments)
        const deadlines = assignments
          .filter((a) => {
            const dueDate = new Date(a.dueDate)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate >= today // Only future or today
          })
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          ) // Sort by closest date
          .slice(0, 4) // Take top 4
          .map((a) => {
            const studentClass = classes.find((c) => c.id === a.classId)
            const date = new Date(a.dueDate)

            // Format month (e.g., "Sep") and day (e.g., "25")
            const month = date.toLocaleString("default", { month: "short" })
            const day = date.getDate().toString()

            return {
              id: a.id,
              title: a.title,
              className: studentClass?.name || "Unknown Class",
              dueDate: a.dueDate,
              month,
              day,
            }
          })

        setStats(calculatedStats)
        setRecentSubmissions(enrichedRecent)
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
