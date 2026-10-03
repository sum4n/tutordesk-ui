import { Routes, Route, Navigate, useLocation } from "react-router"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { ClassesPage } from "@/pages/classes/ClassesPage"
import { StudentsPage } from "@/pages/students/StudentsPage"
import { AssignmentsPage } from "@/pages/assignments/AssignmentsPage"
import { SubmissionsPage } from "@/pages/submissions/SubmissionsPage"
import { SubjectsPage } from "@/pages/subjects/SubjectsPage"
import { pageMeta } from "@/config/appConfig"
import type { PageKey } from "@/types"

export default function App() {
  const location = useLocation()

  // Extract current page form URL
  const currentPage = location.pathname.slice(1) || "dashboard"
  const meta = pageMeta[currentPage as PageKey] || pageMeta.dashboard

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
            <Route path="/subjects" element={<SubjectsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
