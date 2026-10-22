import { useEffect, useState, useCallback } from "react"
import type { Batch } from "@/types"
import { api } from "@/lib/api"

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
      const response = await api.get(`/batches?classId=${classId}`)

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
      await api.post("/batches", data)

      await fetchBatches()
    },
    [fetchBatches]
  )

  const updateBatch = useCallback(
    async (id: string, data: { name: string; schedule?: string }) => {
      await api.patch(`/batches/${id}`, data)

      await fetchBatches()
    },
    [fetchBatches]
  )

  const deleteBatch = useCallback(
    async (id: string) => {
      await api.delete(`/batches/${id}`)
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
