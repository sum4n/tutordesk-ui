import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Layers } from "lucide-react"
import { useBatches } from "../hooks/useBatches"
import type { Batch } from "@/types"

interface ManageBatchesDialogProps {
  classId: string
  className: string
  onBatchesChanged: () => void
}

export function ManageBatchesDialog({
  classId,
  className,
  onBatchesChanged,
}: ManageBatchesDialogProps) {
  const [open, setOpen] = useState(false)
  const { batches, loading, error, createBatch, updateBatch, deleteBatch } =
    useBatches(classId)

  const handleCreate = async (data: { name: string; schedule?: string }) => {
    await createBatch({ ...data, classId })
    onBatchesChanged() // ← Sync parent
  }

  const handleUpdate = async (
    id: string,
    data: { name: string; schedule?: string }
  ) => {
    await updateBatch(id, data)
    onBatchesChanged() // ← Sync parent
  }

  const handleDelete = async (id: string) => {
    await deleteBatch(id)
    onBatchesChanged() // ← Sync parent
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="mb-2 gap-1.5"
      >
        <Layers className="h-3.5 w-3.5" />
        Manage Batches
      </Button>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Batches</DialogTitle>
          <DialogDescription>
            Add, edit, or delete batches for {className}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <CreateBatchForm onCreate={handleCreate} />

          {loading && (
            <p className="text-sm text-muted-foreground">Loading batches...</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            {batches.map((batch) => (
              <BatchItem
                key={batch.id}
                batch={batch}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {batches.length === 0 && !loading && (
              <p className="rounded border py-6 text-center text-sm text-muted-foreground">
                No batches yet. Create one above.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CreateBatchForm({
  onCreate,
}: {
  onCreate: (data: { name: string; schedule?: string }) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [schedule, setSchedule] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)
    try {
      await onCreate({ name, schedule: schedule || undefined })
      setName("")
      setSchedule("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create batch")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-4">
      <div className="grid gap-2">
        <Label htmlFor="batch-name">Batch Name</Label>
        <Input
          id="batch-name"
          placeholder="e.g., Batch A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="batch-schedule">Schedule (Optional)</Label>
        <Input
          id="batch-schedule"
          placeholder="e.g., Mon/Wed/Fri 4-6 PM"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="sm" disabled={loading} className="w-full">
        {loading ? (
          "Adding..."
        ) : (
          <>
            <Plus className="mr-1 h-4 w-4" /> Add Batch
          </>
        )}
      </Button>
    </form>
  )
}

function BatchItem({
  batch,
  onUpdate,
  onDelete,
}: {
  batch: Batch
  onUpdate: (
    id: string,
    data: { name: string; schedule?: string }
  ) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(batch.name)
  const [schedule, setSchedule] = useState(batch.schedule || "")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onUpdate(batch.id, { name, schedule: schedule || undefined })
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update batch")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)
    try {
      await onDelete(batch.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete batch")
    } finally {
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="space-y-3 rounded-md border p-4">
        <div className="grid gap-2">
          <Label>Batch Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Schedule</Label>
          <Input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border p-4">
      <div>
        <p className="font-medium">{batch.name}</p>
        {batch.schedule && (
          <p className="text-sm text-muted-foreground">{batch.schedule}</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
