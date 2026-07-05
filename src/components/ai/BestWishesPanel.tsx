import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { AIBestWish } from '@/types/ai'

interface BestWishesPanelProps {
  bestWishes: AIBestWish[]
}

export function BestWishesPanel({ bestWishes }: BestWishesPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {bestWishes.map((wish, i) => (
        <motion.div
          key={wish.wishId}
          className="relative overflow-hidden rounded-xl border border-luxury-gold/30 bg-gradient-to-br from-white/90 to-champagne/60 p-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -3, boxShadow: '0 12px 32px -8px rgba(201, 169, 98, 0.25)' }}
        >
          <Sparkles className="absolute left-3 top-3 h-4 w-4 text-luxury-gold/60" />
          <p className="mb-1 text-xs font-medium text-luxury-gold-dark">{wish.senderName}</p>
          <p className="mb-2 text-sm leading-relaxed text-charcoal/85">{wish.message}</p>
          <p className="text-xs text-muted">{wish.reason}</p>
        </motion.div>
      ))}
    </div>
  )
}
