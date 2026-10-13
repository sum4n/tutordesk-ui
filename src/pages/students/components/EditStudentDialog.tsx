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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil } from "lucide-react"
import type { Student, Class, Batch } from "@/types"

interface EditStudentDialogProps {
  student: Student
  onUpdate: (
    id: string,
    data: {
      name?: string
      email?: string
      classId?: string
      batchId?: string | null
    }
  ) => Promise<void>
  classes: Class[]
  batches: Batch[]
}

export function EditStudentDialog({
  student,
  onUpdate,
  classes,
  batches,
}: EditStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(student.name)
  const [email, setEmail] = useState(student.email)

  const initialClass = classes.find((c) => c.id === student.classId)
  const initialBatch = batches.find((b) => b.id === student.batchId)

  const [className, setClassName] = useState(initialClass?.name || "")
  const [batchName, setBatchName] = useState(initialBatch?.name || "none")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedClass = classes.find((c) => c.name === className)
  const filteredBatches = batches.filter((b) => b.classId === selectedClass?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const classId = classes.find((c) => c.name === className)?.id
    if (!classId) {
      setError("Please select a class")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const batchId =
        batchName === "none"
          ? null
          : batches.find((b) => b.name === batchName)?.id || null

      await onUpdate(student.id, {
        name,
        email,
        classId,
        batchId,
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class</Label>
                <Select
                  value={className}
                  onValueChange={(value) => {
                    setClassName(value)
                    setBatchName("none")
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
                  onValueChange={setBatchName}
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
