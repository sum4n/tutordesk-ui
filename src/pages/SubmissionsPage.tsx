import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSubmissions } from "@/hooks/useSubmissions"
import { useClasses } from "@/hooks/useClasses"
import {
  useFilteredSubmissions,
  ALL_STATUSES,
  ALL_CLASSES,
} from "@/hooks/useFilteredSubmissions"
import { formatDate, getStatusVariant } from "@/lib/utils"

export function SubmissionsPage() {
  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
  } = useSubmissions()
  const { classes, loading: classesLoading, error: classesError } = useClasses()

  const [selectedStatus, setSelectedStatus] = useState<string>(ALL_STATUSES)
  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { filteredSubmissions } = useFilteredSubmissions({
    submissions,
    selectedStatus,
    selectedClass,
    searchQuery,
  })

  if (submissionsLoading || classesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  if (submissionsError || classesError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">
          Error: {submissionsError || classesError}
        </p>
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by student or assignment..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              defaultValue={ALL_STATUSES}
              onValueChange={(value) => {
                if (value) setSelectedStatus(value)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>{ALL_STATUSES}</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Graded">Graded</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={ALL_CLASSES}
              onValueChange={(value) => {
                if (value) setSelectedClass(value)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CLASSES}>{ALL_CLASSES}</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.class.id} value={c.class.name}>
                    {c.class.name}
                  </SelectItem>
                ))}
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
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No submissions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{s.studentName}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.studentEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.assignmentTitle}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.className}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(s.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(s.status)}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {s.grade ? (
                        <span className="font-semibold">{s.grade}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
