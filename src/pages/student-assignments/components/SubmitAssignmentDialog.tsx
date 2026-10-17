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
import { Upload } from "lucide-react"
import type { StudentAssignment } from "../hooks/useStudentAssignments"

interface SubmitAssignmentDialogProps {
  assignment: StudentAssignment
  submissionId?: string
  onSubmit: (assignmentId: string, studentPdfUrl: string) => Promise<void>
  isResubmit?: boolean
}

export function SubmitAssignmentDialog({
  assignment,
  submissionId,
  onSubmit,
  isResubmit,
}: SubmitAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pdfUrl.trim()) {
      setError("Please enter a PDF URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit(assignment.id, pdfUrl, submissionId)
      setPdfUrl("")
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Submit
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isResubmit ? "Resubmit Assignment" : "Submit Assignment"}
            </DialogTitle>
            <DialogDescription>
              {isResubmit
                ? "Your teacher has asked for revisions. Please upload your updated work"
                : `Submit your work for "${assignment.title}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pdfUrl">Your PDF URL</Label>
              <Input
                id="pdfUrl"
                placeholder="e.g., my-submission.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL to your completed assignment PDF
              </p>
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
              {loading ? "Submitting..." : "Submit Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
