import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/hooks/useDashboard"

export function DashboardPage() {
  const { stats, recentSubmissions, upcomingDeadlines, loading, error } =
    useDashboard()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
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

  return (
    <div className="space-y-6 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Submissions Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Submissions</CardTitle>
              <Button variant="ghost" size="sm">
                View all →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No recent submissions.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSubmissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium">{s.studentName}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {s.assignmentTitle}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.className}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            s.status === "graded"
                              ? "default"
                              : s.status === "submitted"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No upcoming deadlines.
              </p>
            ) : (
              upcomingDeadlines.map((d) => (
                <div key={d.id} className="flex items-start gap-3">
                  {/* Calendar Date Box */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <div className="text-center leading-tight">
                      <div className="text-[10px] font-semibold uppercase">
                        {d.month}
                      </div>
                      <div className="text-lg font-bold">{d.day}</div>
                    </div>
                  </div>

                  {/* Deadline Details */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {d.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{d.className}</span>
                      <span>•</span>
                      <span>Due {d.dueDate}</span>
                    </div>
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
