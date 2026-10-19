import { useEffect, useState, useCallback } from "react"
import type { Student, Class, Batch, Assignment, Submission } from "@/types"

interface StudentsData {
  students: Student[]
  classes: Class[]
  batches: Batch[]
  assignments: Assignment[]
  submissions: Submission[]
  loading: boolean
  error: string | null
  refresh: () => void
  createStudent: (data: {
    name: string
    email: string
    classId: string
    batchId?: string | null
  }) => Promise<void>
  updateStudent: (
    id: string,
    data: {
      name?: string
      email?: string
      classId?: string
      batchId?: string | null
    }
  ) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
}

export function useStudents(): StudentsData {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const [
        studentsRes,
        classesRes,
        batchesRes,
        assignmentsRes,
        submissionsRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/users?role=student`),
        fetch(`${apiUrl}/classes`),
        fetch(`${apiUrl}/batches`),
        fetch(`${apiUrl}/assignments`),
        fetch(`${apiUrl}/submissions`),
      ])

      if (
        !studentsRes.ok ||
        !classesRes.ok ||
        !batchesRes.ok ||
        !assignmentsRes.ok ||
        !submissionsRes.ok
      ) {
        throw new Error("Failed to fetch student data")
      }

      const [
        studentsData,
        classesData,
        batchesData,
        assignmentsData,
        submissionsData,
      ] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
        batchesRes.json(),
        assignmentsRes.json(),
        submissionsRes.json(),
      ])

      setStudents(studentsData)
      setClasses(classesData)
      setBatches(batchesData)
      setAssignments(assignmentsData)
      setSubmissions(submissionsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  const createStudent = useCallback(
    async (data: {
      name: string
      email: string
      classId: string
      batchId?: string | null
    }) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/users?role=student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create student")
      }

      await fetchStudentData()
    },
    [fetchStudentData]
  )

  const updateStudent = useCallback(
    async (
      id: string,
      data: {
        name?: string
        email?: string
        classId?: string
        batchId?: string | null
      }
    ) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update student")
      }

      await fetchStudentData()
    },
    [fetchStudentData]
  )

  const deleteStudent = useCallback(
    async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

      await fetchStudentData()
    },
    [fetchStudentData]
  )

  useEffect(() => {
    fetchStudentData()
  }, [fetchStudentData])

  return {
    students,
    classes,
    batches,
    assignments,
    submissions,
    loading,
    error,
    refresh: fetchStudentData,
    createStudent,
    updateStudent,
    deleteStudent,
  }
}
