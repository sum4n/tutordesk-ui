import { useAuth } from "@/context/useAuth"
import { TeacherDashboard } from "./TeacherDashboard"
import { StudentDashboard } from "./StudentDashboard"

export function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === "teacher") {
    return <TeacherDashboard />
  }

  return <StudentDashboard />
}
