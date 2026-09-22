import { useMemo } from "react"
import type { Student } from "@/types"

export const ALL_CLASSES = "All Classes"

interface StudentDetails {
  student: Student
  className: string
  batchName: string | null
  assignmentCount: number
  pendingCount: number
}

interface UseFilteredStudentsProps {
  students: StudentDetails[]
  selectedClass: string
  searchQuery: string
}

export function useFilteredStudents({
  students,
  selectedClass,
  searchQuery,
}: UseFilteredStudentsProps) {
  const filteredStudents = useMemo(() => {
    if (selectedClass === ALL_CLASSES) {
      return students
    }
    return students.filter((s) => s.student.classId === selectedClass)
  }, [students, selectedClass])

  const searchedStudents = useMemo(() => {
    if (searchQuery.length === 0) {
      return filteredStudents
    }
    const query = searchQuery.toLowerCase()
    return filteredStudents.filter((s) => {
      return (
        s.student.name.toLowerCase().includes(query) ||
        s.student.email.toLowerCase().includes(query)
      )
    })
  }, [filteredStudents, searchQuery])

  return { searchedStudents }
}
