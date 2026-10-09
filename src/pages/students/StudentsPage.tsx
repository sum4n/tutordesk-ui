import { useState } from "react"
import { useStudents } from "./hooks/useStudents"
import { CreateStudentDialog } from "./components/CreateStudentDialog"
import { EditStudentDialog } from "./components/EditStudentDialog"
import { DeleteStudentDialog } from "./components/DeleteStudentDialog"
import { useFilteredStudents, ALL_CLASSES } from "./hooks/useFilteredStudents"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Users, GraduationCap } from "lucide-react"
import { Link } from "react-router"

export function StudentsPage() {
  const {
    students,
    classes,
    batches,
    assignments,
    submissions,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents()

  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const { searchedStudents } = useFilteredStudents({
    students,
    classes,
    batches,
    assignments,
    submissions,
    selectedClass,
    searchQuery,
  })

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading students...</p>
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

  const hasClasses = classes.length > 0

  // Prerequisite guard
  if (!hasClasses) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold">Students</h2>
          <p className="text-sm text-muted-foreground">
            Manage students enrolled in your tuition center
          </p>
        </div>
        <Card className="p-12 text-center">
          <Users className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Create a class first</h3>
          <p className="mb-4 text-muted-foreground">
            You need at least one class before you can add students.
          </p>
          <Link to="/classes">
            <Button>
              <GraduationCap className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Empty state
  if (students.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Students</h2>
            <p className="text-sm text-muted-foreground">
              Manage students enrolled in your tuition center
            </p>
          </div>
          <CreateStudentDialog
            onCreate={createStudent}
            classes={classes}
            batches={batches}
          />
        </div>
        <Card className="p-12 text-center">
          <Users className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No students yet</h3>
          <p className="mb-4 text-muted-foreground">
            Add your first student to get started.
          </p>
          <CreateStudentDialog
            onCreate={createStudent}
            classes={classes}
            batches={batches}
          />
        </Card>
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
        <CreateStudentDialog
          onCreate={createStudent}
          classes={classes}
          batches={batches}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search students..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-40">
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Pending Reviews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{`${s.assignmentsDone} / ${s.assignmentCount}`}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.pendingCount === 0 ? "default" : "outline"}
                    >
                      {s.pendingCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditStudentDialog
                        student={s.student}
                        onUpdate={updateStudent}
                        classes={classes}
                        batches={batches}
                      />
                      <DeleteStudentDialog
                        studentName={s.student.name}
                        onDelete={() => deleteStudent(s.student.id)}
                      />
                    </div>
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
