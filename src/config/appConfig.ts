import type { NavItem, PageMeta, PageKey } from "@/types"
import { LayoutDashboard, GraduationCap, Users, FileText } from "lucide-react"

export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "classes", label: "Classes", Icon: GraduationCap },
  { key: "students", label: "Students", Icon: Users },
  { key: "assignments", label: "Assignments", Icon: FileText },
]

export const pageMeta: Record<PageKey, PageMeta> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Teacher Mom" },
  classes: {
    title: "Classes & Batches",
    subtitle: "Manage your tuition classes",
  },
  students: { title: "Students", subtitle: "All students across your classes" },
  assignments: {
    title: "Assignments",
    subtitle: "Upload PDFs and track submissions",
  },
}
