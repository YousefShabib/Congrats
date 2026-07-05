import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { WishCardContent } from '@/components/cards/WishCardContent'
import type { Congratulation, Student } from '@/types'

interface LiveWallProps {
  student: Student
  congratulations: Congratulation[]
}

function WishCard({ wish, isNew }: { wish: Congratulation; isNew: boolean }) {
  const hasImage = Boolean(wish.avatar)

  return (
    <motion.article
      layout
      className={`overflow-hidden rounded-2xl border shadow-lg backdrop-blur-md ${
        wish.isPinned
          ? 'border-luxury-gold bg-white/95 ring-2 ring-luxury-gold/40'
          : isNew
            ? 'border-luxury-gold/60 bg-white/90'
            : 'border-white/20 bg-white/80'
      } ${hasImage ? 'p-0' : 'px-5 py-4'}`}
      initial={isNew ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className={hasImage ? 'p-5 pb-3' : ''}>
        <WishCardContent wish={wish} imageSize="wall" messagePreview={null} isNew={isNew} />
      </div>
    </motion.article>
  )
}

export const LiveWall = memo(function LiveWall({ student, congratulations }: LiveWallProps) {
  const seenRef = useRef<Set<string>>(new Set())
  const [newIds, setNewIds] = useState<Set<string>>(new Set())

  const sorted = useMemo(
    () =>
      [...congratulations].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return b.createdAt.getTime() - a.createdAt.getTime()
      }),
    [congratulations],
  )

  useEffect(() => {
    const fresh = new Set<string>()
    for (const w of sorted) {
      if (!seenRef.current.has(w.id)) fresh.add(w.id)
    }
    seenRef.current = new Set(sorted.map((w) => w.id))
    if (fresh.size > 0) {
      setNewIds(fresh)
      const t = window.setTimeout(() => setNewIds(new Set()), 4000)
      return () => window.clearTimeout(t)
    }
  }, [sorted])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-charcoal via-[#2a2520] to-luxury-gold-dark/40" dir="rtl">
      <header className="flex shrink-0 items-center gap-4 border-b border-white/10 px-6 py-4 text-white">
        <img
          src={student.profileImage}
          alt={student.name}
          className="h-14 w-14 rounded-full border-2 border-luxury-gold object-cover"
        />
        <div>
          <p className="text-xl font-semibold">{student.name}</p>
          <p className="flex items-center gap-1.5 text-sm text-white/70">
            <Heart className="h-3.5 w-3.5 text-luxury-gold" />
            {congratulations.length} تهنئة
          </p>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center text-white/60">
          <p>لا توجد تهاني بعد — ستظهر هنا فور وصولها</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {sorted.map((wish) => (
                <WishCard key={wish.id} wish={wish} isNew={newIds.has(wish.id)} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
})
