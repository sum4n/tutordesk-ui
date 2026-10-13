import { useMemo } from "react"
import type { Assignment, Class, Batch, Subject, Submission } from "@/types"

interface FilterState {
  classId: string | null
  batchId: string | null
  subjectId: string | null
}

interface UseFilteredAssignmentsProps {
  assignments: Assignment[]
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  submissions: Submission[]
  filters: FilterState
}

export interface EnrichedAssignment {
  assignment: Assignment
  className: string
  batchName: string | null
  subjectName: string
  submissionCount: number
  gradedCount: number
}

export function useFilteredAssignments({
  assignments,
  classes,
  batches,
  subjects,
  submissions,
  filters,
}: UseFilteredAssignmentsProps) {
  const filteredAssignments = useMemo(() => {
    let filtered = assignments

    // Filter by class
    if (filters.classId) {
      filtered = filtered.filter((a) => a.classId === filters.classId)
    }

    // Filter by batch
    if (filters.batchId) {
      filtered = filtered.filter(
        (a) => a.batchId === filters.batchId || a.batchId === null
      )
    }

    // Filter by subject
    if (filters.subjectId) {
      filtered = filtered.filter((a) => a.subjectId === filters.subjectId)
    }

    // Enrich with related data
    const enriched: EnrichedAssignment[] = filtered.map((assignment) => {
      const assignmentClass = classes.find((c) => c.id === assignment.classId)
      const assignmentBatch = batches.find((b) => b.id === assignment.batchId)
      const assignmentSubject = subjects.find(
        (s) => s.id === assignment.subjectId
      )

      const assignmentSubmissions = submissions.filter(
        (s) => s.assignmentId === assignment.id
      )
      const submissionCount = assignmentSubmissions.length
      const gradedCount = assignmentSubmissions.filter(
        (s) => s.status === "graded"
      ).length

      return {
        assignment,
        className: assignmentClass?.name || "Unknown",
        batchName: assignmentBatch?.name || null,
        subjectName: assignmentSubject?.name || "Unknown",
        submissionCount,
        gradedCount,
      }
    })

    return enriched
  }, [assignments, classes, batches, subjects, submissions, filters])

  return { filteredAssignments }
}
