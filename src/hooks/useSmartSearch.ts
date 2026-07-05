import { useCallback, useState } from 'react'
import type { Congratulation } from '@/types'
import { smartSearch } from '@/services/ai/ai.service'

export function useSmartSearch(graduateId: string, wishes: Congratulation[]) {
  const [query, setQuery] = useState('')
  const [resultIds, setResultIds] = useState<string[]>([])
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)

  const search = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const result = await smartSearch(graduateId, query, wishes)
      setResultIds(result.wishIds)
      setExplanation(result.explanation)
    } finally {
      setLoading(false)
    }
  }, [graduateId, query, wishes])

  return { query, setQuery, resultIds, explanation, loading, search }
}
