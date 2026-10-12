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
import { Pencil, Trash2, ExternalLink, FileText } from "lucide-react"
import { EditAssignmentDialog } from "./EditAssignmentDialog"
import { DeleteAssignmentDialog } from "./DeleteAssignmentDialog"
import type { Class, Batch, Subject } from "@/types"
import type { EnrichedAssignment } from "../hooks/useFilteredAssignments"

interface AssignmentsTableProps {
  assignments: EnrichedAssignment[]
  updateAssignment: (
    id: string,
    data: {
      title?: string
      description?: string
      pdfUrl?: string
      classId?: string
      batchId?: string | null
      subjectId?: string
      dueDate?: string
    }
  ) => Promise<void>
  deleteAssignment: (id: string) => Promise<void>
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
}

export function AssignmentsTable({
  assignments,
  updateAssignment,
  deleteAssignment,
  classes,
  batches,
  subjects,
}: AssignmentsTableProps) {
  const getStatus = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    return due >= today ? "Active" : "Completed"
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submissions</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((enriched) => {
          const {
            assignment,
            className,
            batchName,
            subjectName,
            submissionCount,
            gradedCount,
          } = enriched
          const status = getStatus(assignment.dueDate)

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
                <Badge variant="secondary">{subjectName}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {batchName ? `${className} - ${batchName}` : className}
                </Badge>
              </TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell>
                <Badge variant={status === "Active" ? "default" : "outline"}>
                  {status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{gradedCount}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">
                    {submissionCount}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {assignment.pdfUrl && (
                    <a
                      href={assignment.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  <EditAssignmentDialog
                    assignment={assignment}
                    onUpdate={updateAssignment}
                    classes={classes}
                    batches={batches}
                    subjects={subjects}
                  />
                  <DeleteAssignmentDialog
                    assignmentTitle={assignment.title}
                    onDelete={() => deleteAssignment(assignment.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
