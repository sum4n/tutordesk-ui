export type PageKey = "dashboard" | "classes" | "students" | "assignments"

export interface NavItem {
  key: PageKey
  label: string
  Icon: React.ElementType
}

export interface PageMeta {
  title: string
  subtitle: string
}

export interface Stat {
  label: string
  value: string
  sub: string
}

export interface Submission {
  id: string
  name: string
  initials: string
  color: string
  assignment: string
  class: string
  status: string
}

export interface Deadline {
  id: string
  month: string
  day: string
  title: string
  meta: string
  tone: string
}

export interface ClassItem {
  code: string
  name: string
  subject: string
  students: number
  assignments: number
  tone: string
}

export interface Student {
  id: string
  name: string
  email: string
  initials: string
  color: string
  class: string
  assignments: number
  pending: number
  grade: string
}

export interface Assignment {
  id: string
  title: string
  file: string
  class: string
  due: string
  submitted: number
  total: number
  status: string
}
