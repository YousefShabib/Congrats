import type { AIInsightStats } from '@/types/ai'

interface AIStatsPanelProps {
  insights: AIInsightStats
}

export function AIStatsPanel({ insights }: AIStatsPanelProps) {
  const items = [
    { label: 'أكثر شخص داعم', value: `${insights.mostSupportivePerson.name} (${insights.mostSupportivePerson.wishCount})` },
    { label: 'أطول تهنئة', value: `${insights.longestWish.length} حرف` },
    { label: 'أقصر تهنئة', value: `${insights.shortestWish.length} حرف` },
    { label: 'أكثر عبارة تكراراً', value: insights.mostRepeatedPhrase.slice(0, 40) },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-soft-beige/60 bg-white/60 p-4">
          <p className="editorial-label mb-1 text-xs text-muted">{label}</p>
          <p className="text-sm font-medium text-charcoal">{value}</p>
        </div>
      ))}
      {insights.topEmojis.length > 0 && (
        <div className="rounded-xl border border-soft-beige/60 bg-white/60 p-4 sm:col-span-2">
          <p className="editorial-label mb-2 text-xs text-muted">أكثر الإيموجي استخداماً</p>
          <div className="flex flex-wrap gap-3">
            {insights.topEmojis.map(({ emoji, count }) => (
              <span key={emoji} className="text-lg">
                {emoji} <span className="text-xs text-muted">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
