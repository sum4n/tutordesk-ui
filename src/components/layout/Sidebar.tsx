import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { navItems } from "@/config/appConfig"
import type { PageKey } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  EllipsisVertical,
  LayoutDashboard,
} from "lucide-react"

interface SidebarProps {
  current: PageKey
  onChange: (page: PageKey) => void
}

export function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <aside className="flex w-60 flex-col border-r bg-background">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          T
        </div>
        <div>
          <div className="text-sm font-semibold">TutorDesk</div>
          <div className="text-xs text-muted-foreground">Teacher Dashboard</div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 py-3">
        <div className="space-y-6 px-4">
          <div>
            <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Overview
            </div>
            <nav className="space-y-1">
              <Button
                variant={current === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => onChange("dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </nav>
          </div>

          <div>
            <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Manage
            </div>
            <nav className="space-y-1">
              {navItems.slice(1).map((item) => {
                return (
                  <Button
                    key={item.key}
                    variant={current === item.key ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => onChange(item.key)}
                  >
                    <item.Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="w-full justify-start pt-6 pb-6"
              >
                <div className="flex w-full content-center gap-2">
                  <Avatar className="self-center">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="truncate font-medium">User name</p>
                    <p className="truncate text-xs text-muted-foreground">
                      User email
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto self-center" />
                </div>
              </Button>
            }
          />

          <DropdownMenuContent side="right" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
