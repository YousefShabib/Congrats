import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useAnimatedCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const countRef = useRef(0)
  const isInView = useInView(ref, { once: false, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return

    const from = countRef.current
    const startTime = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const next = Math.round(from + (target - from) * eased)
      setCount(next)
      countRef.current = next

      if (progress < 1) requestAnimationFrame(animate)
      else {
        setCount(target)
        countRef.current = target
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return { count, ref }
}
