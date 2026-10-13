import { useMemo } from "react"
import type { Submission, Assignment, Student, Class, Batch } from "@/types"

interface FilterState {
  classId: string | null
  batchId: string | null
  subjectId: string | null
}

interface UseFilteredSubmissionsProps {
  submissions: Submission[]
  assignments: Assignment[]
  students: Student[]
  classes: Class[]
  batches: Batch[]
  filters: FilterState
}

export interface EnrichedSubmission {
  submission: Submission
  studentName: string
  studentEmail: string
  assignmentTitle: string
  className: string
  batchName: string | null
}

export function useFilteredSubmissions({
  submissions,
  assignments,
  students,
  classes,
  batches,
  filters,
}: UseFilteredSubmissionsProps) {
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions

    // Filter by class (through student)
    if (filters.classId) {
      const classStudentIds = students
        .filter((s) => s.classId === filters.classId)
        .map((s) => s.id)
      filtered = filtered.filter((sub) =>
        classStudentIds.includes(sub.studentId)
      )
    }

    // Filter by batch (through student)
    if (filters.batchId) {
      const batchStudentIds = students
        .filter((s) => s.batchId === filters.batchId)
        .map((s) => s.id)
      filtered = filtered.filter((sub) =>
        batchStudentIds.includes(sub.studentId)
      )
    }

    // Filter by subject (through assignment)
    if (filters.subjectId) {
      const subjectAssignmentIds = assignments
        .filter((a) => a.subjectId === filters.subjectId)
        .map((a) => a.id)
      filtered = filtered.filter((sub) =>
        subjectAssignmentIds.includes(sub.assignmentId)
      )
    }

    // Enrich with related data
    const enriched: EnrichedSubmission[] = filtered.map((submission) => {
      const student = students.find((s) => s.id === submission.studentId)
      const assignment = assignments.find(
        (a) => a.id === submission.assignmentId
      )
      const studentClass = classes.find((c) => c.id === student?.classId)
      const studentBatch = batches.find((b) => b.id === student?.batchId)

      return {
        submission,
        studentName: student?.name || "Unknown",
        studentEmail: student?.email || "",
        assignmentTitle: assignment?.title || "Unknown",
        className: studentClass?.name || "Unknown",
        batchName: studentBatch?.name || null,
      }
    })

    return enriched
  }, [submissions, assignments, students, classes, batches, filters])

  return { filteredSubmissions }
}
