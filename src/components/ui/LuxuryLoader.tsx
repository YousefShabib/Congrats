import { motion } from 'framer-motion'

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-soft-beige/60 ${className ?? ''}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  )
}

export function LuxuryLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-white/90 backdrop-blur-md"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="mb-12 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <ShimmerBlock className="h-32 w-32 rounded-full" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-luxury-gold/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <ShimmerBlock className="h-4 w-48" />
        <ShimmerBlock className="h-3 w-32" />
      </motion.div>

      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-luxury-gold/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <ShimmerBlock className="mx-auto mb-8 h-8 w-64" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerBlock key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}
