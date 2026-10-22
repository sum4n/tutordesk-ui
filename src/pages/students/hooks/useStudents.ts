import { useEffect, useState, useCallback } from "react"
import type { Student, Class, Batch, Assignment, Submission } from "@/types"
import { api } from "@/lib/api"

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
      const [
        studentsRes,
        classesRes,
        batchesRes,
        assignmentsRes,
        submissionsRes,
      ] = await Promise.all([
        api.get("/users?role=student"),
        api.get("/classes"),
        api.get("/batches"),
        api.get("/assignments"),
        api.get("/submissions"),
      ])

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
      // Inject role and default password
      const payload = {
        ...data,
        role: "student",
        password: "student",
      }

      await api.post("/users", payload)

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
      await api.patch(`/users/${id}`, data)

      await fetchStudentData()
    },
    [fetchStudentData]
  )

  const deleteStudent = useCallback(
    async (id: string) => {
      await api.delete(`/users/${id}`)

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
