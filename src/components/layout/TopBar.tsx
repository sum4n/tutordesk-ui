import { Button } from "@/components/ui/button"
import { Bell, Plus } from "lucide-react"

interface TopBarProps {
  title: string
  subtitle: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg leading-tight font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          Notifications
        </Button>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New Assignment
        </Button>
      </div>
    </header>
  )
}
