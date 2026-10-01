import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Pencil } from "lucide-react"
import type { Assignment, Class, Batch, Subject, ClassSubject } from "@/types"

interface EditAssignmentDialogProps {
  assignment: Assignment
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  classSubjects: ClassSubject[]
}

export function EditAssignmentDialog({
  assignment,
  updateAssignment,
  classes,
  batches,
  subjects,
  classSubjects,
}: EditAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(assignment.title)
  const [description, setDescription] = useState(assignment.description || "")
  const [pdfUrl, setPdfUrl] = useState(assignment.pdfUrl)
  const [dueDate, setDueDate] = useState(assignment.dueDate)

  // Get names from IDs for display
  const initialClass = classes.find((c) => c.id === assignment.classId)
  const initialBatch = batches.find((b) => b.id === assignment.batchId)
  const initialSubject = subjects.find((s) => s.id === assignment.subjectId)

  const [className, setClassName] = useState(initialClass?.name || "")
  const [batchName, setBatchName] = useState(initialBatch?.name || "none")
  const [subjectName, setSubjectName] = useState(initialSubject?.name || "")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find the selected class object by name
  const selectedClass = classes.find((c) => c.name === className)
  const selectedClassId = selectedClass?.id || ""

  // Filter batches by selected class
  const filteredBatches = batches.filter((b) => b.classId === selectedClassId)

  // Filter subjects by selected class
  const filteredSubjects = subjects.filter((s) =>
    classSubjects.some(
      (cs) => cs.classId === selectedClassId && cs.subjectId === s.id
    )
  )

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Convert names back to IDs for the API
    const classId = classes.find((c) => c.name === className)?.id
    const batchId = batches.find((b) => b.name === batchName)?.id || null
    const subjectId = subjects.find((s) => s.name === subjectName)?.id

    if (!classId || !subjectId) {
      setError("Please select a class and subject")
      setLoading(false)
      return
    }

    try {
      await updateAssignment(assignment.id, {
        title,
        description,
        pdfUrl,
        classId,
        batchId,
        subjectId,
        dueDate,
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update the assignment details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={className}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setClassName(value)
                      setBatchName("none")
                      setSubjectName("")
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
                <Label htmlFor="batch">Batch (Optional)</Label>
                <Select
                  value={batchName}
                  onValueChange={(value) => {
                    if (value !== null) setBatchName(value)
                  }}
                  disabled={!className || filteredBatches.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No batch</SelectItem>
                    {filteredBatches.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={subjectName}
                  onValueChange={(value) => {
                    if (value !== null) setSubjectName(value)
                  }}
                  disabled={!className || filteredSubjects.length === 0}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {loading ? "Updating..." : "Update Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
