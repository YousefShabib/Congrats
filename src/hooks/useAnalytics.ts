import { useCallback, useEffect, useState } from 'react'
import {
  computeAnalyticsFromWishes,
  getAnalytics,
  upsertAnalytics,
  toFirebaseError,
} from '@/services/firebase'
import { useDashboard } from '@/hooks/useDashboard'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import type { AnalyticsSummary, FirebaseErrorResponse } from '@/types'

interface AnalyticsState {
  summary: AnalyticsSummary
  loading: boolean
  error: FirebaseErrorResponse | null
  syncFromLiveData: () => Promise<void>
}

export function useAnalytics(): AnalyticsState {
  const { graduateId } = useDashboard()
  const { congratulations, stats } = useGraduationPage(graduateId)
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    mostActiveDay: '—',
    mostSharedPlatform: '—',
    averageWishesPerDay: 0,
    imagesUploaded: 0,
    shareCounts: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirebaseErrorResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAnalytics(graduateId)
      .then((data) => {
        if (!cancelled) {
          setSummary(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(toFirebaseError(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [graduateId])

  const syncFromLiveData = useCallback(async () => {
    const computed = computeAnalyticsFromWishes(
      congratulations.length,
      stats.photosShared,
      stats.totalVisitors,
    )
    await upsertAnalytics(graduateId, computed)
    setSummary((prev) => ({ ...prev, ...computed }))
  }, [graduateId, congratulations.length, stats.photosShared, stats.totalVisitors])

  return { summary, loading, error, syncFromLiveData }
}
