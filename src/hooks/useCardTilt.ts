import { useMotionValue, useSpring } from 'framer-motion'
import type { MouseEvent } from 'react'

export function useCardTilt(intensity = 8) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 260, damping: 24 })
  const springY = useSpring(rotateY, { stiffness: 260, damping: 24 })

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * intensity)
    rotateX.set(-py * intensity)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { rotateX: springX, rotateY: springY, handleMouseMove, handleMouseLeave }
}
