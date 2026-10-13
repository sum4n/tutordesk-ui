import { useEffect, useState, useCallback } from "react"
import type { Batch } from "@/types"

interface BatchesData {
  batches: Batch[]
  loading: boolean
  error: string | null
  refresh: () => void
  createBatch: (data: {
    name: string
    classId: string
    schedule?: string
  }) => Promise<void>
  updateBatch: (
    id: string,
    data: { name: string; schedule?: string }
  ) => Promise<void>
  deleteBatch: (id: string) => Promise<void>
}

export function useBatches(classId: string): BatchesData {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/batches?classId=${classId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch batches")
      }

      const data: Batch[] = await response.json()
      setBatches(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [classId])

  const createBatch = useCallback(
    async (data: { name: string; classId: string; schedule?: string }) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create batch")
      }

      await fetchBatches()
    },
    [fetchBatches]
  )

  const updateBatch = useCallback(
    async (id: string, data: { name: string; schedule?: string }) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/batches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update batch")
      }

      await fetchBatches()
    },
    [fetchBatches]
  )

  const deleteBatch = useCallback(
    async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${apiUrl}/batches/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete batch")
      }

      await fetchBatches()
    },
    [fetchBatches]
  )

  useEffect(() => {
    if (classId) {
      fetchBatches()
    }
  }, [classId, fetchBatches])

  return {
    batches,
    loading,
    error,
    refresh: fetchBatches,
    createBatch,
    updateBatch,
    deleteBatch,
  }
}
