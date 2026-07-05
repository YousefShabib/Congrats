import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

export function useSmoothParallax(intensity = 0.035) {
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const x = useSpring(targetX, { stiffness: 45, damping: 22, mass: 0.9 })
  const y = useSpring(targetY, { stiffness: 45, damping: 22, mass: 0.9 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetX.set((e.clientX - window.innerWidth / 2) * intensity)
      targetY.set((e.clientY - window.innerHeight / 2) * intensity)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [intensity, targetX, targetY])

  return { x, y }
}
