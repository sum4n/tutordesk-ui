import { useFilter } from "@/context/FilterContext"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Class, Batch, Subject } from "@/types"

interface FilterBarProps {
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
}

export function FilterBar({ classes, batches, subjects }: FilterBarProps) {
  const { filters, setClassId, setBatchId, setSubjectId, clearFilters } =
    useFilter()

  const availableBatches = filters.classId
    ? batches.filter((b) => b.classId === filters.classId)
    : batches

  const hasActiveFilters =
    filters.classId || filters.batchId || filters.subjectId

  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.classId || "all"}
        onValueChange={(value) => {
          if (value !== null) setClassId(value === "all" ? null : value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Classes">
            {filters.classId
              ? classes.find((c) => c.id === filters.classId)?.name
              : "All Classes"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.batchId || "all"}
        onValueChange={(value) => {
          if (value !== null) setBatchId(value === "all" ? null : value)
        }}
        disabled={!filters.classId}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Batches">
            {filters.batchId
              ? batches.find((b) => b.id === filters.batchId)?.name
              : "All Batches"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Batches</SelectItem>
          {availableBatches.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.subjectId || "all"}
        onValueChange={(value) => {
          if (value !== null) setSubjectId(value === "all" ? null : value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Subjects">
            {filters.subjectId
              ? subjects.find((s) => s.id === filters.subjectId)?.name
              : "All Subjects"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
