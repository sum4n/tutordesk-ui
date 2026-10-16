import { Routes, Route, Navigate, useLocation, Outlet } from "react-router"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { ClassesPage } from "@/pages/classes/ClassesPage"
import { StudentsPage } from "@/pages/students/StudentsPage"
import { AssignmentsPage } from "@/pages/assignments/AssignmentsPage"
import { SubmissionsPage } from "@/pages/submissions/SubmissionsPage"
import { SubjectsPage } from "@/pages/subjects/SubjectsPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { SignupPage } from "@/pages/auth/SignupPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { pageMeta } from "@/config/appConfig"
import type { PageKey } from "@/types"
import { FilterProvider } from "@/context/FilterContext"
import { AuthProvider } from "@/context/AuthContext"
import { StudentAssignmentsPage } from "@/pages/student-assignments/StudentAssignmentPage"
import { StudentGradesPage } from "@/pages/student-grades/StudentGradesPage"

// Layout for authenticated users (Sidebar + TopBar)
function AuthenticatedLayout() {
  const location = useLocation()
  const currentPage = location.pathname.slice(1) || "dashboard"
  const meta = pageMeta[currentPage as PageKey] || pageMeta.dashboard

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <Routes>
          {/* 1. Public Routes (No layout, no auth required) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 2. Protected Layout Route (Checks if user is logged in) */}
          <Route
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 3. Teacher-Only Routes */}
            <Route
              path="/classes"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <ClassesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <StudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <AssignmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <SubmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute requiredRole="teacher">
                  <SubjectsPage />
                </ProtectedRoute>
              }
            />

            {/* 4. Shared Dashboard Route (NO requiredRole - both can access) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 5. Student-Only Routes */}
            <Route
              path="/my-assignments"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentAssignmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-grades"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentGradesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 6. Catch-all: Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </FilterProvider>
    </AuthProvider>
  )
}
