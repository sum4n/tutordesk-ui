import { useStudentAssignments } from "@/pages/student-assignments/hooks/useStudentAssignments"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Award, FileText } from "lucide-react"

export function StudentGradesPage() {
  const { assignments, loading, error } = useStudentAssignments()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading your grades...</p>
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

  const gradedAssignments = assignments.filter(
    (a) => a.submission?.status === "graded"
  )

  if (gradedAssignments.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold">My Grades</h2>
          <p className="text-sm text-muted-foreground">
            View your grades and teacher feedback
          </p>
        </div>
        <Card className="p-12 text-center">
          <Award className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No grades yet</h3>
          <p className="text-muted-foreground">
            Your teacher hasn't graded any of your submissions yet. Keep up the
            good work!
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold">My Grades</h2>
        <p className="text-sm text-muted-foreground">
          View your grades and teacher feedback
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date Graded</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradedAssignments.map((assignment) => {
                // optional chaining for TypeScript safety.
                const submission = assignment.submission!

                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {assignment.subjectName}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.gradedAt}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="font-bold">
                        {submission.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground italic">
                      {submission.feedback || "No feedback provided"}
                    </TableCell>
                    <TableCell className="text-right">
                      {submission.teacherPdfUrl ? (
                        <a
                          href={submission.teacherPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View Graded PDF
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No graded PDF
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
