import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import type { Assignment } from "@/types"

export function AssignmentsTable({
  assignments,
}: {
  assignments: Assignment[]
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.file}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{a.class}</Badge>
                </TableCell>
                <TableCell>{a.due}</TableCell>
                <TableCell>
                  <span className="font-semibold">{a.submitted}</span>
                  <span className="text-muted-foreground"> / {a.total}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      a.status === "Active"
                        ? "default"
                        : a.status === "Completed"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
