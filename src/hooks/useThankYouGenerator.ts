import { useCallback, useState } from 'react'
import type { Congratulation } from '@/types'
import type { ThankYouTone } from '@/types/ai'
import { generateThankYou } from '@/services/ai/ai.service'

export function useThankYouGenerator(
  graduateId: string,
  graduateName: string,
  wishes: Congratulation[],
) {
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState<ThankYouTone>('emotional')
  const [loading, setLoading] = useState(false)

  const generate = useCallback(
    async (selectedTone: ThankYouTone = tone) => {
      setLoading(true)
      try {
        const result = await generateThankYou(graduateId, graduateName, wishes, selectedTone)
        setMessage(result)
        setTone(selectedTone)
      } finally {
        setLoading(false)
      }
    },
    [graduateId, graduateName, wishes, tone],
  )

  const copy = useCallback(async () => {
    if (!message) return
    await navigator.clipboard.writeText(message)
  }, [message])

  return { message, tone, setTone, loading, generate, copy }
}
