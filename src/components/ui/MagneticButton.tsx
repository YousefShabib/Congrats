import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMagneticButton } from '@/hooks/useMagneticButton'
import { cn } from '@/utils/cn'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void | Promise<void>
  className?: string
  strength?: number
  disabled?: boolean
  type?: 'button' | 'submit'
  title?: string
}

export function MagneticButton({
  children,
  onClick,
  className,
  strength = 0.18,
  disabled,
  type = 'button',
  title,
}: MagneticButtonProps) {
  const magnetic = useMagneticButton(strength)

  return (
    <motion.button
      type={type}
      title={title}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full',
        className,
      )}
      style={{ x: magnetic.x, y: magnetic.y }}
      onMouseMove={magnetic.handleMouseMove}
      onMouseLeave={magnetic.handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </motion.button>
  )
}
