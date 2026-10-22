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
      submissionId?: string
    ) => {
      if (!user?.id || user.role !== "student") {
        throw new Error("Student ID not found")
      }
      // 2. If submissionId exists, we are resubmitting an existing record (PATCH)
      if (submissionId) {
        await api.patch(`/submissions/${submissionId}`, {
          status: "submitted",
          studentPdfUrl,
          submittedAt: new Date().toISOString().split("T")[0],
          // Clear old grading data for the fresh attempt
          grade: null,
          feedback: null,
          teacherPdfUrl: null,
          gradedAt: null,
        })
      }
      // 3. Otherwise, it's a brand new submission (POST)
      else {
        await api.post("/submissions", {
          assignmentId,
          studentId: user.id,
          status: "submitted",
          studentPdfUrl,
          submittedAt: new Date().toISOString().split("T")[0],
          teacherPdfUrl: null,
          gradedAt: null,
          grade: null,
          feedback: null,
        })
      }

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
