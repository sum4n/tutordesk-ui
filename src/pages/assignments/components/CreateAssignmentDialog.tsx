import { useState } from "react"
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
import type { Class, Batch, Subject, ClassSubject } from "@/types"

interface CreateAssignmentDialogProps {
  onAssignmentCreated: () => void
  classes: Class[]
  batches: Batch[]
  subjects: Subject[]
  classSubjects: ClassSubject[]
}

export function CreateAssignmentDialog({
  onAssignmentCreated,
  classes,
  batches,
  subjects,
  classSubjects,
}: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [className, setClassName] = useState("")
  const [batchName, setBatchName] = useState("none")
  const [subjectName, setSubjectName] = useState("")
  const [dueDate, setDueDate] = useState("")
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
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          pdfUrl,
          classId,
          batchId,
          subjectId,
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
      setClassName("")
      setBatchName("none")
      setSubjectName("")
      setDueDate("")
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
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Assignment
          </Button>
        }
      />
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Add a new assignment for your students.
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
                placeholder="https://example.com/assignment.pdf"
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
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
