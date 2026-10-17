import { useAuth } from "@/context/useAuth"
import { useStudentAssignments } from "@/pages/student-assignments/hooks/useStudentAssignments"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { FileText, CheckCircle, Clock, Calendar, Award } from "lucide-react"

export function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { assignments, loading, error } = useStudentAssignments()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  // Compute stats
  const pending = assignments.filter((a) => !a.submission)
  const submitted = assignments.filter(
    (a) => a.submission?.status === "submitted"
  )
  const graded = assignments.filter((a) => a.submission?.status === "graded")
  const returned = assignments.filter(
    (a) => a.submission?.status === "returned"
  )

  // Upcoming deadlines: not submitted, sorted by due date ascending, top 5
  const upcomingDeadlines = pending
    .filter((a) => new Date(a.dueDate) >= new Date(new Date().toDateString()))
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5)

  // Overdue: not submitted and past due date
  const overdue = pending.filter(
    (a) => new Date(a.dueDate) < new Date(new Date().toDateString())
  )

  // Recent grades: graded, sorted by gradedAt descending, top 5
  const recentGrades = [...graded]
    .sort((a, b) => {
      const dateA = a.submission?.gradedAt
        ? new Date(a.submission.gradedAt).getTime()
        : 0
      const dateB = b.submission?.gradedAt
        ? new Date(b.submission.gradedAt).getTime()
        : 0
      return dateB - dateA
    })
    .slice(0, 5)

  // Helper: days until due
  const daysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date(new Date().toDateString())
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diff
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
        <p className="text-sm text-muted-foreground">
          Here's your learning overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold">
              {pending.length + returned.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {returned.length > 0 ? (
                <span className="font-medium text-orange-600">
                  {returned.length} returned for revision
                </span>
              ) : overdue.length > 0 ? (
                `${overdue.length} overdue`
              ) : (
                "All on track"
              )}
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <p className="text-2xl font-bold">{submitted.length}</p>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
            <p className="text-2xl font-bold">{graded.length}</p>
            <p className="text-xs text-muted-foreground">
              {graded.length} of {assignments.length} total
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Upcoming Deadlines</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-assignments")}
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No upcoming deadlines. You're all caught up!
              </p>
            ) : (
              upcomingDeadlines.map((assignment) => {
                const days = daysUntilDue(assignment.dueDate)
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.subjectName}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <Badge
                        variant={days <= 2 ? "destructive" : "secondary"}
                        className="mb-1"
                      >
                        {days === 0
                          ? "Today"
                          : days === 1
                            ? "Tomorrow"
                            : `${days} days`}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {assignment.dueDate}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Recent Grades</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-grades")}
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentGrades.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No grades yet. Keep submitting your work!
              </p>
            ) : (
              recentGrades.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.subjectName}
                    </p>
                    {assignment.submission?.feedback && (
                      <p className="mt-1 truncate text-xs text-muted-foreground italic">
                        "{assignment.submission.feedback}"
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <Badge variant="default" className="mb-1">
                      {assignment.submission?.grade}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {assignment.submission?.gradedAt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
