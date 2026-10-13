import { useSubjects } from "@/pages/subjects/hooks/useSubjects"
import { CreateSubjectDialog } from "@/pages/subjects/components/CreateSubjectDialog"
import { EditSubjectDialog } from "@/pages/subjects/components/EditSubjectDialog"
import { DeleteSubjectDialog } from "@/pages/subjects/components/DeleteSubjectDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export function SubjectsPage() {
  const {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading subjects...</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Subjects</h2>
          <p className="text-sm text-muted-foreground">
            Manage your curriculum subjects
          </p>
        </div>
        <CreateSubjectDialog createSubject={createSubject} />
      </div>
      {subjects.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No subjects yet</h3>
          <p className="mb-4 text-muted-foreground">
            Create your first subject to get started
          </p>
          <CreateSubjectDialog createSubject={createSubject} />
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      {subject.name}
                    </TableCell>
                    <TableCell>{subject.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditSubjectDialog
                          subject={subject}
                          updateSubject={updateSubject}
                        />
                        <DeleteSubjectDialog
                          subjectName={subject.name}
                          onDelete={() => deleteSubject(subject.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
