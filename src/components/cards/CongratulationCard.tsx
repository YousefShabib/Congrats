import { motion } from 'framer-motion'
import { memo } from 'react'
import { WishCardContent } from '@/components/cards/WishCardContent'
import { useCardTilt } from '@/hooks/useCardTilt'
import type { Congratulation } from '@/types'
import { cn } from '@/utils/cn'

interface CongratulationCardProps {
  congratulation: Congratulation
  isFocused?: boolean
  isHovered?: boolean
  isHighlighted?: boolean
  onClick?: () => void
  onHoverStart?: () => void
  onHoverEnd?: () => void
  className?: string
  style?: React.CSSProperties
}

export const CongratulationCard = memo(function CongratulationCard({
  congratulation,
  isFocused = false,
  isHovered = false,
  isHighlighted = false,
  onClick,
  onHoverStart,
  onHoverEnd,
  className,
  style,
}: CongratulationCardProps) {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt(10)
  const hasImage = Boolean(congratulation.avatar)

  const handleLeave = () => {
    handleMouseLeave()
    onHoverEnd?.()
  }

  return (
    <motion.div
      className={cn('cursor-pointer select-none', isFocused && 'z-50', className)}
      style={{ ...style, perspective: 900 }}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      whileTap={!isFocused ? { scale: 0.97 } : undefined}
    >
      <motion.div
        className={cn(
          'relative rounded-2xl border p-4 backdrop-blur-xl',
          hasImage ? 'w-64 sm:w-72' : 'w-52 sm:w-56',
          congratulation.isPinned || isHighlighted
            ? 'border-luxury-gold bg-white/90 shadow-glow ring-1 ring-luxury-gold/40'
            : isFocused
              ? 'border-luxury-gold/50 bg-white/90 shadow-2xl shadow-luxury-gold/20'
              : 'border-luxury-gold/25 bg-white/70 gold-border-glow',
          isHovered && !isFocused && !congratulation.isPinned && 'shadow-glow ring-1 ring-luxury-gold/20',
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          boxShadow: isHovered && !isFocused
            ? '0 0 48px -8px rgba(201, 169, 98, 0.35), 0 8px 32px -4px rgba(201, 169, 98, 0.15)'
            : undefined,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        <WishCardContent wish={congratulation} imageSize="orbit" messagePreview={hasImage ? 120 : 60} />
        <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />
      </motion.div>
    </motion.div>
  )
})
