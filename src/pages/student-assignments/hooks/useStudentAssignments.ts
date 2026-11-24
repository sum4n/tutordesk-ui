import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/useAuth"
import type { Assignment, Submission } from "@/types"
import { api } from "@/lib/api"

export interface StudentAssignment extends Assignment {
  submission?: Submission
  subjectName: string
  className: string
  batchName: string | null
}

export function useStudentAssignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<StudentAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignments = useCallback(async () => {
    if (!user?.classId) {
      setAssignments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Fetch all data
      const [
        assignmentsRes,
        subjectsRes,
        classesRes,
        batchesRes,
        submissionsRes,
      ] = await Promise.all([
        api.get("/assignments"),
        api.get("/subjects"),
        api.get("/classes"),
        api.get("/batches"),
        api.get(`/submissions?studentId=${user.id}`),
      ])

      const [
        assignmentsData,
        subjectsData,
        classesData,
        batchesData,
        submissionsData,
      ] = await Promise.all([
        assignmentsRes.json(),
        subjectsRes.json(),
        classesRes.json(),
        batchesRes.json(),
        submissionsRes.json(),
      ])

      // Filter assignments by student's class and batch
      const filteredAssignments = assignmentsData.filter((a: Assignment) => {
        // Must match student's class
        if (a.classId !== user.classId) return false

        // If assignment has a batchId, it must match student's batch
        if (a.batchId && a.batchId !== user.batchId) return false

        return true
      })

      // Enrich with related data and submission status
      const enriched: StudentAssignment[] = filteredAssignments.map(
        (assignment: Assignment) => {
          const subject = subjectsData.find(
            (s: any) => s.id === assignment.subjectId
          )
          const assignmentClass = classesData.find(
            (c: any) => c.id === assignment.classId
          )
          const assignmentBatch = batchesData.find(
            (b: any) => b.id === assignment.batchId
          )
          const submission = submissionsData.find(
            (s: Submission) => s.assignmentId === assignment.id
          )

          return {
            ...assignment,
            submission,
            subjectName: subject?.name || "Unknown",
            className: assignmentClass?.name || "Unknown",
            batchName: assignmentBatch?.name || null,
          }
        }
      )

      setAssignments(enriched)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [user])

  // 1. Update the signature to accept an optional submissionId
  const submitAssignment = useCallback(
    async (
      assignmentId: string,
      studentPdfUrl: string,
      _submissionId?: string
    ) => {
      if (!user?.id || user.role !== "student") {
        throw new Error("Only students can submit assignments")
      }

      // Resubmission creates a NEW submission row, not a PATCH.
      //
      //   1. POST /submissions is the only write path for students.
      //      PATCH /submissions/:id is teacher-only (requireRole),
      //      so a student PATCH returns 403 today.
      //   2. A new row keeps the RETURNED attempt in history — the
      //      whole point of allowing multiple submissions per
      //      (assignment, student) with no unique constraint.
      //   3. createSubmissionSchema is a strictObject and accepts
      //      exactly { assignmentId, studentPdfUrl }. status,
      //      submittedAt, grade, feedback, teacherPdfUrl, gradedAt,
      //      and studentId are all server-owned; sending any of them
      //      is a 400.
      //
      // _submissionId is accepted for signature compatibility with
      // SubmitAssignmentDialog but is intentionally ignored.
      // TODO: remove the parameter, the dialog prop, and the
      // submissionId={...} on StudentAssignmentPage in a
      // test(refactor): cleanup commit.
      await api.post("/submissions", {
        assignmentId,
        studentPdfUrl,
      })

      await fetchAssignments()
    },
    [user, fetchAssignments]
  )

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  return {
    assignments,
    loading,
    error,
    refresh: fetchAssignments,
    submitAssignment,
  }
}
