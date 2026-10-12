import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

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

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    classId: null,
    batchId: null,
    subjectId: null,
  })

  const setClassId = (id: string | null) => {
    setFilters((prev) => ({ ...prev, classId: id, batchId: null }))
  }

  const setBatchId = (id: string | null) => {
    setFilters((prev) => ({ ...prev, batchId: id }))
  }

  const setSubjectId = (id: string | null) => {
    setFilters((prev) => ({ ...prev, subjectId: id }))
  }

  const clearFilters = () => {
    setFilters({ classId: null, batchId: null, subjectId: null })
  }

  return (
    <FilterContext.Provider
      value={{ filters, setClassId, setBatchId, setSubjectId, clearFilters }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider")
  }
  return context
}
