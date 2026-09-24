export { cn } from "cn"

export function formatDate(dateString: string | null): string {
  if (!dateString) return "Not submitted"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getStatusVariant(
  status: "pending" | "submitted" | "graded"
): "default" | "secondary" | "outline" {
  switch (status) {
    case "graded":
      return "default"
    case "submitted":
      return "secondary"
    case "pending":
      return "outline"
  }
}
