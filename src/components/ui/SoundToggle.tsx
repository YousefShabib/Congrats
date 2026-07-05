import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-luxury-gold/20 bg-white/60 text-muted shadow-lg backdrop-blur-md transition-colors hover:border-luxury-gold/40 hover:text-luxury-gold-dark"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={enabled ? 'إيقاف الأصوات' : 'تفعيل الأصوات'}
      title={enabled ? 'إيقاف الأصوات' : 'تفعيل الأصوات'}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </motion.button>
  )
}
