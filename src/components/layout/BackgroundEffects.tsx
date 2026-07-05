import { motion, useTransform, type MotionValue } from 'framer-motion'
import { memo, useMemo } from 'react'
import { useSmoothParallax } from '@/hooks/useSmoothParallax'

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1.5,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}))

function FloatingOrb({
  x,
  y,
  factor,
  className,
  duration,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  factor: number
  className: string
  duration: number
}) {
  const ox = useTransform(x, (v) => v * factor)
  const oy = useTransform(y, (v) => v * factor)

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ x: ox, y: oy }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export const BackgroundEffects = memo(function BackgroundEffects() {
  const { x, y } = useSmoothParallax(0.012)

  const orbs = useMemo(
    () => [
      { className: 'left-[-10%] top-[-10%] h-[420px] w-[420px] bg-luxury-gold/12', factor: 2.2, duration: 10 },
      { className: 'bottom-[-15%] right-[-10%] h-[520px] w-[520px] bg-luxury-gold-light/14', factor: -1.8, duration: 12 },
      { className: 'left-[40%] top-[20%] h-[280px] w-[280px] bg-white/50', factor: 2.8, duration: 8 },
      { className: 'right-[20%] top-[60%] h-[200px] w-[200px] bg-champagne/80', factor: -2.2, duration: 14 },
    ],
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="gradient-mesh absolute inset-0" />

      {orbs.map((orb, i) => (
        <FloatingOrb key={i} x={x} y={y} {...orb} />
      ))}

      <div className="noise-overlay absolute inset-0 opacity-[0.035]" />

      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-luxury-gold/25"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #c9a962 0.5px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
})
