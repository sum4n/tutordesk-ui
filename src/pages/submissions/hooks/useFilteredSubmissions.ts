import { useMemo } from "react"
import type { EnrichedSubmission } from "@/hooks/useSubmissions"

export const ALL_STATUSES = "All Statuses"
export const ALL_CLASSES = "All Classes"

interface UseFilteredSubmissionsProps {
  submissions: EnrichedSubmission[]
  selectedStatus: string
  selectedClass: string
  searchQuery: string
}

export function useFilteredSubmissions({
  submissions,
  selectedStatus,
  selectedClass,
  searchQuery,
}: UseFilteredSubmissionsProps) {
  // Filter by status
  const filteredByStatus = useMemo(() => {
    if (selectedStatus === ALL_STATUSES) return submissions
    return submissions.filter((s) => s.status === selectedStatus.toLowerCase())
  }, [submissions, selectedStatus])

  // Filter by class
  const filteredByClass = useMemo(() => {
    if (selectedClass === ALL_CLASSES) return filteredByStatus
    return filteredByStatus.filter((s) => s.className === selectedClass)
  }, [filteredByStatus, selectedClass])

  // Filter by search
  const filteredSubmissions = useMemo(() => {
    if (searchQuery.length === 0) return filteredByClass
    const query = searchQuery.toLowerCase()
    return filteredByClass.filter(
      (s) =>
        s.studentName.toLowerCase().includes(query) ||
        s.assignmentTitle.toLowerCase().includes(query)
    )
  }, [filteredByClass, searchQuery])

  return { filteredSubmissions }
}
