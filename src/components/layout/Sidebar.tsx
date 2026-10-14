import { useLocation, useNavigate } from "react-router"
import { useAuth } from "@/context/useAuth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
  EllipsisVertical,
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  BookOpen,
  GraduationCap,
} from "lucide-react"

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isTeacher = user?.role === "teacher"
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Helper to get initials for avatar fallback
  const getInitials = (name?: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U"
  }

  return (
    <aside className="flex w-60 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">TutorDesk</div>
          <div className="text-xs text-muted-foreground">
            {isTeacher ? "Teacher Portal" : "Student Portal"}
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation Links */}
      <ScrollArea className="flex-1 py-3">
        <div className="space-y-6 px-4">
          {/* Overview Section */}
          <div>
            <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Overview
            </div>
            <nav className="space-y-1">
              <Button
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </nav>
          </div>

          {/* Manage Section (Role-Based) */}
          <div>
            <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {isTeacher ? "Manage" : "My Learning"}
            </div>
            <nav className="space-y-1">
              {isTeacher ? (
                // Teacher Links
                <>
                  <Button
                    variant={isActive("/classes") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/classes")}
                  >
                    <Users className="h-4 w-4" />
                    Classes
                  </Button>
                  <Button
                    variant={isActive("/students") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/students")}
                  >
                    <Users className="h-4 w-4" />
                    Students
                  </Button>
                  <Button
                    variant={isActive("/assignments") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/assignments")}
                  >
                    <FileText className="h-4 w-4" />
                    Assignments
                  </Button>
                  <Button
                    variant={isActive("/submissions") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/submissions")}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Submissions
                  </Button>
                  <Button
                    variant={isActive("/subjects") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/subjects")}
                  >
                    <BookOpen className="h-4 w-4" />
                    Subjects
                  </Button>
                </>
              ) : (
                // Student Links
                <>
                  <Button
                    variant={
                      isActive("/my-assignments") ? "secondary" : "ghost"
                    }
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/my-assignments")}
                  >
                    <FileText className="h-4 w-4" />
                    My Assignments
                  </Button>
                  <Button
                    variant={isActive("/my-grades") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/my-grades")}
                  >
                    <CheckCircle className="h-4 w-4" />
                    My Grades
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <Separator />

      {/* User Dropdown Menu */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-auto w-full justify-start py-3"
              >
                <div className="flex w-full items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <p className="w-full truncate text-sm font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="w-full truncate text-xs text-muted-foreground">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            }
          />
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
