import { AnimatePresence, motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Award, Sparkles, X } from 'lucide-react'

interface CelebrationOverlayProps {
  milestone: number | null
  onDismiss: () => void
}

export function CelebrationOverlay({ milestone, onDismiss }: CelebrationOverlayProps) {
  return (
    <AnimatePresence>
      {milestone !== null && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={400}
            colors={['#c9a962', '#e8d5a3', '#a68b4b', '#fffdf9']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9998 }}
          />
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          >
            <motion.div
              className="relative mx-4 max-w-sm rounded-3xl border border-luxury-gold/40 bg-cream/95 p-10 text-center shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onDismiss}
                className="absolute left-4 top-4 rounded-full p-1.5 text-muted hover:bg-luxury-gold/10"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: 2 }}
              >
                <Award className="mx-auto mb-4 h-16 w-16 text-luxury-gold" />
              </motion.div>

              <Sparkles className="mx-auto mb-2 h-6 w-6 text-luxury-gold-dark" />
              <h3 className="editorial-heading mb-2 text-2xl text-charcoal">
                {milestone} تهنئة!
              </h3>
              <p className="editorial-body text-muted">
                إنجاز رائع — استمروا في مشاركة الفرح
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
