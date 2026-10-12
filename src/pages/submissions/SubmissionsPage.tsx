import { useSubmissions } from "./hooks/useSubmissions"
import { useFilteredSubmissions } from "./hooks/useFilteredSubmissions"
import { GradeSubmissionDialog } from "./components/GradeSubmissionDialog"
import { FilterBar } from "@/components/FilterBar"
import { useFilter } from "@/context/FilterContext"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText } from "lucide-react"

export function SubmissionsPage() {
  const {
    submissions,
    assignments,
    students,
    classes,
    batches,
    subjects,
    loading,
    error,
    gradeSubmission,
  } = useSubmissions()

  const { filters } = useFilter()

  const { filteredSubmissions } = useFilteredSubmissions({
    submissions,
    assignments,
    students,
    classes,
    batches,
    filters,
  })

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading submissions...</p>
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

  const totalSubmissions = filteredSubmissions.length
  const gradedCount = filteredSubmissions.filter(
    (s) => s.submission.status === "graded"
  ).length
  const pendingCount = filteredSubmissions.filter(
    (s) => s.submission.status === "submitted"
  ).length

  if (submissions.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold">Submissions</h2>
          <p className="text-sm text-muted-foreground">
            Review and grade student assignment submissions
          </p>
        </div>
        <Card className="p-12 text-center">
          <FileText className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No submissions yet</h3>
          <p className="mb-4 text-muted-foreground">
            Submissions will appear here when students submit their assignments.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold">Submissions</h2>
        <p className="text-sm text-muted-foreground">
          Review and grade student assignment submissions
        </p>
      </div>

      <FilterBar classes={classes} batches={batches} subjects={subjects} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-2xl font-bold">{totalSubmissions}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Graded</p>
            <p className="text-2xl font-bold">{gradedCount}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((s) => (
                <TableRow key={s.submission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{s.studentName}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.studentEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{s.assignmentTitle}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {s.batchName
                        ? `${s.className} - ${s.batchName}`
                        : s.className}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.submission.status === "graded" ? "default" : "outline"
                      }
                    >
                      {s.submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.submission.grade || "—"}</TableCell>
                  <TableCell className="text-right">
                    <GradeSubmissionDialog
                      submission={s}
                      onGrade={gradeSubmission}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
