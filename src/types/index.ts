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

export interface Class {
  id: string
  name: string
  description: string
}

export interface Batch {
  id: string
  classId: string
  name: string
  schedule: string
}

export interface Subject {
  id: string
  name: string
}

export interface ClassSubject {
  id: string
  classId: string
  subjectId: string
}

export interface Student {
  id: string
  name: string
  email: string
  classId: string
  batchId: string | null
}

export interface Assignment {
  id: string
  title: string
  description: string
  pdfUrl: string
  classId: string
  batchId: string
  subjectId: string
  dueDate: string
  createdAt: string
}

export interface Submission {
  id: string
  assignments: string
  studentId: string
  status: "pending" | "submitted" | "graded"
  studentPdfUrl: string | null
  submittedAt: string | null
  teacherPdfUrl: string | null
  gradedAt: string | null
  grade: string | null
  feedback: string | null
}
