import { motion } from 'framer-motion'
import type { AIKeyword } from '@/types/ai'

interface KeywordCloudProps {
  keywords: AIKeyword[]
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  if (keywords.length === 0) {
    return <p className="py-8 text-center text-muted">لا توجد كلمات بعد</p>
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6">
      {keywords.map((kw, i) => (
        <motion.div
          key={kw.word}
          className="group relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ scale: 1.08 }}
        >
          <span
            className="font-semibold text-luxury-gold-dark transition-colors group-hover:text-luxury-gold"
            style={{ fontSize: kw.size * 0.55 + 8 }}
          >
            {kw.word}
          </span>
          <span className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 rounded bg-charcoal/80 px-2 py-0.5 text-[10px] text-white group-hover:block">
            #{kw.rank} · {kw.count}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
