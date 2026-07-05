import { useCallback, useEffect, useState } from 'react'
import {
  deleteWish,
  listGraduates,
  setGraduateFeatured,
  toFirebaseError,
} from '@/services/firebase'
import type { FirebaseErrorResponse } from '@/types'
import type { GraduateListItem } from '@/services/repositories/graduate.repository'

interface AdminState {
  graduates: GraduateListItem[]
  loading: boolean
  error: FirebaseErrorResponse | null
  refresh: () => Promise<void>
  removeWish: (graduateId: string, wishId: string) => Promise<void>
  toggleFeatured: (graduateId: string, featured: boolean) => Promise<void>
}

export function useAdmin(): AdminState {
  const [graduates, setGraduates] = useState<GraduateListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirebaseErrorResponse | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const list = await listGraduates()
      setGraduates(list)
      setError(null)
    } catch (err) {
      setError(toFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const removeWish = useCallback(async (graduateId: string, wishId: string) => {
    await deleteWish(graduateId, wishId)
  }, [])

  const toggleFeatured = useCallback(async (graduateId: string, featured: boolean) => {
    await setGraduateFeatured(graduateId, featured)
    setGraduates((prev) =>
      prev.map((g) =>
        g.id === graduateId ? { ...g, doc: { ...g.doc, isFeatured: featured } } : g,
      ),
    )
  }, [])

  return { graduates, loading, error, refresh, removeWish, toggleFeatured }
}
