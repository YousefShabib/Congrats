import { motion } from 'framer-motion'
import {
  Brain,
  Loader2,
  MessageSquareQuote,
  Sparkles,
  Tag,
  TrendingUp,
} from 'lucide-react'
import type { AIInsightsBundle } from '@/types/ai'
import { AIStatsPanel } from '@/components/ai/AIStatsPanel'
import { BestWishesPanel } from '@/components/ai/BestWishesPanel'
import { KeywordCloud } from '@/components/ai/KeywordCloud'
import { SentimentChart } from '@/components/ai/SentimentChart'

interface AIInsightsSectionProps {
  insights: AIInsightsBundle | null
  loading?: boolean
  error?: string | null
}

export function AIInsightsSection({ insights, loading, error }: AIInsightsSectionProps) {
  if (loading && !insights) {
    return (
      <section className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-gold" />
      </section>
    )
  }

  if (!insights) return null

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/50 px-4 py-1 text-xs font-medium text-luxury-gold-dark">
            <Brain className="h-3.5 w-3.5" />
            مساعد التخرج الذكي
            {insights.provider === 'openai' && ' · OpenAI'}
          </span>
          <h2 className="mb-3 text-3xl font-bold text-charcoal sm:text-4xl">رؤى التهاني</h2>
          <p className="text-muted">تحويل مئات التهاني إلى ذكريات ومعاني</p>
          {error && <p className="mt-2 text-xs text-amber-700">يعمل بوضع محلي — {error}</p>}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-luxury-gold/20 bg-white/60 p-6 backdrop-blur-xl md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
                <Sparkles className="h-5 w-5 text-luxury-gold-dark" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">ملخص عاطفي</h3>
            </div>
            <p className="leading-relaxed text-charcoal/80">{insights.summary}</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-luxury-gold/20 bg-white/60 p-6 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
                <Tag className="h-5 w-5 text-luxury-gold-dark" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">سحابة الكلمات</h3>
            </div>
            <KeywordCloud keywords={insights.keywords} />
          </motion.div>

          <motion.div
            className="rounded-2xl border border-luxury-gold/20 bg-white/60 p-6 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
                <Brain className="h-5 w-5 text-luxury-gold-dark" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">تحليل المشاعر</h3>
            </div>
            <SentimentChart sentiment={insights.sentiment} />
          </motion.div>

          <motion.div
            className="rounded-2xl border border-luxury-gold/20 bg-white/60 p-6 backdrop-blur-xl md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
                <MessageSquareQuote className="h-5 w-5 text-luxury-gold-dark" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">أجمل التهاني</h3>
            </div>
            <BestWishesPanel bestWishes={insights.bestWishes} />
          </motion.div>

          <motion.div
            className="rounded-2xl border border-luxury-gold/20 bg-white/60 p-6 backdrop-blur-xl md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/30">
                <TrendingUp className="h-5 w-5 text-luxury-gold-dark" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal">رؤى إضافية</h3>
            </div>
            <AIStatsPanel insights={insights.insights} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
