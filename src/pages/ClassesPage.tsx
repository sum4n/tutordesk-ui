import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, FileText } from "lucide-react"
import { useClasses } from "@/hooks/useClasses"

export function ClassesPage() {
  const { classes, loading, error } = useClasses()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading classes...</p>
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
          <h2 className="text-xl font-semibold">Classes & Batches</h2>
          <p className="text-sm text-muted-foreground">
            Manage your tuition classes and student batches
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="mb-2 text-lg font-semibold">No classes yet</h3>
          <p className="mb-4 text-muted-foreground">
            Create your first class to get started
          </p>
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Create Class
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card
              key={c.class.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{c.class.name}</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                {c.class.description && (
                  <CardDescription>{c.class.description}</CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Batches</p>
                  {c.batches.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {c.batches.map((b) => (
                        <Badge key={b.id} variant="outline">
                          {b.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No batches</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Subjects</p>
                  {c.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {c.subjects.map((s) => (
                        <Badge key={s.id} variant="secondary">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subjects</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{c.studentCount}</span>
                    <span className="text-sm text-muted-foreground">
                      students
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{c.assignmentCount}</span>
                    <span className="text-sm text-muted-foreground">
                      assignments
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
