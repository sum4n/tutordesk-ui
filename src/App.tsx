import { Routes, Route, Navigate, useLocation } from "react-router"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { DashboardPage } from "@/pages/DashboardPage"
import { ClassesPage } from "@/pages/ClassesPage"
import { StudentsPage } from "@/pages/StudentsPage"
import { AssignmentsPage } from "@/pages/AssignmentsPage"
import { SubmissionsPage } from "@/pages/SubmissionsPage"
import { pageMeta } from "@/config/appConfig"
import type { PageKey } from "@/types"

export default function App() {
  const location = useLocation()

  // Extract current page form URL
  const currentPage = location.pathname.slice(1) || "dashboard"
  const meta = pageMeta[currentPage as PageKey] || pageMeta.dashboard

  // const [page, setPage] = useState<PageKey>("dashboard")
  // const meta = pageMeta[page]

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
