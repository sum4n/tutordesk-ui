import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {classes.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div
                  className={`h-10 w-10 rounded-lg ${c.tone} flex items-center justify-center font-bold`}
                >
                  {c.code}
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <CardTitle className="mt-3">{c.name}</CardTitle>
              <CardDescription>{c.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-semibold">{c.students}</span>{" "}
                  <span className="text-muted-foreground">students</span>
                </div>
                <div>
                  <span className="font-semibold">{c.assignments}</span>{" "}
                  <span className="text-muted-foreground">assignments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
