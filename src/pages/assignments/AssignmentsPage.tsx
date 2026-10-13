import { useAssignments } from "./hooks/useAssignments"
import { useFilteredAssignments } from "./hooks/useFilteredAssignments"
import { CreateAssignmentDialog } from "./components/CreateAssignmentDialog"
import { AssignmentsTable } from "./components/AssignmentsTable"
import { FilterBar } from "@/components/FilterBar"
import { useFilter } from "@/context/useFilter"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export function AssignmentsPage() {
  const {
    assignments,
    loading,
    error,
    refresh,
    classes,
    batches,
    subjects,
    submissions,
    updateAssignment,
    deleteAssignment,
  } = useAssignments()

  const { filters } = useFilter()

  const { filteredAssignments } = useFilteredAssignments({
    assignments,
    classes,
    batches,
    subjects,
    submissions,
    filters,
  })

  // 1. PUT getStatus HERE (inside the component, before the returns)
  const getStatus = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    return due >= today ? "Active" : "Completed"
  }

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

  const hasClasses = classes.length > 0
  const hasSubjects = subjects.length > 0
  const canCreateAssignment = hasClasses && hasSubjects

  if (!canCreateAssignment) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-sm text-muted-foreground">
            Upload PDFs and track student submissions
          </p>
        </div>
        <Card className="p-12 text-center">
          <FileText className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            {!hasClasses && !hasSubjects
              ? "Create a class and subject first"
              : !hasClasses
                ? "Create a class first"
                : "Create a subject first"}
          </h3>
          <p className="mb-4 text-muted-foreground">
            {!hasClasses && !hasSubjects
              ? "You need at least one class and one subject before you can create assignments."
              : !hasClasses
                ? "You need at least one class before you can create assignments."
                : "You need at least one subject before you can create assignments."}
          </p>
          <div className="flex justify-center gap-3">
            {!hasClasses && (
              <Link to="/classes">
                <Button>Create Class</Button>
              </Link>
            )}
            {!hasSubjects && (
              <Link to="/subjects">
                <Button>Create Subject</Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // 2. UPDATE THESE COUNTS TO USE getStatus
  const totalAssignments = filteredAssignments.length
  const activeAssignments = filteredAssignments.filter(
    (a) => getStatus(a.assignment.dueDate) === "Active"
  ).length
  const completedAssignments = filteredAssignments.filter(
    (a) => getStatus(a.assignment.dueDate) === "Completed"
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
        />
      </div>

      <FilterBar classes={classes} batches={batches} subjects={subjects} />

      {filteredAssignments.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="m-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No assignments found</h3>
          <p className="mb-4 text-muted-foreground">
            {filters.classId || filters.batchId || filters.subjectId
              ? "Try adjusting your filters"
              : "Create your first assignment to get started"}
          </p>
          {!filters.classId && !filters.batchId && !filters.subjectId && (
            <CreateAssignmentDialog
              onAssignmentCreated={refresh}
              classes={classes}
              batches={batches}
              subjects={subjects}
            />
          )}
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({totalAssignments})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeAssignments})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedAssignments})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <AssignmentsTable
              assignments={filteredAssignments}
              updateAssignment={updateAssignment}
              deleteAssignment={deleteAssignment}
              classes={classes}
              batches={batches}
              subjects={subjects}
            />
          </TabsContent>

          {/* 3. UPDATE THESE TABS CONTENT SECTIONS */}
          <TabsContent value="active" className="mt-4">
            <AssignmentsTable
              assignments={filteredAssignments.filter(
                (a) => getStatus(a.assignment.dueDate) === "Active"
              )}
              updateAssignment={updateAssignment}
              deleteAssignment={deleteAssignment}
              classes={classes}
              batches={batches}
              subjects={subjects}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <AssignmentsTable
              assignments={filteredAssignments.filter(
                (a) => getStatus(a.assignment.dueDate) === "Completed"
              )}
              updateAssignment={updateAssignment}
              deleteAssignment={deleteAssignment}
              classes={classes}
              batches={batches}
              subjects={subjects}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
