import { useMemo } from "react"
import type { Student, Class, Batch, Assignment, Submission } from "@/types"

export const ALL_CLASSES = "All Classes"

export interface EnrichedStudent {
  student: Student
  className: string
  batchName: string | null
  assignmentCount: number
  assignmentsDone: number
  pendingCount: number
}

interface UseFilteredStudentsProps {
  students: Student[]
  classes: Class[]
  batches: Batch[]
  assignments: Assignment[]
  submissions: Submission[]
  selectedClass: string
  searchQuery: string
}

export function useFilteredStudents({
  students,
  classes,
  batches,
  assignments,
  submissions,
  selectedClass,
  searchQuery,
}: UseFilteredStudentsProps) {
  const searchedStudents = useMemo(() => {
    let filtered = students

    // Filter by class
    if (selectedClass !== ALL_CLASSES) {
      const selectedClassObj = classes.find((c) => c.name === selectedClass)
      if (selectedClassObj) {
        filtered = filtered.filter((s) => s.classId === selectedClassObj.id)
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query)
      )
    }

    // Enrich with class/batch names and assignment stats
    const enriched: EnrichedStudent[] = filtered.map((student) => {
      const studentClass = classes.find((c) => c.id === student.classId)
      const className = studentClass?.name || "Unknown"

      const studentBatch = batches.find((b) => b.id === student.batchId)
      const batchName = studentBatch?.name || null

      // Count assignments for this student's class
      const classAssignments = assignments.filter(
        (a) => a.classId === student.classId
      )
      const assignmentCount = classAssignments.length

      // Count submissions for this student
      const studentSubmissions = submissions.filter(
        (s) => s.studentId === student.id
      )
      const assignmentsDone = studentSubmissions.filter(
        (s) => s.status === "submitted" || s.status === "graded"
      ).length
      const pendingCount = assignmentCount - assignmentsDone

      return {
        student,
        className,
        batchName,
        assignmentCount,
        assignmentsDone,
        pendingCount,
      }
    })

    return enriched
  }, [
    students,
    classes,
    batches,
    assignments,
    submissions,
    selectedClass,
    searchQuery,
  ])

  return { searchedStudents }
}
