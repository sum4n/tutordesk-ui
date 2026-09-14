import { useEffect, useState } from "react"
import type { ClassItem } from "@/types"

interface ClassData {
  classes: ClassItem[]
  loading: boolean
  error: string | null
}

export function useClasses(): ClassData {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClassData() {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        const classRes = await fetch(`${apiUrl}/classes`)

        if (!classRes.ok) {
          throw new Error("Failed to fetch class data")
        }

        const classesData: ClassItem[] = await classRes.json()

        setClasses(classesData)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchClassData()
  }, [])

  return { classes, loading, error }
}
