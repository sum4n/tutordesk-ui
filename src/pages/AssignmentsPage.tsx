import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useAssignments } from "@/hooks/useAssignments"
import { AssignmentsTable } from "@/components/AssignmentsTable"

export function AssignmentsPage() {
  const { assignments, loading, error } = useAssignments()

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
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Assignment
        </Button>
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
          <AssignmentsTable assignments={assignments} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <AssignmentsTable
            assignments={assignments.filter((a) => a.status === "Active")}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <AssignmentsTable
            assignments={assignments.filter((a) => a.status === "Completed")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
