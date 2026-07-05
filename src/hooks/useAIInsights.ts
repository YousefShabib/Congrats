import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Congratulation, Student } from '@/types'
import type { AIInsightsBundle } from '@/types/ai'
import { getAIInsights, computeWishesHash } from '@/services/ai/ai.service'
import { generateLocalInsights } from '@/services/ai/fallback.insights'

interface UseAIInsightsOptions {
  graduateId: string
  student: Student
  wishes: Congratulation[]
  enabled?: boolean
}

interface UseAIInsightsResult {
  insights: AIInsightsBundle | null
  loading: boolean
  error: string | null
  bestWishIds: Set<string>
  refresh: () => Promise<void>
}

export function useAIInsights({
  graduateId,
  student,
  wishes,
  enabled = true,
}: UseAIInsightsOptions): UseAIInsightsResult {
  const [insights, setInsights] = useState<AIInsightsBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wishesHash = useMemo(
    () =>
      computeWishesHash(
        wishes.map((w) => ({
          id: w.id,
          senderName: w.senderName,
          message: w.message,
          mood: w.mood,
        })),
      ),
    [wishes],
  )

  const load = useCallback(async () => {
    if (!enabled || !graduateId) return

    setLoading(true)
    setError(null)

    try {
      if (wishes.length === 0) {
        setInsights(generateLocalInsights([], student.name))
        return
      }

      const bundle = await getAIInsights(graduateId, student.name, wishes)
      setInsights(bundle)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI error')
      setInsights(generateLocalInsights(wishes, student.name))
    } finally {
      setLoading(false)
    }
  }, [enabled, graduateId, student.name, wishes])

  useEffect(() => {
    load()
  }, [graduateId, wishesHash, load])

  const bestWishIds = useMemo(
    () => new Set(insights?.bestWishes.map((w) => w.wishId) ?? []),
    [insights],
  )

  return { insights, loading, error, bestWishIds, refresh: load }
}
