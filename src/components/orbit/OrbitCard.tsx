import {
  motion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { memo } from 'react'
import { CongratulationCard } from '@/components/cards/CongratulationCard'
import type { Congratulation } from '@/types'

interface OrbitCardProps {
  congratulation: Congratulation
  index: number
  count: number
  radius: number
  rotation: MotionValue<number>
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  isHovered: boolean
  isNew: boolean
  isHighlighted?: boolean
  onSelect: (c: Congratulation) => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

export const OrbitCard = memo(function OrbitCard({
  congratulation,
  index,
  count,
  radius,
  rotation,
  parallaxX,
  parallaxY,
  isHovered,
  isNew,
  isHighlighted = false,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: OrbitCardProps) {
  const safeCount = Math.max(count, 1)
  const baseIndex = index

  const x = useTransform([rotation, parallaxX, parallaxY], ([r, px, _py]: number[]) => {
      const angle = (baseIndex / safeCount) * Math.PI * 2 + r
      const wobble = Math.sin(r * 0.35 + baseIndex * 0.7) * 8
      const dist = radius + wobble
      return Math.cos(angle) * dist + px
    })

  const y = useTransform([rotation, parallaxX, parallaxY], ([r, _px, py]: number[]) => {
      const angle = (baseIndex / safeCount) * Math.PI * 2 + r
      const wobble = Math.sin(r * 0.35 + baseIndex * 0.7) * 8
      const dist = radius + wobble
      return Math.sin(angle) * dist * 0.58 + py * 0.85
    })

  const depthScale = useTransform(rotation, (r) => {
    const angle = (baseIndex / safeCount) * Math.PI * 2 + r
    const depth = Math.sin(angle * 0.5 + baseIndex * 0.4) * 0.5 + 0.5
    return 0.84 + depth * 0.16
  })

  const zIndex = useTransform(rotation, (r) => {
    const angle = (baseIndex / safeCount) * Math.PI * 2 + r
    return Math.round(Math.sin(angle * 0.5 + baseIndex) * 8 + 12)
  })

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ x, y, scale: depthScale, zIndex }}
      initial={isNew ? { opacity: 0, filter: 'blur(8px)' } : false}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
      transition={{
        opacity: { duration: 0.5 },
        filter: { duration: 0.5 },
        scale: { type: 'spring', stiffness: 180, damping: 22 },
      }}
    >
      <CongratulationCard
        congratulation={congratulation}
        isHovered={isHovered}
        isHighlighted={isHighlighted}
        onClick={() => onSelect(congratulation)}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      />
    </motion.div>
  )
})
