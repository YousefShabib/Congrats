import { useCallback, useEffect, useState } from 'react'
import {
  getGraduateDoc,
  listenToGraduateDoc,
  updateGraduateProfile,
  toFirebaseError,
} from '@/services/firebase'
import { useAuth } from '@/providers/AuthProvider'
import type { FirebaseErrorResponse, GraduateDoc, GraduateInput } from '@/types'

interface DashboardState {
  graduateId: string
  doc: GraduateDoc | null
  loading: boolean
  error: FirebaseErrorResponse | null
  updateProfile: (updates: Partial<GraduateInput>) => Promise<void>
  refresh: () => Promise<void>
}

export function useDashboard(): DashboardState {
  const { graduateId } = useAuth()
  const [doc, setDoc] = useState<GraduateDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirebaseErrorResponse | null>(null)

  const refresh = useCallback(async () => {
    if (!graduateId) {
      setDoc(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await getGraduateDoc(graduateId)
      setDoc(data)
      setError(null)
    } catch (err) {
      setError(toFirebaseError(err))
    } finally {
      setLoading(false)
    }
  }, [graduateId])

  useEffect(() => {
    if (!graduateId) {
      setDoc(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const unsub = listenToGraduateDoc(
      graduateId,
      (data) => {
        setDoc(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsub
  }, [graduateId])

  const updateProfile = useCallback(
    async (updates: Partial<GraduateInput>) => {
      if (!graduateId) return
      setError(null)
      try {
        await updateGraduateProfile(graduateId, updates)
      } catch (err) {
        setError(toFirebaseError(err))
        throw err
      }
    },
    [graduateId],
  )

  return { graduateId: graduateId ?? '', doc, loading, error, updateProfile, refresh }
}
