import { Navigate } from "react-router"
import { useAuth } from "@/context/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "teacher" | "student"
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
