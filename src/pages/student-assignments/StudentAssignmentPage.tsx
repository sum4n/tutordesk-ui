import { useStudentAssignments } from "./hooks/useStudentAssignments"
import { SubmitAssignmentDialog } from "./components/SubmitAssignmentDialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { FileText, CheckCircle, Clock } from "lucide-react"

export function StudentAssignmentsPage() {
  const { assignments, loading, error, submitAssignment } =
    useStudentAssignments()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading assignments...</p>
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

  if (assignments.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold">My Assignments</h2>
          <p className="text-sm text-muted-foreground">
            View and submit your class assignments
          </p>
        </div>
        <Card className="p-12 text-center">
          <FileText className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No assignments yet</h3>
          <p className="text-muted-foreground">
            Your teacher hasn't assigned any work for your class yet.
          </p>
        </Card>
      </div>
    )
  }

  const pendingCount = assignments.filter((a) => !a.submission).length
  const submittedCount = assignments.filter(
    (a) => a.submission?.status === "submitted"
  ).length
  const gradedCount = assignments.filter(
    (a) => a.submission?.status === "graded"
  ).length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold">My Assignments</h2>
        <p className="text-sm text-muted-foreground">
          View and submit your class assignments
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <p className="text-2xl font-bold">{submittedCount}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
            <p className="text-2xl font-bold">{gradedCount}</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const isOverdue = new Date(assignment.dueDate) < new Date()
                const hasSubmitted = !!assignment.submission
                const isGraded = assignment.submission?.status === "graded"

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        {assignment.description && (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {assignment.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {assignment.subjectName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{assignment.dueDate}</div>
                        {isOverdue && !hasSubmitted && (
                          <div className="text-xs text-red-500">Overdue</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!hasSubmitted ? (
                        <Badge variant="outline">Not Submitted</Badge>
                      ) : isGraded ? (
                        <Badge variant="default">
                          Graded: {assignment.submission?.grade}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Submitted</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {assignment.pdfUrl && (
                          <a
                            href={assignment.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              View PDF
                            </Button>
                          </a>
                        )}
                        {!hasSubmitted && (
                          <SubmitAssignmentDialog
                            assignment={assignment}
                            onSubmit={submitAssignment}
                          />
                        )}
                        {isGraded && assignment.submission?.teacherPdfUrl && (
                          <a
                            href={assignment.submission.teacherPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              View Feedback
                            </Button>
                          </a>
                        )}
                      </div>
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
