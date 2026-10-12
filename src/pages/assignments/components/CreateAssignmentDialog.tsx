import { useState, useEffect } from "react"
import { useFilter } from "@/context/FilterContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Class, Batch, Subject } from "@/types"

interface CreateAssignmentDialogProps {
  onAssignmentCreated: () => void
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
}

export function CreateAssignmentDialog({
  onAssignmentCreated,
  classes,
  batches,
  subjects,
}: CreateAssignmentDialogProps) {
  const { filters } = useFilter()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [className, setClassName] = useState("")
  const [batchName, setBatchName] = useState("none")
  const [subjectName, setSubjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill from context when dialog opens
  useEffect(() => {
    if (open) {
      if (filters.classId) {
        const selectedClass = classes.find((c) => c.id === filters.classId)
        if (selectedClass) setClassName(selectedClass.name)
      }
      if (filters.batchId) {
        const selectedBatch = batches.find((b) => b.id === filters.batchId)
        if (selectedBatch) setBatchName(selectedBatch.name)
      }
      if (filters.subjectId) {
        const selectedSubject = subjects.find((s) => s.id === filters.subjectId)
        if (selectedSubject) setSubjectName(selectedSubject.name)
      }
    }
  }, [open, filters, classes, batches, subjects])

  const selectedClass = classes.find((c) => c.name === className)
  const filteredBatches = batches.filter((b) => b.classId === selectedClass?.id)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedClass) {
      setError("Please select a class")
      return
    }

    const selectedSubject = subjects.find((s) => s.name === subjectName)
    if (!selectedSubject) {
      setError("Please select a subject")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const batchId =
        batchName === "none"
          ? null
          : batches.find((b) => b.name === batchName)?.id || null

      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          pdfUrl,
          classId: selectedClass.id,
          batchId,
          subjectId: selectedSubject.id,
          dueDate,
          createdAt: new Date().toISOString().split("T")[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create assignment")
      }

      setTitle("")
      setDescription("")
      setPdfUrl("")
      setDueDate("")
      setClassName("")
      setBatchName("none")
      setSubjectName("")
      setOpen(false)
      onAssignmentCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Upload a PDF assignment for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Chapter 4 Problems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Assignment instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                placeholder="e.g., assignment.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class</Label>
                <Select
                  value={className}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setClassName(value)
                      setBatchName("none")
                    }
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Batch (Optional)</Label>
                <Select
                  value={batchName}
                  onValueChange={(value) => {
                    if (value !== null) setBatchName(value)
                  }}
                  disabled={!className || filteredBatches.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All batches</SelectItem>
                    {filteredBatches.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Subject</Label>
              <Select
                value={subjectName}
                onValueChange={(value) => {
                  if (value !== null) setSubjectName(value)
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
