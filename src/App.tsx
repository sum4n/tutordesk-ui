import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { DashboardPage } from "@/pages/DashboardPage"
import { ClassesPage } from "@/pages/ClassesPage"
import { pageMeta } from "@/config/appConfig"
import type { PageKey } from "@/types"

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard")
  const meta = pageMeta[page]

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar current={page} onChange={setPage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        <main className="flex-1 overflow-auto">
          {page === "dashboard" && <DashboardPage />}
          {page === "classes" && <ClassesPage />}
        </main>
      </div>
    </div>
  )
}
