import { useAnimationFrame, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'

const AUTO_ROTATION = 0.000022

export function useOrbitPhysics(radius = 280) {
  const rotation = useMotionValue(0)
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const parallaxX = useSpring(targetX, { stiffness: 38, damping: 20, mass: 1.1 })
  const parallaxY = useSpring(targetY, { stiffness: 38, damping: 20, mass: 1.1 })

  useAnimationFrame((_, delta) => {
    rotation.set(rotation.get() + delta * AUTO_ROTATION)
  })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetX.set((e.clientX - window.innerWidth / 2) * 0.045)
      targetY.set((e.clientY - window.innerHeight / 2) * 0.035)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [targetX, targetY])

  return { rotation, parallaxX, parallaxY, radius }
}
