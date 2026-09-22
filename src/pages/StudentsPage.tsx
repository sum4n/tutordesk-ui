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
import { Plus } from "lucide-react"
import { useStudents } from "@/hooks/useStudents"
import { useClasses } from "@/hooks/useClasses"
import { useState } from "react"
import { useFilteredStudents, ALL_CLASSES } from "@/hooks/useFilteredStudents"

export function StudentsPage() {
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudents()
  const { classes, loading: classesLoading, error: classesError } = useClasses()

  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { searchedStudents } = useFilteredStudents({
    students,
    selectedClass,
    searchQuery,
  })

  if (studentsLoading || classesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (studentsError || classesError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error: {studentsError || classesError}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="text-sm text-muted-foreground">
            All students across your classes
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search students..."
              className="flex-1"
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
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
                  <SelectItem key={c.class.id} value={c.class.id}>
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
                <TableHead>Class</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedStudents.map((s) => (
                <TableRow key={s.student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{s.student.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {s.batchName
                        ? `${s.className} - ${s.batchName}`
                        : s.className}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.assignmentCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.pendingCount === 0 ? "default" : "outline"}
                    >
                      {s.pendingCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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
