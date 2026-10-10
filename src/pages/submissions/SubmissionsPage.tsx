import { useState } from "react"
import { useSubmissions } from "./hooks/useSubmissions"
import {
  useFilteredSubmissions,
  ALL_ASSIGNMENTS,
  ALL_CLASSES,
  ALL_STUDENTS,
  ALL_STATUSES,
} from "./hooks/useFilteredSubmissions"
import { GradeSubmissionDialog } from "./components/GradeSubmissionDialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    loading,
    error,
    gradeSubmission,
  } = useSubmissions()

  const [selectedAssignment, setSelectedAssignment] =
    useState<string>(ALL_ASSIGNMENTS)
  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES)
  const [selectedStudent, setSelectedStudent] = useState<string>(ALL_STUDENTS)
  const [selectedStatus, setSelectedStatus] = useState<string>(ALL_STATUSES)

  const { filteredSubmissions } = useFilteredSubmissions({
    submissions,
    assignments,
    students,
    classes,
    batches,
    selectedAssignment,
    selectedClass,
    selectedStudent,
    selectedStatus,
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

  // Stats
  const totalSubmissions = submissions.length
  const gradedCount = submissions.filter((s) => s.status === "graded").length
  const pendingCount = submissions.filter(
    (s) => s.status === "submitted"
  ).length

  // Empty state
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

      {/* Stats */}
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="grid gap-2 md:grid-cols-4">
            <Select
              value={selectedAssignment}
              onValueChange={(value) => {
                if (value !== null) setSelectedAssignment(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ASSIGNMENTS}>
                  {ALL_ASSIGNMENTS}
                </SelectItem>
                {assignments.map((a) => (
                  <SelectItem key={a.id} value={a.title}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedClass}
              onValueChange={(value) => {
                if (value !== null) setSelectedClass(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CLASSES}>{ALL_CLASSES}</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStudent}
              onValueChange={(value) => {
                if (value !== null) setSelectedStudent(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STUDENTS}>{ALL_STUDENTS}</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                if (value !== null) setSelectedStatus(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>{ALL_STATUSES}</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Graded">Graded</SelectItem>
              </SelectContent>
            </Select>
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
