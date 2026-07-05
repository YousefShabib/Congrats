import { useEffect, useRef, useState } from 'react'
import { CELEBRATION_MILESTONES } from '@/utils/share'

interface CelebrationState {
  milestone: number | null
  dismiss: () => void
}

export function useCelebrationMilestones(wishCount: number): CelebrationState {
  const [milestone, setMilestone] = useState<number | null>(null)
  const celebrated = useRef<Set<number>>(new Set())

  useEffect(() => {
    for (const m of CELEBRATION_MILESTONES) {
      if (wishCount >= m && !celebrated.current.has(m)) {
        celebrated.current.add(m)
        setMilestone(m)
        break
      }
    }
  }, [wishCount])

  const dismiss = () => setMilestone(null)

  return { milestone, dismiss }
}
