import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { CongratulationCard } from '@/components/cards/CongratulationCard'
import { FocusedCard } from '@/components/cards/FocusedCard'
import { OrbitCard } from '@/components/orbit/OrbitCard'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useOrbitPhysics } from '@/hooks/useOrbitPhysics'
import type { Congratulation, Student } from '@/types'

interface OrbitSystemProps {
  congratulations: Congratulation[]
  student: Student
  bestWishIds?: Set<string>
  onCardClick?: (id: string) => void
  onTogglePin?: (wishId: string, pinned: boolean) => Promise<void>
}

function useNewWishIds(wishes: Congratulation[]) {
  const seenRef = useRef<Set<string>>(new Set())
  const [newIds, setNewIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const currentIds = new Set(wishes.map((w) => w.id))
    const fresh = new Set<string>()

    for (const id of currentIds) {
      if (!seenRef.current.has(id)) fresh.add(id)
    }

    seenRef.current = currentIds
    if (fresh.size === 0) return

    setNewIds(fresh)
    const timer = window.setTimeout(() => setNewIds(new Set()), 1400)
    return () => window.clearTimeout(timer)
  }, [wishes])

  return newIds
}

const MobileOrbit = memo(function MobileOrbit({
  congratulations,
  onSelect,
  newIds,
  bestWishIds,
}: {
  congratulations: Congratulation[]
  onSelect: (c: Congratulation) => void
  newIds: Set<string>
  bestWishIds?: Set<string>
}) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-6 snap-x snap-mandatory scrollbar-hide">
      <AnimatePresence mode="popLayout">
        {congratulations.map((c) => (
          <motion.div
            key={c.id}
            layout
            className="snap-center shrink-0"
            initial={newIds.has(c.id) ? { opacity: 0, scale: 0.5, y: 50, filter: 'blur(6px)' } : false}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.7, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <CongratulationCard
              congratulation={c}
              isHighlighted={bestWishIds?.has(c.id)}
              onClick={() => onSelect(c)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

export const OrbitSystem = memo(function OrbitSystem({
  congratulations,
  student,
  bestWishIds,
  onCardClick,
  onTogglePin,
}: OrbitSystemProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { rotation, parallaxX, parallaxY, radius } = useOrbitPhysics(280)
  const ringRotation = useTransform(rotation, (r) => `${(r * 180) / Math.PI}deg`)
  const counterRotation = useTransform(rotation, (r) => `${(-r * 180) / Math.PI * 0.6}deg`)
  const [focused, setFocused] = useState<Congratulation | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const newIds = useNewWishIds(congratulations)

  const handleSelect = useCallback(
    (c: Congratulation) => {
      setFocused(c)
      onCardClick?.(c.id)
    },
    [onCardClick],
  )

  const handleClose = useCallback(() => setFocused(null), [])

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="editorial-label mb-4 inline-block rounded-full border border-luxury-gold/30 bg-white/50 px-4 py-1.5 text-xs font-medium text-luxury-gold-dark backdrop-blur-sm">
            رسائل الحب والفخر
          </span>
          <h2 className="editorial-heading mb-4 text-3xl text-charcoal sm:text-4xl md:text-5xl">
            تهاني تدور حولك
          </h2>
          <p className="editorial-body mx-auto max-w-lg text-muted">
            كل رسالة تهنئة تطفو في فضاء خاص، تحيط بكِ كنجوم في سماء الاحتفال
          </p>
        </motion.div>

        {congratulations.length === 0 ? (
          <motion.p
            className="text-center text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            لا توجد تهاني بعد — كن أول من يهنئ!
          </motion.p>
        ) : isMobile ? (
          <MobileOrbit
            congratulations={congratulations}
            onSelect={handleSelect}
            newIds={newIds}
            bestWishIds={bestWishIds}
          />
        ) : (
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{ height: 720, perspective: 1400, transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute z-10"
              style={{ x: parallaxX, y: parallaxY }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-8 rounded-full bg-luxury-gold/15 blur-3xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-white shadow-2xl shadow-luxury-gold/25 md:h-32 md:w-32">
                  <img
                    src={student.profileImage}
                    alt={student.name}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {congratulations.map((c, i) => (
                  <OrbitCard
                    key={c.id}
                    congratulation={c}
                    index={i}
                    count={congratulations.length}
                    radius={radius}
                    rotation={rotation}
                    parallaxX={parallaxX}
                    parallaxY={parallaxY}
                    isHovered={hoveredId === c.id}
                    isNew={newIds.has(c.id)}
                    isHighlighted={bestWishIds?.has(c.id)}
                    onSelect={handleSelect}
                    onHoverStart={() => setHoveredId(c.id)}
                    onHoverEnd={() => setHoveredId(null)}
                  />
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ rotate: ringRotation }}
            >
              <div className="h-[540px] w-[540px] rounded-full border border-dashed border-luxury-gold/12" />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ rotate: counterRotation }}
            >
              <div className="h-[440px] w-[440px] rounded-full border border-luxury-gold/6" />
            </motion.div>
          </div>
        )}
      </div>

      <FocusedCard
        congratulation={focused}
        onClose={handleClose}
        onTogglePin={onTogglePin}
      />
    </section>
  )
})
