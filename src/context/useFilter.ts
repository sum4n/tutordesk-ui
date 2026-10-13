import { createContext, useContext } from "react"

interface FilterState {
  classId: string | null
  batchId: string | null
  subjectId: string | null
}

interface FilterContextType {
  filters: FilterState
  setClassId: (id: string | null) => void
  setBatchId: (id: string | null) => void
  setSubjectId: (id: string | null) => void
  clearFilters: () => void
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
)

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider")
  }
  return context
}
