import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAssignments } from "@/hooks/useAssignments"
import { AssignmentsTable } from "@/components/AssignmentsTable"
import { CreateAssignmentDialog } from "@/components/CreateAssignmentDialog"

export function AssignmentsPage() {
  const {
    assignments,
    loading,
    error,
    refresh,
    classes,
    batches,
    subjects,
    classSubjects,
    updateAssignment,
    deleteAssignment,
  } = useAssignments()

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

  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "Active"
  ).length
  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "Completed"
  ).length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-sm text-muted-foreground">
            Upload PDFs and track student submissions
          </p>
        </div>
        <CreateAssignmentDialog
          onAssignmentCreated={refresh}
          classes={classes}
          batches={batches}
          subjects={subjects}
          classSubjects={classSubjects}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({totalAssignments})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAssignments})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAssignments})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <AssignmentsTable
            assignments={assignments}
            updateAssignment={updateAssignment}
            deleteAssignment={deleteAssignment}
            classes={classes}
            batches={batches}
            subjects={subjects}
            classSubjects={classSubjects}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <AssignmentsTable
            assignments={assignments.filter((a) => a.status === "Active")}
            updateAssignment={updateAssignment}
            deleteAssignment={deleteAssignment}
            classes={classes}
            batches={batches}
            subjects={subjects}
            classSubjects={classSubjects}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <AssignmentsTable
            assignments={assignments.filter((a) => a.status === "Completed")}
            updateAssignment={updateAssignment}
            deleteAssignment={deleteAssignment}
            classes={classes}
            batches={batches}
            subjects={subjects}
            classSubjects={classSubjects}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
