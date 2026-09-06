import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  FileText,
  CirclePlus,
  GraduationCap,
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  EllipsisVertical,
} from "lucide-react"

function Sidebar() {
  return (
    <aside className="flex h-full flex-col border-r-2 p-2">
      <header>
        <div className="flex h-16 items-center font-bold">
          <GraduationCap /> <p className="ml-2">TutorDesk</p>
        </div>
      </header>
      <Button className="w-full justify-start">
        <CirclePlus />
        Create Assignment
      </Button>
      <nav>
        <ul>
          <li>
            <Button className="w-full justify-start" variant="ghost">
              <LayoutDashboard />
              Dashboard
            </Button>
          </li>
          <li>
            <Button className="w-full justify-start" variant="ghost">
              <Users />
              Batches
            </Button>
          </li>
          <li>
            <Button className="w-full justify-start" variant="ghost">
              <UserRoundCheck />
              Students
            </Button>
          </li>
          <li>
            <Button className="w-full justify-start" variant="ghost">
              <FileText />
              Assignments
            </Button>
          </li>
        </ul>
      </nav>
      <footer className="mt-auto">
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
      </footer>
    </aside>
  )
}

export default Sidebar
