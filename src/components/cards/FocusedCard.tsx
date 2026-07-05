import { AnimatePresence, motion } from 'framer-motion'
import { Pin, PinOff, X } from 'lucide-react'
import { useState } from 'react'
import type { Congratulation } from '@/types'

interface FocusedCardProps {
  congratulation: Congratulation | null
  onClose: () => void
  onTogglePin?: (wishId: string, pinned: boolean) => Promise<void>
}

export function FocusedCard({ congratulation, onClose, onTogglePin }: FocusedCardProps) {
  const [pinning, setPinning] = useState(false)

  const handlePin = async () => {
    if (!congratulation || !onTogglePin) return
    setPinning(true)
    try {
      await onTogglePin(congratulation.id, !congratulation.isPinned)
    } finally {
      setPinning(false)
    }
  }

  return (
    <AnimatePresence>
      {congratulation && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8, y: '-40%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: '-40%', x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className={`relative rounded-3xl border bg-white/95 p-8 shadow-2xl backdrop-blur-xl ${
                congratulation.isPinned
                  ? 'border-luxury-gold shadow-glow ring-2 ring-luxury-gold/25'
                  : 'border-luxury-gold/30'
              }`}
            >
              <div className="absolute left-4 top-4 flex gap-2">
                {onTogglePin && (
                  <button
                    onClick={handlePin}
                    disabled={pinning}
                    className="rounded-full p-2 text-luxury-gold-dark transition-colors hover:bg-luxury-gold/10"
                    title={congratulation.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                  >
                    {congratulation.isPinned ? (
                      <PinOff className="h-5 w-5" />
                    ) : (
                      <Pin className="h-5 w-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-muted transition-colors hover:bg-luxury-gold/10 hover:text-charcoal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {congratulation.isPinned && (
                <motion.div
                  className="mb-4 flex items-center justify-center gap-1 text-xs font-medium text-luxury-gold-dark"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Pin className="h-3 w-3" />
                  رسالة مثبتة
                </motion.div>
              )}

              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-luxury-gold/30 to-luxury-gold-light/40 text-2xl font-bold text-luxury-gold-dark">
                  {congratulation.senderName.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-charcoal">
                  {congratulation.senderName}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {congratulation.createdAt.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="relative">
                <span className="absolute -top-3 right-2 text-4xl text-luxury-gold/30">"</span>
                <p className="px-4 text-center text-base leading-relaxed text-charcoal/90">
                  {congratulation.message}
                </p>
                <span className="absolute -bottom-6 left-2 text-4xl text-luxury-gold/30">"</span>
              </div>

              {congratulation.avatar && (
                <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-luxury-gold/20">
                  <img
                    src={congratulation.avatar}
                    alt={`صورة من ${congratulation.senderName}`}
                    className="max-h-80 w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
