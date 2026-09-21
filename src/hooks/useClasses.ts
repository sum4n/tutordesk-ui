import { useEffect, useState } from "react"
import type {
  Class,
  Student,
  Assignment,
  Batch,
  Subject,
  ClassSubject,
} from "@/types"

interface ClassDetails {
  class: Class
  studentCount: number
  assignmentCount: number
  batches: { id: string; name: string }[]
  subjects: { id: string; name: string }[]
}

interface ClassesData {
  classes: ClassDetails[]
  loading: boolean
  error: string | null
}

export function useClasses(): ClassesData {
  const [classes, setClasses] = useState<ClassDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClassData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const [
          classesRes,
          studentsRes,
          assignmentsRes,
          batchesRes,
          subjectsRes,
          classSubjectsRes,
        ] = await Promise.all([
          fetch(`${apiUrl}/classes`),
          fetch(`${apiUrl}/students`),
          fetch(`${apiUrl}/assignments`),
          fetch(`${apiUrl}/batches`),
          fetch(`${apiUrl}/subjects`),
          fetch(`${apiUrl}/classSubjects`),
        ])

        if (
          !classesRes.ok ||
          !studentsRes.ok ||
          !assignmentsRes.ok ||
          !batchesRes.ok ||
          !subjectsRes.ok ||
          !classSubjectsRes.ok
        ) {
          throw new Error("Failed to fetch data")
        }

        const classes: Class[] = await classesRes.json()
        const students: Student[] = await studentsRes.json()
        const assignments: Assignment[] = await assignmentsRes.json()
        const batches: Batch[] = await batchesRes.json()
        const subjects: Subject[] = await subjectsRes.json()
        const classSubjects: ClassSubject[] = await classSubjectsRes.json()

        const classesDetails: ClassDetails[] = classes.map((c) => {
          const studentCount = students.filter((s) => s.classId === c.id).length
          const assignmentCount = assignments.filter(
            (a) => a.classId === c.id
          ).length
          const filteredBatches = batches.filter((b) => b.classId === c.id)
          const filteredClassSubjects = classSubjects.filter(
            (cs) => cs.classId === c.id
          )
          const subjectIds = filteredClassSubjects.map((cs) => cs.subjectId)
          const filteredSubjects = subjects.filter((s) =>
            subjectIds.includes(s.id)
          )

          return {
            class: c,
            studentCount,
            assignmentCount,
            batches: filteredBatches,
            subjects: filteredSubjects,
          }
        })

        setClasses(classesDetails)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchClassData()
  }, [])

  return { classes, loading, error }
}
