import { useMemo } from "react"
import type { Student } from "@/types"

const ALL_CLASSES = "All Classes"

interface UseFilteredStudentsProps {
  students: Student[]
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
    return students.filter((student) => student.class === selectedClass)
  }, [students, selectedClass])

  const searchedStudents = useMemo(() => {
    if (searchQuery.length === 0) {
      return filteredStudents
    }
    const query = searchQuery.toLowerCase()
    return filteredStudents.filter((student) => {
      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      )
    })
  }, [filteredStudents, searchQuery])

  return { searchedStudents }
}
