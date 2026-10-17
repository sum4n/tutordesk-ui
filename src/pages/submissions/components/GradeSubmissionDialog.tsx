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
import { Badge } from "@/components/ui/badge"
import { Pencil, FileText, ExternalLink } from "lucide-react"
import type { EnrichedSubmission } from "../hooks/useFilteredSubmissions"

interface GradeSubmissionDialogProps {
  submission: EnrichedSubmission
  onGrade: (
    id: string,
    data: {
      grade?: string | null
      feedback?: string | null
      teacherPdfUrl?: string | null
      status?: "submitted" | "graded" | "returned"
    }
  ) => Promise<void>
}

export function GradeSubmissionDialog({
  submission,
  onGrade,
}: GradeSubmissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [grade, setGrade] = useState(submission.submission.grade || "")
  const [feedback, setFeedback] = useState(submission.submission.feedback || "")
  const [teacherPdfUrl, setTeacherPdfUrl] = useState(
    submission.submission.teacherPdfUrl || ""
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Only mark as graded if at least one grading field has a value
      const hasGradingData = grade || feedback || teacherPdfUrl
      const newStatus = hasGradingData ? "graded" : "submitted"

      await onGrade(submission.submission.id, {
        grade: grade || null,
        feedback: feedback || null,
        teacherPdfUrl: teacherPdfUrl || null,
        status: newStatus, // ← Dynamic based on whether grading data exists
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
        Review
      </Button>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Grade this submission and provide feedback to the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Submission Info */}
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{submission.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.studentEmail}
                  </p>
                </div>
                <Badge
                  variant={
                    submission.submission.status === "graded"
                      ? "default"
                      : "outline"
                  }
                >
                  {submission.submission.status}
                </Badge>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Assignment</p>
                <p className="font-medium">{submission.assignmentTitle}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Class</p>
                <p className="font-medium">
                  {submission.batchName
                    ? `${submission.className} - ${submission.batchName}`
                    : submission.className}
                </p>
              </div>
              {submission.submission.studentPdfUrl && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Submitted PDF</p>
                  <a
                    href={submission.submission.studentPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View submission
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {submission.submission.submittedAt && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Submitted on</p>
                  <p className="font-medium">
                    {submission.submission.submittedAt}
                  </p>
                </div>
              )}
            </div>

            {/* Grading Form */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  placeholder="e.g., A, B+, 85/100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback to the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacherPdfUrl">Graded PDF URL (Optional)</Label>
                <Input
                  id="teacherPdfUrl"
                  placeholder="e.g., graded-submission.pdf"
                  value={teacherPdfUrl}
                  onChange={(e) => setTeacherPdfUrl(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {/* Show "Return for Revision" if it's submitted OR already graded */}
            {(submission.submission.status === "submitted" ||
              submission.submission.status === "graded") && (
              <Button
                type="button"
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 sm:order-1"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await onGrade(submission.submission.id, {
                      status: "returned",
                      // If the teacher typed feedback before clicking return, save it!
                      feedback:
                        feedback || submission.submission.feedback || null,
                    })
                    setOpen(false)
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "An error occurred"
                    )
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                Return for Revision
              </Button>
            )}

            <div className="flex gap-2 sm:order-2 sm:ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Grade"}
              </Button>
            </div>
          </DialogFooter>{" "}
        </form>
      </DialogContent>
    </Dialog>
  )
}
