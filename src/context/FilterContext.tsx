import { useState } from "react"
import type { ReactNode } from "react"
import { FilterContext } from "@/context/useFilter"

interface FilterState {
  classId: string | null
  batchId: string | null
  subjectId: string | null
}

interface FilterProviderProps {
  children: ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
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
