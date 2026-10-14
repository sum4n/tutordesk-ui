import { useAuth } from "@/context/useAuth"
import { Card, CardHeader } from "@/components/ui/card"
import { FileText, CheckCircle, Clock } from "lucide-react"

export function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
        <p className="text-sm text-muted-foreground">
          Here's your learning overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">My Assignments</p>
            </div>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
