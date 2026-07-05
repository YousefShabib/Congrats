import { motion } from 'framer-motion'
import type { AISentimentBucket } from '@/types/ai'

interface SentimentChartProps {
  sentiment: AISentimentBucket[]
}

export function SentimentChart({ sentiment }: SentimentChartProps) {
  return (
    <div className="space-y-4">
      {sentiment.map((item, i) => (
        <div key={item.category}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-charcoal">{item.label}</span>
            <span className="font-english text-muted">{item.percentage}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-soft-beige">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${item.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
