import { useMemo } from "react"
import type { Submission, Assignment, Student, Class, Batch } from "@/types"

export const ALL_ASSIGNMENTS = "All Assignments"
export const ALL_CLASSES = "All Classes"
export const ALL_STUDENTS = "All Students"
export const ALL_STATUSES = "All Statuses"

export interface EnrichedSubmission {
  submission: Submission
  studentName: string
  studentEmail: string
  assignmentTitle: string
  className: string
  batchName: string | null
}

interface UseFilteredSubmissionsProps {
  submissions: Submission[]
  assignments: Assignment[]
  students: Student[]
  classes: Class[]
  batches: Batch[]
  selectedAssignment: string
  selectedClass: string
  selectedStudent: string
  selectedStatus: string
}

export function useFilteredSubmissions({
  submissions,
  assignments,
  students,
  classes,
  batches,
  selectedAssignment,
  selectedClass,
  selectedStudent,
  selectedStatus,
}: UseFilteredSubmissionsProps) {
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions

    // Filter by assignment
    if (selectedAssignment !== ALL_ASSIGNMENTS) {
      const selectedAssignmentObj = assignments.find(
        (a) => a.title === selectedAssignment
      )
      if (selectedAssignmentObj) {
        filtered = filtered.filter(
          (s) => s.assignmentId === selectedAssignmentObj.id
        )
      }
    }

    // Filter by class
    if (selectedClass !== ALL_CLASSES) {
      const selectedClassObj = classes.find((c) => c.name === selectedClass)
      if (selectedClassObj) {
        const classStudentIds = students
          .filter((s) => s.classId === selectedClassObj.id)
          .map((s) => s.id)
        filtered = filtered.filter((s) => classStudentIds.includes(s.studentId))
      }
    }

    // Filter by student
    if (selectedStudent !== ALL_STUDENTS) {
      const selectedStudentObj = students.find(
        (s) => s.name === selectedStudent
      )
      if (selectedStudentObj) {
        filtered = filtered.filter((s) => s.studentId === selectedStudentObj.id)
      }
    }

    // Filter by status
    if (selectedStatus !== ALL_STATUSES) {
      filtered = filtered.filter(
        (s) => s.status === selectedStatus.toLowerCase()
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
  }, [
    submissions,
    assignments,
    students,
    classes,
    batches,
    selectedAssignment,
    selectedClass,
    selectedStudent,
    selectedStatus,
  ])

  return { filteredSubmissions }
}
