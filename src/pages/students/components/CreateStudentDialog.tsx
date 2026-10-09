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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, UserPlus } from "lucide-react"
import type { Class, Batch } from "@/types"

interface CreateStudentDialogProps {
  onCreate: (data: {
    name: string
    email: string
    classId: string
    batchId?: string | null
  }) => Promise<void>
  classes: Class[]
  batches: Batch[]
}

export function CreateStudentDialog({
  onCreate,
  classes,
  batches,
}: CreateStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [className, setClassName] = useState("")
  const [batchName, setBatchName] = useState("none")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedClass = classes.find((c) => c.name === className)
  const filteredBatches = batches.filter((b) => b.classId === selectedClass?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass) {
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

      await onCreate({
        name,
        email,
        classId: selectedClass.id,
        batchId,
      })
      setName("")
      setEmail("")
      setClassName("")
      setBatchName("none")
      setOpen(false)
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
          <Button className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Register a new student to your tuition center.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g., Aarav Reddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., aarav@email.com"
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
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Student
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
