import Sidebar from "@/components/Sidebar"
import Dashboard from "@/components/Dashboard"

export function App() {
  return (
    <div className="flex p-2">
      <div className="h-screen basis-1/4">
        <Sidebar />
      </div>
      <div className="h-screen basis-3/4">
        <Dashboard />
      </div>
    </div>
  )
}

export default App
